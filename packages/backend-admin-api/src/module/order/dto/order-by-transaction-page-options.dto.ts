import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { PageOptionsDto } from './../../../common/dto/page-options.dto';

export class OrderByTransationPageOptionsDto extends PageOptionsDto {
    @ApiProperty()
    @IsNotEmpty()
    @Transform((value) => `${value}`.trim())
    transactionId: string;
}
