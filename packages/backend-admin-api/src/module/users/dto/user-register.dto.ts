import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

import { ValidationMessage } from '../../../constant';
import { IsPassword, IsPhoneNumber } from '../../../decorator/validator.decorators';

export class UserRegisterDto {
    // @ApiProperty()
    // @IsNotEmpty({ message: `name ${ValidationMessage.EMPTY}` })
    // @Transform((value) => `${value}`.trim())
    // name: string;

    // @ApiProperty()
    // @IsNotEmpty({ message: `surname ${ValidationMessage.EMPTY}` })
    // @Transform((value) => `${value}`.trim())
    // surname: string;

    @ApiProperty()
    @IsNotEmpty({ message: `surname ${ValidationMessage.EMPTY}` })
    @Transform((value) => `${value}`.trim())
    fullname: string;

    @ApiProperty()
    @IsPhoneNumber({ region: 'VN', message: ValidationMessage.PHONE })
    @Transform((value) => `${value}`.trim())
    @ValidateIf((o) => o.mobile)
    mobile: string;

    @ApiProperty({
        description: 'username is email',
        required: true,
        default: 'tntran496@gmail.com',
    })
    @IsNotEmpty({ message: `username ${ValidationMessage.EMPTY}` })
    @IsEmail({}, { message: ValidationMessage.EMAIL })
    @Transform((value) => `${value}`.trim())
    username: string;

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

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    avatar?: string;
}
