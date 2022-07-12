import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class OrderReportOptionsDto {
    @ApiProperty()
    @IsDateString({}, { message: 'Ngày bắt đầu' })
    start: string;

    @ApiProperty()
    @IsDateString({}, { message: 'Ngày kết thúc' })
    end: string;
}
