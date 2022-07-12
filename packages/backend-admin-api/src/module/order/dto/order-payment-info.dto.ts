import { ApiProperty } from '@nestjs/swagger';

export class OrderPaymentInfoDto {
    @ApiProperty()
    totalPrice: number;

    @ApiProperty()
    totalPriceText: string;

    @ApiProperty()
    totalDiscount: number;

    @ApiProperty()
    totalDiscountText: string;

    @ApiProperty()
    vatPrice: number;

    @ApiProperty()
    vatPriceText: string;

    @ApiProperty()
    priceShip: number;

    @ApiProperty()
    priceShipText: string;
}
