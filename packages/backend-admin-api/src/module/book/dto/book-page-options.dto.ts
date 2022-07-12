import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, ValidateIf } from 'class-validator';

import { PageOptionsDto } from '../../../common';

export class BookPageOptionsDto extends PageOptionsDto {
    @ApiProperty({ required: false })
    @IsNumber()
    @Transform((value) => Number(value))
    @ValidateIf((o) => o.categoryId)
    categoryId?: number;

    @ApiProperty({ required: false })
    @Transform((value) => `${value}`.trim())
    categorySlug?: string;
}
