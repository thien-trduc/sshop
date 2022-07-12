import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailDto {
    @ApiProperty()
    fullname: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    totalDiscount: number;

    @ApiProperty()
    totalDiscountText: string;

    @ApiProperty()
    vatPrice: number;

    @ApiProperty()
    vatPriceText: string;

    @ApiProperty()
    totalPrice: number;

    @ApiProperty()
    totalPriceText: string;

    @ApiProperty()
    priceShip: number;

    @ApiProperty()
    priceShipText: string;

    @ApiProperty()
    details: any;
}
