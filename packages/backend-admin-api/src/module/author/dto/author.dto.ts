import { ApiProperty } from '@nestjs/swagger';
import type { AuthorModel } from '@tproject/libs/data';

import { BaseDto } from './../../../common/dto/base.dto';

export class AuthorDto extends BaseDto {
    @ApiProperty()
    fullname: string;

    @ApiProperty()
    sex: number;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    birthdate: string;

    static fromModel(model: AuthorModel): AuthorDto {
        return {
            id: model.id,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            fullname: model.fullname,
            birthdate: model.birthdate,
            sex: model.sex,
            phone: model.phone,
            address: model.address,
            email: model.email,
        };
    }
}
