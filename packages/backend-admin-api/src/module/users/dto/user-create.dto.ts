import { ApiProperty } from '@nestjs/swagger';
import type { UserModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserCreateDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Username phải ở định dạng email!' })
    @IsNotEmpty({ message: 'Username không được trống!' })
    @Transform((value) => `${value}`.trim())
    username: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password không được trống!' })
    @Transform((value) => `${value}`.trim())
    password: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    avatar: string;

    constructor(username: string, password: string, avatar: string) {
        this.username = username;
        this.password = password;
        this.avatar = avatar;
    }

    toModel(): UserModel {
        return {
            id: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            username: this.username,
            password: this.password,
            avatar: this.avatar,
            refresh_token: undefined,
        };
    }
}
