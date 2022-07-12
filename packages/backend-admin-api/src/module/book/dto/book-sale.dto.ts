import { ApiProperty } from '@nestjs/swagger';
import { UtilService } from '@tproject/libs/core';
import type { BookWithSaleModel } from '@tproject/libs/data';

export class BookSaleDto {
    @ApiProperty()
    isbn: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    value: number;

    @ApiProperty()
    valueText: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    priceText: string;

    @ApiProperty()
    status: boolean;

    @ApiProperty()
    priceDiscount: number;

    @ApiProperty()
    priceDiscountText: string;

    static fromModel(model: BookWithSaleModel): BookSaleDto {
        return {
            isbn: model.isbn,
            title: model.title,
            value: model.value,
            valueText: `${model.value}%`,
            price: model.price,
            status: model.status,
            priceDiscount: model.price_discount,
            priceText: UtilService.getPriceText(model.price),
            priceDiscountText: UtilService.getPriceText(model.price_discount),
        };
    }
}
