import { UtilService } from '@tproject/libs/core';
import type { CartDetailModelJoinBookAndCart } from '@tproject/libs/data';
import { CartDetailModel } from '@tproject/libs/data';

import { BookDto } from '../../book/dto/book.dto';

export class CartItemDto {
    book: BookDto;

    totalPriceItem: number;

    totalPriceText: string;

    price: number;

    priceText: string;

    quantity: number;

    cartId: string;

    static fromModel(model: CartDetailModelJoinBookAndCart): CartItemDto {
        const totalPriceItem = model.price * Number(model.quantity);

        return {
            book: BookDto.fromModel(model.book),
            totalPriceItem,
            totalPriceText: UtilService.getPriceText(totalPriceItem),
            price: model.price,
            priceText: UtilService.getPriceText(model.price),
            quantity: Number(model.quantity),
            cartId: model.cart_id,
        };
    }
}
