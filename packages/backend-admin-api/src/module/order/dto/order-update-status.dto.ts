import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class OrderUpdateStatusDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Trạng thái thanh toán không được để trống !' })
    @Transform((value) => Number(value))
    status: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Id transaction đơn hàng không được để trống !' })
    @Transform((value) => `${value}`.trim())
    transactionId: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Customer id không được để trống !' })
    @Transform((value) => Number(value))
    customerId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Id giỏ hàng không được để trống !' })
    @Transform((value) => `${value}`.trim())
    cartId: string;
}
