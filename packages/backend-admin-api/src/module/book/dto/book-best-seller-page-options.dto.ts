import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty } from 'class-validator';

import { PageOptionsDto } from '../../../common';

export class BookBestSellerPageOptions extends PageOptionsDto {
    @ApiProperty({ description: 'Ngày bắt đầu' })
    @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống!' })
    @IsISO8601({ strict: true }, { message: 'Ngày phải có dạng ISO string!' })
    start: string;

    @ApiProperty({ description: 'Ngày kết thúc' })
    @IsNotEmpty({ message: 'Ngày kết thúc không được để trống!' })
    @IsISO8601({ strict: true }, { message: 'Ngày phải có dạng ISO string!' })
    end: string;
}
