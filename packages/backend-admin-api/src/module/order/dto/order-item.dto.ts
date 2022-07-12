import { ApiProperty } from '@nestjs/swagger';

import { BookDto } from '../../book/dto/book.dto';

export class OrderItemDto {
    @ApiProperty()
    book: BookDto;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    priceText: string;

    @ApiProperty()
    priceDiscount: number;

    @ApiProperty()
    priceDiscountText: string;

    @ApiProperty()
    subTotal: number;

    @ApiProperty()
    subTotalText: string;
}
