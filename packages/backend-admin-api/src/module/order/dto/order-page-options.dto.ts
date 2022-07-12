import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { PageOptionsDto } from './../../../common/dto/page-options.dto';

export class OrderPageOptionsDto extends PageOptionsDto {
    @ApiProperty({ required: false })
    @Transform((value) => `${value}`)
    status?: string;

    @ApiProperty({ required: false })
    @Transform((value) => Number(value))
    customer_id?: number;
}
