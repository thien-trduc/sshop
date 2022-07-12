import { ApiProperty } from '@nestjs/swagger';
import { UtilService } from '@tproject/libs/core';
import type { CategoryModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CategoryCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    @Transform((value) => `${value}`.trim())
    name: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    description: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    icon?: string;

    @ApiProperty()
    @Transform((value) => Number(value))
    priority?: number;

    toModel(): CategoryModel {
        return {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            name: this.name,
            description: this.description,
            icon: this.icon,
            slug: UtilService.slugVietnameseName(this.name),
            priority: this.priority,
        };
    }
}
