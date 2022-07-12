import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, Validate } from 'class-validator';

import { ValidationMessage } from '../../../constant/enum/error-message.enum';
import { ValidOtp } from './../../../common/validation/otp.validate';

export class PasswordRecoveryDto {
    @ApiProperty()
    @IsNotEmpty({ message: `Mã otp ${ValidationMessage.EMPTY}` })
    @MinLength(6)
    @MaxLength(6)
    @Validate(ValidOtp, { message: 'OTP phải là số có 6 chữ số!' })
    otp: string;
}
