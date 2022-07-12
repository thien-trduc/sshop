import { ApiProperty } from '@nestjs/swagger';
import type { RoleModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class RoleCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên quyền không được để trống!' })
    @Transform((value) => `${value}`.trim().toUpperCase())
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mô tả quyền không được để trống!' })
    @Transform((value) => `${value}`.trim())
    description: string;

    toModel(): RoleModel {
        return {
            id: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            name: this.name,
            description: this.description,
        };
    }
}
