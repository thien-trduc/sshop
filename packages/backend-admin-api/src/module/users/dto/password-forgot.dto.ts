import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { ValidationMessage } from './../../../constant/enum/error-message.enum';

export class PasswordForgotDto {
    @ApiProperty()
    @IsNotEmpty({ message: `username ${ValidationMessage.EMPTY}` })
    @IsEmail({}, { message: `${ValidationMessage.EMAIL}` })
    username: string;
}
