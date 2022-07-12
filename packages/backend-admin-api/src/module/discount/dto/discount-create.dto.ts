import { ApiProperty } from '@nestjs/swagger';
import type { DiscountModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import * as moment from 'moment';

export class DiscountCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tiêu đề giảm giá không được để trống!' })
    @Transform((value) => `${value}`.trim())
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống!' })
    @Transform((value) => `${value}`.trim())
    start_date: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Ngày kết thúc không được để trống!' })
    @Transform((value) => `${value}`.trim())
    end_date: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    description: string;

    @ApiProperty()
    @IsNumber()
    @Transform((value) => Number(value))
    employee_id: number;

    toModel(): DiscountModel {
        return {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            name: this.name,
            start_date: moment(this.start_date).utc().toDate(),
            end_date: moment(this.end_date).utc().toDate(),
            description: this.description,
            employee_id: this.employee_id,
        };
    }
}
