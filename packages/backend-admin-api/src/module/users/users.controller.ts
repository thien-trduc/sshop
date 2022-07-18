import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { BaseReponse } from '../../common/dto/base-respone.dto';
import { JwtAuthGuard } from './../../guard/user.guard';
import { PasswordForgotDto } from './dto/password-forgot.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import type { SocialLoginVerifyDto } from './dto/social-login-verify.dto';
import type { UserDto } from './dto/user.dto';
import { UserRefreshTokenDto } from './dto/user-refresh-token.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User - Người Dùng')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post('login')
    @ApiOperation({ summary: '[USER] - Đăng nhập người dùng' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        type: SocialLoginDto,
    })
    login(@Body() formData: SocialLoginDto): Promise<SocialLoginVerifyDto> {
        return this.service.login(formData);
    }

    @Post('register')
    @ApiOperation({ summary: '[USER] - Đăng ký người dùng' })
    @ApiBody({
        type: UserRegisterDto,
    })
    register(@Body() formData: UserRegisterDto): Promise<UserDto> {
        return this.service.register(formData);
    }

    @Post('password/forgot')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '[USER] - Quên mật khẩu' })
    @ApiBody({
        type: PasswordForgotDto,
    })
    forgotPassword(@Body() formData: PasswordForgotDto): Promise<BaseReponse<{ isOK: boolean }>> {
        return this.service.forgotPassword(formData);
    }

    @Post('password/recovery')
    @ApiOperation({ summary: '[USER] - Tạo otp và cấp lại mật khẩu' })
    @ApiBody({
        type: PasswordRecoveryDto,
    })
    recoveryPassword(@Body() formData: PasswordRecoveryDto): Promise<SocialLoginVerifyDto> {
        return this.service.recoveryPassword(formData);
    }

    @Patch('password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Cập nhật lại mật khẩu' })
    updatePasswordUser(@Body() formData: PasswordResetDto): Promise<BaseReponse<{ isOK: boolean }>> {
        return this.service.updatePasswordUser(formData);
    }

    @Patch('token/refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '[USER] - Thực hiện lại phiên đăng nhập' })
    @ApiBody({
        type: UserRefreshTokenDto,
    })
    refreshToken(@Body() formData: UserRefreshTokenDto): Promise<SocialLoginVerifyDto> {
        return this.service.refreshToken(formData);
    }
}
