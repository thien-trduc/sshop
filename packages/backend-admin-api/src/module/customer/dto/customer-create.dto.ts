import { ApiProperty } from '@nestjs/swagger';
import type { CustomerModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';

import { NO_CONFIG } from './../../../constant';

export class CustomerCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Họ tên không được để trống!' })
    @Transform((value) => `${value}`.trim())
    fullname: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: 'Giới tính không được trống!' })
    @Transform((value) => Number(value))
    sex: number;

    @ApiProperty()
    @IsNotEmpty()
    @Transform((value) => `${value}`.trim())
    birthdate: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Số diện thoại không được để trống !' })
    @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng!' })
    @Transform((value) => `${value}`.trim())
    phone: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Email không đúng định dạng !' })
    @IsNotEmpty({ message: 'Email không được để trống !' })
    @Transform((value) => `${value}`.trim())
    email: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    avatar?: string;

    toModel(): CustomerModel {
        return {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            fullname: this.fullname,
            surname: NO_CONFIG,
            name: this.fullname,
            sex: this.sex,
            birthdate: this.birthdate,
            phone: this.phone,
            email: this.email,
            address: NO_CONFIG,
            userId: 0,
            avatar: this.avatar,
        };
    }
}
