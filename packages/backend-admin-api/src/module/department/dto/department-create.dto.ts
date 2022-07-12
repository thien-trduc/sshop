import { ApiProperty } from '@nestjs/swagger';
import type { DepartmentModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DepartmentCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên phòng ban không được để trống!' })
    @Transform((value) => `${value}`.trim())
    name: string;

    toModel(): DepartmentModel {
        return {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            name: this.name,
        };
    }
}
