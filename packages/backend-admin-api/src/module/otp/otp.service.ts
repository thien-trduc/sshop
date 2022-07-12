import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IPgDataService } from '@tproject/libs/data';
import * as jwt from 'jsonwebtoken';

import { ErrorMessage } from '../../constant';
import { MessageTypeEnum } from '../../constant/enum/message-type.enum';
import { Topic } from '../../constant/enum/topic.enum';
import { ConfigsJwtService } from '../../shared/service/configs.jwt.service';
import { Exchange, RoutingKey } from '../../shared/service/configs.rabbit.service';

@Injectable()
export class OtpService {
    private readonly logger = new Logger(OtpService.name);

    constructor(private readonly amqp: AmqpConnection, private readonly data: IPgDataService, private readonly jwtConfig: ConfigsJwtService) {}

    async genOtp(userId: number, email: string): Promise<void> {
        let otp: number;

        try {
            otp = await this.data.otp.getOtp();
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (otp === 0) {
            this.logger.error(`Có lỗi khi tạo otp`);

            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const jwtOtpOptions = this.jwtConfig.createJwtOtpOptions(`${otp}`);

        const token = jwt.sign(
            {
                userId,
                email,
            },
            jwtOtpOptions.secret,
            jwtOtpOptions.signOptions,
        );

        try {
            await this.data.otp.createTokenVerifyOtp({
                otp,
                token,
                createdat: undefined,
                updatedat: undefined,
            });
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        void this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.EVENT_CREATE, {
            type: MessageTypeEnum.MAIL,
            title: 'User Reset Pasword',
            topicId: Topic.USER_RESET_PASSWORD_OTP,
            data: {
                to: email,
                dynamicData: {
                    otp: `${otp}`,
                },
            },
        });
    }

    async verifyOtp(otp: string): Promise<{ userId: number }> {
        const tokenVerifyOtp = await this.data.otp.findOneTokenVerifyOtp({ otp: Number(otp) });

        if (!tokenVerifyOtp) {
            this.logger.error(`Không tìm thấy token theo otp`);

            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const jwtOtpOptions = this.jwtConfig.createJwtOtpOptions(`${tokenVerifyOtp.otp}`);
        let jwtVeifyOtpData: any;

        try {
            jwtVeifyOtpData = jwt.verify(tokenVerifyOtp.token, jwtOtpOptions.secret, jwtOtpOptions.signOptions);
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(`Token không còn hiệu lực! Xin thử lại!`, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            userId: jwtVeifyOtpData?.userId,
        };
    }

    recoveryOtpStore(otp: string): Promise<void> {
        return this.data.otp.recoveryOtpStore(otp);
    }
}
