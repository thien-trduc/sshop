import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UtilService } from '@tproject/libs/core';
import type { UserModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';
import { FirebaseAuthenticationService } from '@tproject/libs/firebase-admin';
import * as jwt from 'jsonwebtoken';
import { first } from 'lodash';

import type { BaseReponse } from '../../common/dto/base-respone.dto';
import type { FirebaseVerifyTokenClaims, UserRecord } from '../../common/types';
import { ErrorMessage, TypeLoginEnum } from '../../constant';
import { MessageTypeEnum } from '../../constant/enum/message-type.enum';
import { Topic } from '../../constant/enum/topic.enum';
import { CustomerProvider, GeneratorProvider } from '../../provider';
import { ConfigsJwtService } from '../../shared/service/configs.jwt.service';
import { Exchange, RoutingKey } from '../../shared/service/configs.rabbit.service';
import { ConfigsService } from '../../shared/service/configs.service';
import { OtpService } from '../otp/otp.service';
import type { PasswordForgotDto } from './dto/password-forgot.dto';
import type { PasswordRecoveryDto } from './dto/password-recovery.dto';
import type { PasswordResetDto } from './dto/password-reset.dto';
import type { SocialLoginDto } from './dto/social-login.dto';
import { SocialLoginVerifyDto } from './dto/social-login-verify.dto';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { UserProfileCreateDto } from './dto/user-profile-create.dto';
import type { UserRefreshTokenDto } from './dto/user-refresh-token.dto';
import type { UserRegisterDto } from './dto/user-register.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        private readonly configService: ConfigsService,
        private readonly configJwtService: ConfigsJwtService,
        private readonly firebaseAuth: FirebaseAuthenticationService,
        private readonly amqp: AmqpConnection,
        private readonly data: IPgDataService,
        private readonly otpService: OtpService,
        private readonly customerProvider: CustomerProvider,
    ) {}

    async validateUser(username: string, password: string): Promise<UserDto> {
        const user = await this.data.user.findOne({ username });

        if (user || user.password === password || password !== user.password) {
            throw new HttpException(ErrorMessage.AUTHORIZATION, HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    async register(formData: UserRegisterDto): Promise<UserDto> {
        const { passwordReEnter, password, username, avatar, ...data } = formData;
        let hashString: string;
        let userDto: UserDto;

        const user = await this.data.user.findOne({ username });

        if (user) {
            throw new HttpException('Username này đã tồn tại xin thử lại !', HttpStatus.CONFLICT);
        }

        if (passwordReEnter !== password) {
            throw new HttpException('Xác nhận mật khậu không đúng xin nhập lại', HttpStatus.BAD_REQUEST);
        }

        try {
            hashString = await UtilService.hashPassword(password, Number(this.configService.saltHash));
        } catch (error) {
            this.logger.error(error?.message || 'Hash pasword bi lỗi!');

            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const userCreateDto = new UserCreateDto(username, hashString, avatar);
        const userProfileCreateDto = new UserProfileCreateDto(data.fullname, data.mobile);

        try {
            const userRes = await this.data.user.createWithProfile(userCreateDto.toModel(), userProfileCreateDto.toModel());
            userDto = UtilService.excludePropObj({ ...userRes }, 'password');
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                this.logger.log(error.code, error.message);

                throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        await Promise.all([
            this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.MAP_PROFILE_TO_CUSTOMER, { userId: userDto.id }),
            this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.EVENT_CREATE, {
                type: MessageTypeEnum.MAIL,
                title: 'User Register',
                topicId: Topic.USER_REGISTER,
                data: {
                    to: username,
                    dynamicData: {
                        name: `${data.fullname}`,
                        title: 'SShop',
                    },
                },
            }),
        ]);

        return userDto;
    }

    async login(formData: SocialLoginDto): Promise<SocialLoginVerifyDto> {
        let socialLoginVerifyDto: SocialLoginVerifyDto;

        switch (formData.type) {
            case TypeLoginEnum.GOOGLE:
            case TypeLoginEnum.FACEBOOK:
            case TypeLoginEnum.GITHUB:
                socialLoginVerifyDto = await this.loginSocial(formData);
                break;
            case TypeLoginEnum.PASSWORD:
                socialLoginVerifyDto = await this.loginPassword(formData);
                break;
        }

        const findUser = await this.data.user.findOne({ username: formData.username });

        this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.CREATE_CART_FOR_CUSTOMER, { userId: findUser.id });

        const roles = await this.data.role.getAllRoleByUser(findUser.id);

        if (!roles || roles.length === 0) {
            this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.PROVIDER_ROLE_FOR_USER, { userId: findUser.id });

            socialLoginVerifyDto = {
                ...socialLoginVerifyDto,
                role: ['USER'],
            };
        } else {
            socialLoginVerifyDto = {
                ...socialLoginVerifyDto,
                role: roles,
            };
        }

        return socialLoginVerifyDto;
    }

    async loginSocial(formData: SocialLoginDto): Promise<SocialLoginVerifyDto> {
        let userDto = new UserDto();
        let payloadClaims: FirebaseVerifyTokenClaims;
        let userSocial: UserRecord;
        let socialLoginVerifyDto = new SocialLoginVerifyDto();
        const jwtOptions = this.configJwtService.verifyJwtOptions;

        if (!formData?.username) {
            throw new HttpException(`Tài khoản social không tồn tại email ! Xin đăng nhập bằng tài khoản social khác!`, HttpStatus.BAD_REQUEST);
        }

        try {
            payloadClaims = await this.firebaseAuth.verifyIdToken(formData.accessToken);
        } catch (error) {
            this.logger.error(error?.message || ErrorMessage.INTERNAL_FIREBASE);

            throw new HttpException(ErrorMessage.INTERNAL_FIREBASE, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!payloadClaims) {
            throw new HttpException('Không tìm thấy dữ liệu từ firebase ! Xin đăng nhập lại !', HttpStatus.BAD_REQUEST);
        }

        try {
            userSocial = await this.firebaseAuth.getUser(payloadClaims.uid);
        } catch (error) {
            this.logger.error(error?.message || ErrorMessage.INTERNAL_FIREBASE);

            throw new HttpException(ErrorMessage.INTERNAL_FIREBASE, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        let userData = await this.data.user.findOne({ username: formData.username });
        userDto = {
            ...userData,
        };

        if (!userData) {
            const { displayName, phoneNumber = '', photoURL = '' } = first(userSocial.providerData);
            const password = GeneratorProvider.generatePassword();
            userDto = await this.register({
                username: formData.username,
                password,
                passwordReEnter: password,
                mobile: phoneNumber,
                avatar: photoURL,
                fullname: displayName,
            });
        }

        userData = await this.data.user.findOne({ username: formData.username });

        const refreshToken = await this.genRefresToken(userData);

        socialLoginVerifyDto = {
            token: jwt.sign(
                {
                    type: 'login',
                    username: userDto.username,
                    id: userDto.id,
                },
                jwtOptions.secret,
                jwtOptions.signOptions,
            ),
            refreshToken,
            userId: userDto.id,
        };

        return socialLoginVerifyDto;
    }

    async loginPassword(formData: SocialLoginDto): Promise<SocialLoginVerifyDto> {
        let socialLoginVerifyDto = new SocialLoginVerifyDto();
        const jwtOptions = this.configJwtService.verifyJwtOptions;

        const { username, password } = formData;
        const user = await this.data.user.findOne({ username });

        if (!user) {
            throw new HttpException(`Không tìm thấy tài khoản với username: ${username}! Xin đăng nhập bằng tài khoản khác !`, HttpStatus.NOT_FOUND);
        }

        const isCorrectPassword = await UtilService.comparePassword(password, user.password);

        if (!isCorrectPassword) {
            throw new HttpException(`Mật khẩu không đúng xin nhập lại!`, HttpStatus.UNAUTHORIZED);
        }

        const refreshToken = await this.genRefresToken(user);

        socialLoginVerifyDto = {
            token: jwt.sign(
                {
                    type: 'login',
                    username: user.username,
                    id: user.id,
                },
                jwtOptions.secret,
                jwtOptions.signOptions,
            ),
            refreshToken,
            userId: user.id,
        };

        return socialLoginVerifyDto;
    }

    async refreshToken(formData: UserRefreshTokenDto): Promise<SocialLoginVerifyDto> {
        let socialLoginVerifyDto = new SocialLoginVerifyDto();
        const jwtOptions = this.configJwtService.verifyJwtOptions;
        const jwtRefreshOptions = this.configJwtService.verifyJwtRefreshOptions;

        try {
            jwt.verify(formData.secret, jwtRefreshOptions.secret, jwtRefreshOptions.signOptions);
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException('Ủy quyền không thành công! Xin đăng nhập lại !', HttpStatus.UNAUTHORIZED);
        }

        const user = await this.data.user.findOne({
            refresh_token: formData.secret,
        });

        if (!user) {
            this.logger.error('Refresh token không đúng xin kiểm tra lại!');

            throw new HttpException(`Refresh token không đúng xin kiểm tra lại!`, HttpStatus.NOT_FOUND);
        }

        const roles = await this.data.role.getAllRoleByUser(user.id);

        socialLoginVerifyDto = {
            token: jwt.sign(
                {
                    type: 'login',
                    username: user.username,
                    id: user.id,
                },
                jwtOptions.secret,
                jwtOptions.signOptions,
            ),
            refreshToken: user.refresh_token,
            userId: user.id,
        };

        if (!roles || roles.length === 0) {
            this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.PROVIDER_ROLE_FOR_USER, { userId: user.id });

            socialLoginVerifyDto = {
                ...socialLoginVerifyDto,
                role: ['USER'],
            };
        } else {
            socialLoginVerifyDto = {
                ...socialLoginVerifyDto,
                role: roles,
            };
        }

        return socialLoginVerifyDto;
    }

    async genRefresToken(user: UserModel): Promise<string> {
        const jwtRefreshOptions = this.configJwtService.verifyJwtRefreshOptions;

        const refreshToken = jwt.sign(
            {
                type: 'refresh',
                username: user.username,
                id: user.id,
            },
            jwtRefreshOptions.secret,
            jwtRefreshOptions.signOptions,
        );

        try {
            await this.data.user.update(user.id, {
                ...user,
                refresh_token: refreshToken,
            });
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.UNAUTHORIZED);
        }

        return refreshToken;
    }

    async forgotPassword(formData: PasswordForgotDto): Promise<BaseReponse<{ isOK: boolean }>> {
        const user = await this.data.user.findOne({ username: formData.username });

        if (!user) {
            throw new HttpException(`Không tìm tháy thông tin tài khoản với username: ${formData.username}`, HttpStatus.NOT_FOUND);
        }

        try {
            await this.otpService.genOtp(user.id, user.username);
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.OK,
            message: `Yêu cầu cấp lại mật khẩu thành công! Xin kiểm tra mail ${user.username} để nhập OTP của bạn!`,
            data: {
                isOK: true,
            },
        };
    }

    async recoveryPassword(formData: PasswordRecoveryDto): Promise<SocialLoginVerifyDto> {
        let data: { userId: number };
        let socialLoginVerifyDto = new SocialLoginVerifyDto();
        const jwtOptions = this.configJwtService.verifyJwtOptions;

        try {
            data = await this.otpService.verifyOtp(formData.otp);
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const user = await this.data.user.findById(data.userId);

        socialLoginVerifyDto = {
            token: jwt.sign(
                {
                    username: user.username,
                    id: user.id,
                },
                jwtOptions.secret,
                jwtOptions.signOptions,
            ),
            refreshToken: user.refresh_token,
            userId: user.id,
        };

        const refreshToken = await this.genRefresToken(user);
        const roles = await this.data.role.getAllRoleByUser(user.id);

        if (!roles || roles.length === 0) {
            this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.PROVIDER_ROLE_FOR_USER, { userId: user.id });

            socialLoginVerifyDto = {
                ...socialLoginVerifyDto,
                refreshToken,
                role: ['USER'],
            };
        } else {
            socialLoginVerifyDto = {
                ...socialLoginVerifyDto,
                role: roles,
                refreshToken,
            };
        }

        void this.otpService.recoveryOtpStore(`${formData.otp}`);

        return socialLoginVerifyDto;
    }

    async updatePasswordUser(formData: PasswordResetDto): Promise<BaseReponse<{ isOK: boolean }>> {
        const customer = await this.customerProvider.customer();

        if (formData.password !== formData.passwordReEnter) {
            throw new HttpException(`Password nhập lại không đúng! Xin nhập lại!`, HttpStatus.BAD_REQUEST);
        }

        let hashString: string;

        try {
            hashString = await UtilService.hashPassword(formData.password, Number(this.configService.saltHash));
        } catch (error) {
            this.logger.error(error?.message || 'Hash pasword bi lỗi!');

            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const user = await this.data.user.findById(customer.userId);

        try {
            await this.data.user.update(customer.userId, {
                ...user,
                password: hashString,
            });
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'Cập nhật mật khẩu mới thành công',
            data: {
                isOK: true,
            },
        };
    }
}
