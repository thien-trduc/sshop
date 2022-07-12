import { ApiProperty } from '@nestjs/swagger';
import type { AuthorModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class AuthorCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Họ tên không được để trống !' })
    @Transform((value) => `${value}`.trim())
    fullname: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Giới tính không được để trống !' })
    @Transform((value) => Number(value))
    sex: number;

    @ApiProperty()
    @IsPhoneNumber('VN', { message: 'Số điện thoại phải đúng định dạng !' })
    @IsNotEmpty({ message: 'Số điện thoại không được để trống !' })
    @Transform((value) => `${value}`.trim())
    phone: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Địa chỉ không được để trống !' })
    @Transform((value) => `${value}`.trim())
    address: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Xin nhập đúng định dạng email !' })
    @IsNotEmpty({ message: 'Email không được để trống !' })
    @Transform((value) => `${value}`.trim())
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @Transform((value) => `${value}`.trim())
    birthdate: string;

    toModel(): AuthorModel {
        return {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            fullname: this.fullname,
            birthdate: this.birthdate,
            sex: this.sex,
            phone: this.phone,
            address: this.address,
            email: this.email,
        };
    }
}
