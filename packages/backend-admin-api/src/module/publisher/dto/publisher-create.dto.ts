import { PublisherModel } from '@tproject/libs/data';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class PublisherCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên nhà xuất bản không được để trống!' })
    @Transform((value) => `${value}`.trim())
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Địa chỉ nhà xuất bản không được để trống!' })
    @Transform((value) => `${value}`.trim())
    address: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Xin nhập đúng định dạng Email!' })
    @IsNotEmpty({ message: 'Email không được để trống!' })
    @Transform((value) => `${value}`.trim())
    email: string;

    toModel(): PublisherModel {
        return {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            name: this.name,
            address: this.address,
            email: this.email,
        };
    }
}
