import { ApiProperty } from '@nestjs/swagger';
import type { UserProfile } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { NO_CONFIG } from './../../../constant';
import { ValidationMessage } from './../../../constant/enum/error-message.enum';

export class UserProfileCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: `Họ tên ${ValidationMessage.EMPTY}` })
    @Transform((value) => `${value}`.trim())
    fullname: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    mobile: string;

    constructor(fullname: string, mobile: string) {
        this.fullname = fullname;
        this.mobile = mobile;
    }

    toModel(): UserProfile {
        return {
            gender: false,
            email: '',
            userId: 0,
            age: 0,
            id: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            birthdate: undefined,
            address: '',
            name: this.fullname,
            surname: NO_CONFIG,
            mobile: this.mobile,
            fullname: this.fullname,
        };
    }
}
