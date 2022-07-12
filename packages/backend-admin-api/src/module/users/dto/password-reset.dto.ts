import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { IsPassword } from '../../../decorator/validator.decorators';
import { ValidationMessage } from './../../../constant/enum/error-message.enum';

export class PasswordResetDto {
    @ApiProperty({ required: true, default: '123456ab#' })
    @IsPassword({ message: ValidationMessage.PASSWORD })
    @IsNotEmpty({ message: `password ${ValidationMessage.EMPTY}` })
    @Transform((value) => `${value}`.trim())
    password: string;

    @ApiProperty({ required: true, default: '123456ab#' })
    @IsPassword({ message: ValidationMessage.PASSWORD })
    @IsNotEmpty({ message: `password ${ValidationMessage.EMPTY}` })
    @Transform((value) => `${value}`.trim())
    passwordReEnter: string;
}
