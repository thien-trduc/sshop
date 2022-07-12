import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { OrderLower } from '../../constant';
import { EnumFieldOptional, NumberFieldOptional } from '../../decorator';

export class PageOptionsDto {
    @EnumFieldOptional(() => OrderLower, {
        default: OrderLower.ASC,
    })
    readonly order: OrderLower = OrderLower.ASC;

    @NumberFieldOptional({
        minimum: 0,
        default: 0,
        int: true,
    })
    readonly page: number = 1;

    @NumberFieldOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
        int: true,
    })
    readonly take: number = 10;

    get skip(): number {
        return this.page * this.take;
    }

    @ApiProperty({ required: false })
    @Transform((value) => `${value}`.trim())
    readonly q?: string;
}
