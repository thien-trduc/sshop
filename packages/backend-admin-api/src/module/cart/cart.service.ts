import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UtilService } from '@tproject/libs/core';
import type { CartModel, CustomerModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';
import { first, groupBy, reduce } from 'lodash';

import type { BaseReponse } from '../../common/dto/base-respone.dto';
import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { ErrorMessage } from '../../constant';
import { CartStatus } from '../../constant/enum/cart-status.enum';
import { ContextProvider } from '../../provider';
import { CustomerProvider } from '../../provider/customer.provider';
import { ConfigsService } from '../../shared/service/configs.service';
import { BookDto } from '../book/dto/book.dto';
import { CartDto } from './dto/cart.dto';
import type { CartChoosePaymentDto } from './dto/cart-choose-item-payment.dto';
import type { CartDetailDto } from './dto/cart-detail.dto';
import type { CartDetailPageOptionsDto } from './dto/cart-detail-page-options.dto';
import type { CartInfoPaymentDto } from './dto/cart-info-payment.dto';
import { CartItemDto } from './dto/cart-item.dto';
import type { CartItemCreateDto } from './dto/cart-item-create.dto';
import type { CartItemPageOptionsDto } from './dto/cart-item-page-options.dto';
import type { CartItemUpdateDto } from './dto/cart-item-update.dto';
import type { CartItemsDeleteDto } from './dto/cart-items-delete.dto';
import type { CartPageOptionsDto } from './dto/cart-page-options.dto';
import type { CartUpdateDto } from './dto/cart-update.dto';

@Injectable()
export class CartService {
    private readonly logger = new Logger(CartService.name);

    constructor(
        private readonly data: IPgDataService,
        private readonly customerProvider: CustomerProvider,
        private readonly config: ConfigsService,
    ) {}

    async findById(id: string): Promise<CartDto> {
        return CartDto.fromModel(await this.data.cart.findById(id));
    }

    async page(options: CartPageOptionsDto): Promise<PageResponseDto<CartDto>> {
        const [data, count] = await Promise.all([this.data.cart.page(options.skip, options.take), this.data.cart.count()]);

        return {
            data: data.map((model) => CartDto.fromModel(model)),
            count,
        };
    }

    async update(id: string | number, formData: CartUpdateDto): Promise<CartDto> {
        let model: CartModel;

        try {
            model = await this.data.cart.update(id, formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return CartDto.fromModel(model);
    }

    async deleteById(id: string | number): Promise<void> {
        try {
            await this.data.cart.deleteById(Number(id));
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async insertItemForCart(formData: CartItemCreateDto): Promise<BaseReponse<{ isOK: boolean }>> {
        const customer = await this.customerProvider.customer();
        const book = await this.data.book.findById(formData.isbn);

        if (!book) {
            throw new HttpException(`Không tìm thấy sách ${book.name}`, HttpStatus.NOT_FOUND);
        }

        const ruleInsertCount = Number(book.quantity) - Number(formData.quantity);

        if (ruleInsertCount < 0) {
            throw new HttpException(
                `Sách ${book.name} bạn chọn số lượng chỉ còn ${book.quantity} quyển! Xin nhập sớ lượng nhỏ hơn ${book.quantity}! `,
                HttpStatus.BAD_REQUEST,
            );
        } else {
            let cartCustomer = await this.data.cart.findOne({ customer_id: customer.id, status: CartStatus.PENDING });

            if (!cartCustomer) {
                try {
                    cartCustomer = await this.data.cart.create({
                        id: undefined,
                        updatedat: undefined,
                        createdat: undefined,
                        date: undefined,
                        address: '',
                        status: undefined,
                        customer_id: customer.id,
                        receive_name: '',
                        receive_phone: '',
                        employee_id: undefined,
                    });
                } catch (error) {
                    throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            const cartItem = await this.data.cart.findCartItemByCartIdAndBookId(cartCustomer.id, book.isbn);

            if (cartItem) {
                const newQuantity = Number(cartItem.quantity) + Number(formData.quantity);
                await this.data.cart.updateCartItem(cartCustomer.id, book.isbn, {
                    ...cartItem,
                    quantity: BigInt(newQuantity),
                });
            } else {
                const [price, bookSale] = await Promise.all([this.data.book.findPriceBook(book.isbn), this.data.book.getSaleForBook(book.isbn)]);
                await this.data.cart.createItemForCart({
                    ...formData.toModel(),
                    price: bookSale ? bookSale.price : price,
                    cart_id: cartCustomer.id,
                    is_selected: false,
                });
            }

            return {
                statusCode: HttpStatus.OK,
                message: 'Thêm sản phẩm vào giỏ hàng thành công',
                data: {
                    isOK: true,
                },
            };
        }
    }

    async updateItemForCart(formData: CartItemUpdateDto): Promise<BaseReponse<CartInfoPaymentDto>> {
        const customer = await this.customerProvider.customer();
        const book = await this.data.book.findById(formData.isbn);

        if (!book) {
            throw new HttpException(`Không tìm thấy sách ${book.name}`, HttpStatus.NOT_FOUND);
        }

        const ruleInsertCount = Number(book.quantity) - Number(formData.quantity);

        if (ruleInsertCount < 0) {
            throw new HttpException(
                `Sách ${book.name} bạn chọn số lượng chỉ còn ${book.quantity} quyển! Xin nhập sớ lượng nhỏ hơn ${book.quantity}! `,
                HttpStatus.BAD_REQUEST,
            );
        } else {
            const cartCustomer = await this.data.cart.findOne({ customer_id: customer.id, status: CartStatus.PENDING });

            if (!cartCustomer) {
                throw new HttpException('Hệ thống lỗi khi cập nhật giỏ hàng! Xin thử lại', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const cartItem = await this.data.cart.findCartItemByCartIdAndBookId(cartCustomer.id, book.isbn);
            await this.data.cart.updateCartItem(cartCustomer.id, book.isbn, {
                ...cartItem,
                quantity: BigInt(formData.quantity),
            });

            formData.bookIds = formData?.bookIds || [];
            const infoPayment = await this.getInfoByCartToPayment(formData);

            return {
                statusCode: HttpStatus.OK,
                message: 'Cập nhật sản phẩm vào giỏ hàng thành công',
                data: infoPayment?.data,
            };
        }
    }

    async deleteItemForCart(formData: CartItemsDeleteDto): Promise<BaseReponse<CartInfoPaymentDto>> {
        const bookIds = formData.isbns;
        const customer = await this.customerProvider.customer();
        const books = await this.data.book.findByIds(bookIds);
        const groupBooks = groupBy(books, 'isbn');

        for (const isbn of bookIds) {
            const book = first(groupBooks[isbn]);

            if (!book) {
                throw new HttpException(`Không tìm thấy sách với mã ${isbn}! Xin liên hệ admin giải quyết`, HttpStatus.NOT_FOUND);
            }
        }

        const cartCustomer = await this.data.cart.findOne({ customer_id: customer.id, status: CartStatus.PENDING });

        if (!cartCustomer) {
            throw new HttpException('Hệ thống lỗi khi cập nhật giỏ hàng! Xin thử lại', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            await this.data.cart.deleteItemsInCart(
                cartCustomer.id,
                books.map((book) => book.isbn),
            );
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException('Hệ thống lỗi khi xử lý giỏ hàng! Xin liên hệ admin!', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        formData.bookIds = formData?.bookIds || [];
        const infoPayment = await this.getInfoByCartToPayment(formData);

        return {
            statusCode: HttpStatus.OK,
            message: 'Xóa sản phẩm trong giỏ hàng thành công !',
            data: infoPayment?.data,
        };
    }

    async pageCartItem(cartId: string, options: CartItemPageOptionsDto): Promise<PageResponseDto<CartItemDto>> {
        const cart = await this.data.cart.findOne({
            id: cartId,
        });

        if (!cart) {
            throw new HttpException(`Không tìm thấy giỏ hàng với id: ${cartId}`, HttpStatus.NOT_FOUND);
        }

        const [cartItems, count] = await Promise.all([
            this.data.cart.pageCartItems(options.skip, options.take, { cart_id: cartId }),
            this.data.cart.countCartItem({ cart_id: cartId }),
        ]);

        return {
            data: cartItems.map((item) => CartItemDto.fromModel(item)),
            count,
        };
    }

    async getCartByCustomer(options: CartDetailPageOptionsDto): Promise<CartDetailDto> {
        const customer = await this.customerProvider.customer();
        const [cart, customerValid] = await Promise.all([
            this.data.cart.findOne({
                customer_id: customer.id,
                status: CartStatus.PENDING,
            }),
            this.data.customer.findOne({
                id: customer.id,
            }),
            // this.data.customer.getAddressByCustomer(customer.id),
        ]);

        if (!cart) {
            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const [cartItems, count] = await Promise.all([
            this.data.cart.pageCartItems(options.skip, options.take, { cart_id: cart.id }),
            this.data.cart.countCartItem({ cart_id: cart.id }),
        ]);

        return {
            data: cartItems.map((item) => CartItemDto.fromModel(item)),
            count,
            validInfo: ContextProvider.validInfo<CustomerModel>(customerValid),
        };
    }

    async getInfoByCartToPayment(formData: CartChoosePaymentDto): Promise<BaseReponse<CartInfoPaymentDto>> {
        const customer = await this.customerProvider.customer();
        const [cart, customerValid] = await Promise.all([
            this.data.cart.findOne({
                customer_id: customer.id,
                status: CartStatus.PENDING,
            }),
            this.data.customer.findOne({
                id: customer.id,
            }),
        ]);

        if (!cart) {
            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        let cartItems = await this.data.cart.findItemsByCartIdAndCustomerId(cart.id, customer.id);

        let cartInfoPayment: CartInfoPaymentDto = {
            fullname: `${customer?.fullname}`.toUpperCase(),
            phone: customer.phone,
            totalDiscount: 0,
            totalDiscountText: UtilService.getPriceText(0),
            vatPrice: 0,
            vatPriceText: UtilService.getPriceText(0),
            totalPrice: 0,
            totalPriceText: UtilService.getPriceText(0),
            priceShip: 0,
            priceShipText: UtilService.getPriceText(0),
        };

        if (cartItems.length === 0) {
            return {
                statusCode: HttpStatus.OK,
                message: 'Giỏ hàng trống!',
                data: {
                    ...cartInfoPayment,
                    validInfo: ContextProvider.validInfo<CustomerModel>(customerValid),
                },
            };
        }

        let bookIds: string[] = [];

        const groupCartItems = groupBy(cartItems, 'book_id');

        for (const bookId of formData.bookIds) {
            const cartItem = first(groupCartItems[bookId]);

            if (cartItem) {
                bookIds = [...bookIds, cartItem.book_id];
            }
        }

        if (bookIds.length > 0) {
            const setBooks = new Set(bookIds);
            cartItems = cartItems.filter((cartItem) => setBooks.has(cartItem.book_id));

            const booksWithPriceSale = await Promise.all(
                bookIds.map(async (isbn) => {
                    const [book, price, saleModel] = await Promise.all([
                        this.data.book.findById(isbn),
                        this.data.book.findPriceBook(isbn),
                        this.data.book.getSaleForBook(isbn),
                    ]);

                    return BookDto.fromModelJoinPublisherCategory(book, price, saleModel);
                }),
            );

            const groupBooks = groupBy(booksWithPriceSale, 'isbn');

            for (const isbn of bookIds) {
                const book = first(groupBooks[isbn]);

                if (!book) {
                    throw new HttpException(`Không tìm thấy sách với mã ${isbn}! Xin liên hệ admin giải quyết`, HttpStatus.NOT_FOUND);
                }
            }

            let totalPrice = reduce(cartItems, (sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

            const vatPrice = reduce(cartItems, (sum, item) => sum + Number(item.price) * Number(item.quantity) * 0.1, 0);

            if (vatPrice > 0) {
                totalPrice = totalPrice + vatPrice;
            }

            const totalDiscount = reduce(
                cartItems,
                (sum, item) => sum + Number(first(groupBooks[item.book_id])?.sale?.priceDiscount || 0) * Number(item.quantity),
                0,
            );

            // if (totalDiscount > 0) {
            //     totalPrice = totalPrice - totalDiscount;
            // }

            totalPrice = totalPrice + this.config.shipPrice;

            cartInfoPayment = {
                ...cartInfoPayment,
                totalDiscount,
                totalPrice,
                totalDiscountText: UtilService.getPriceText(totalDiscount),
                totalPriceText: UtilService.getPriceText(totalPrice),
                vatPrice,
                vatPriceText: UtilService.getPriceText(vatPrice),
                priceShip: this.config.shipPrice,
                priceShipText: UtilService.getPriceText(this.config.shipPrice),
            };
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'Thành công!',
            data: {
                ...cartInfoPayment,
                validInfo: ContextProvider.validInfo<CustomerModel>(customerValid),
            },
        };
    }

    async getCartCountItemByCustomer(): Promise<{ count: number }> {
        const customer = await this.customerProvider.customer();

        const cart = await this.data.cart.findOne({
            customer_id: customer.id,
            status: CartStatus.PENDING,
        });

        if (!cart) {
            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const count = await this.data.cart.countCartItem({ cart_id: cart.id });

        return {
            count: count || 0,
        };
    }
}
