import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { ClientUtilService, UtilService } from '@tproject/libs/core';
import type { CartModel, OrderDetailModel, OrderModel, ReceiptModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';
import * as jwt from 'jsonwebtoken';
import { first, groupBy, reduce } from 'lodash';
import * as moment from 'moment';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { ErrorMessage } from '../../constant';
import { CartStatus } from '../../constant/enum/cart-status.enum';
import { MessageTypeEnum } from '../../constant/enum/message-type.enum';
import { OrderStatus } from '../../constant/enum/order-status.enum';
import { PaymentStatusEnum } from '../../constant/enum/payment-status.enum';
import { Topic } from '../../constant/enum/topic.enum';
import { CustomerProvider } from '../../provider/customer.provider';
import { ConfigsJwtService } from '../../shared/service/configs.jwt.service';
import { Exchange, RoutingKey } from '../../shared/service/configs.rabbit.service';
import { ConfigsService } from '../../shared/service/configs.service';
import { BookDto } from '../book/dto/book.dto';
import type { SessionDto } from '../cart/dto/session.dto';
import { OrderDto } from './dto/order.dto';
import { OrderByTransationDto } from './dto/order-by-transaction.dto';
import type { OrderByTransationPageOptionsDto } from './dto/order-by-transaction-page-options.dto';
import type { OrderCreateDto } from './dto/order-create.dto';
import type { OrderItemDto } from './dto/order-item.dto';
import type { OrderPageOptionsDto } from './dto/order-page-options.dto';
import type { OrderStaticialByDate } from './dto/order-report.dto';
import type { OrderReportOptionsDto } from './dto/order-report-options.dto';
import type { OrderUpdateDto } from './dto/order-update.dto';
import type { OrderUpdateStatusDto } from './dto/order-update-status.dto';

@Injectable()
export class OrderService {
    private readonly name = OrderService.name;

    private readonly logger = new Logger(this.name);

    constructor(
        private readonly data: IPgDataService,
        private readonly customerProvider: CustomerProvider,
        private readonly jwtConfigService: ConfigsJwtService,
        private readonly clientUtils: ClientUtilService,
        private readonly configService: ConfigsService,
        private readonly amqp: AmqpConnection,
    ) {}

    async create(formData: OrderCreateDto): Promise<OrderDto> {
        const customer = await this.customerProvider.customer();
        let cart = await this.data.cart.findOne({
            customer_id: customer.id,
            status: CartStatus.PENDING,
        });

        if (!cart) {
            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.NOT_FOUND);
        }

        const cartCurrentItems = await this.data.cart.findCartItemsByCartId(cart.id);

        if (cartCurrentItems.length === 0) {
            throw new HttpException(`Giỏ hàng trống!`, HttpStatus.NOT_FOUND);
        }

        const setBookIds = new Set(formData.bookIds);
        const cartItems = cartCurrentItems.filter((item) => setBookIds.has(item.book_id));

        let bookIds: string[] = [];
        const groupCartItems = groupBy(cartItems, 'book_id');

        for (const bookId of formData.bookIds) {
            const cartItem = first(groupCartItems[bookId]);

            if (cartItem) {
                bookIds = [...bookIds, cartItem.book_id];
            }
        }

        const books = await Promise.all(
            bookIds.map(async (isbn) => {
                const [book, price, saleModel] = await Promise.all([
                    this.data.book.findById(isbn),
                    this.data.book.findPriceBook(isbn),
                    this.data.book.getSaleForBook(isbn),
                ]);

                return BookDto.fromModelJoinPublisherCategory(book, price, saleModel);
            }),
        );

        if (books.length === 0) {
            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const bookGroup = groupBy(books, 'isbn');

        // check quantity book
        for (const item of cartItems) {
            const book = first(bookGroup[item.book_id]);
            const checkQuantity = Number(book.quantity) - Number(item.quantity);

            if (checkQuantity < 0) {
                throw new HttpException(
                    `Sách ${book.name} chỉ còn lại ${book.quantity}! Xin nhập lại số lượng trong giỏ hàng!`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        const customerAddress = customer.customerAddress.find((address) => address.id === formData.customerAddressId);

        if (!customerAddress) {
            throw new HttpException(`Không tìm thấy địa chỉ với id: ${formData.customerAddressId}`, HttpStatus.NOT_FOUND);
        }

        cart = {
            ...cart,
            address: customerAddress.address,
            receive_phone: customerAddress.phone,
            receive_name: customerAddress.fullname,
        };

        let order = {
            ...formData.toModel(customerAddress),
            customer_id: customer.id,
        };

        const orderDetail: OrderDetailModel[] = cartItems.map((cartItem) => {
            const book = first(bookGroup[cartItem.book_id]);

            return {
                order_id: undefined,
                book_id: cartItem.book_id,
                quantity: cartItem.quantity,
                price: cartItem.price,
                priceDiscount: book.sale?.priceDiscount || 0,
            };
        });

        const datas = cartItems.map((cartItem) => {
            const book = first(bookGroup[cartItem.book_id]);

            return {
                price: cartItem.price,
                quantity: Number(cartItem.quantity),
                name: book.name,
                image: book.images.length > 0 ? first(book.images) : book.image,
            };
        });

        // create session for payment
        const jwtStripeOptions: JwtModuleOptions = this.jwtConfigService.createStripeSecretOptions();
        const secret = jwt.sign(
            {
                cartId: cart.id,
                customerId: customer.id,
                transactionId: order.transaction_id,
            },
            jwtStripeOptions.secret,
            jwtStripeOptions.signOptions,
        );

        const redirectUrl = `${formData?.webExtraConfig.urlSuccess}?transactionId=${order.transaction_id}` || this.configService.redirectUrl;
        const webExtraConfig = {
            urlSuccess: redirectUrl,
            urlFailed: redirectUrl,
        };
        const session = await this.clientUtils.post<SessionDto>(
            `${this.configService.getPaymentUrl}/payment/create-checkout-session`,
            {
                datas,
                webExtraConfig,
            },
            { secret },
        );

        order = {
            ...order,
            session: session.url,
            total_price: reduce(orderDetail, (sum, item) => sum + item.price, 0),
        };

        try {
            order = await this.data.transaction.createOrderForCustomer(order, orderDetail, cart, bookIds);
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return OrderDto.fromModelJoinEmployeeAndCustomer(order);
    }

    async updateStatus(formData: OrderUpdateStatusDto): Promise<Required<{ isOK: boolean }>> {
        if (formData.status !== PaymentStatusEnum.SUCCESS) {
            throw new HttpException(
                `Đơn hàng cùa quý khách thanh toán không thành công! Vui lòng liên hệ admin để được giải quyết!`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const [cart, cartItemsNotSelected, order, employeeIdAssign] = await Promise.all([
            this.data.cart.findById(formData.cartId),
            this.data.cart.findCartItemsByCartIdAndSelected(formData.cartId, false),
            this.data.order.findOne({ transaction_id: formData.transactionId }),
            this.data.employee.getToAssign(),
        ]);

        if (!cart || !order) {
            this.logger.error(`Đơn Hàng xử lý khồng thành công sau khi thanh toán với id: ${cart.id} `);

            throw new HttpException(
                `Đơn hàng ${order.transaction_id} xử lý bị lỗi! Vui lòng liên hệ admin để được giải quyết!`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const orderItems = await this.data.order.findItemsByTransachtionOrderId(order.transaction_id);

        if (orderItems.length <= 0) {
            this.logger.error(`Lỗi không có item trong order!`);

            throw new HttpException(`Xảy ra lỗi khi xử lý chi tiết đơn hàng: ${order.transaction_id} !`, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        let dataUpdateQuantity: Record<string, number> = {};

        for (const orderItem of orderItems) {
            dataUpdateQuantity = { ...dataUpdateQuantity, [`${orderItem.book_id}`]: Number(orderItem.quantity) };
        }

        const employeeId = employeeIdAssign <= 0 ? undefined : employeeIdAssign;

        const receiptModel: ReceiptModel = {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            order_id: order.id,
            employee_id: employeeId,
            tax_code: 'NO_CONFIG',
        };

        const cartUpdate: CartModel = {
            ...cart,
            status: CartStatus.PAYMENT,
            employee_id: employeeId,
        };

        const orderUpdate: OrderModel = {
            ...order,
            status: OrderStatus.PAYMENT,
            employee_id: employeeId,
        };

        try {
            await this.data.transaction.paymentSuccess(cartUpdate, dataUpdateQuantity, receiptModel, orderUpdate, cartItemsNotSelected);
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        await this.sendMailPaymentSuccess(orderUpdate, orderItems);

        return {
            isOK: true,
        };
    }

    async sendMailPaymentSuccess(orderUpdate: OrderModel, orderItems: OrderDetailModel[]): Promise<void> {
        const booksWithPriceSale = await Promise.all(
            orderItems.map(async (model) => {
                const [book, price, saleModel] = await Promise.all([
                    this.data.book.findById(model.book_id),
                    this.data.book.findPriceBook(model.book_id),
                    this.data.book.getSaleForBook(model.book_id),
                ]);

                return BookDto.fromModelJoinPublisherCategory(book, price, saleModel);
            }),
        );

        const customer = await this.data.customer.findById(orderUpdate.customer_id);

        const groupBook = groupBy(booksWithPriceSale, 'isbn');

        let totalPrice = reduce(orderItems, (sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
        const subTotal = UtilService.getPriceText(totalPrice);
        const vatPrice = reduce(orderItems, (sum, item) => sum + Number(item.price) * Number(item.quantity) * 0.1, 0);

        if (vatPrice > 0) {
            totalPrice = totalPrice + vatPrice;
        }

        const totalDiscount = reduce(
            orderItems,
            (sum, item) => sum + Number(first(groupBook[item.book_id])?.sale?.priceDiscount || 0) * Number(item.quantity),
            0,
        );

        // if (totalDiscount > 0) {
        //     totalPrice = totalPrice - totalDiscount;
        // }

        totalPrice = totalPrice + this.configService.shipPrice;

        this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.EVENT_CREATE, {
            type: MessageTypeEnum.MAIL,
            title: 'Order Succcess',
            topicId: Topic.ORDER_RECEIPT,
            data: {
                to: customer.email,
                dynamicData: {
                    transactionId: orderUpdate.transaction_id,
                    date: moment(orderUpdate.date).format('HH:mm DD/MM/YYYY'),
                    address: JSON.parse(`${orderUpdate.receiver}`)?.address || '',
                    orders: orderItems.map((item) => {
                        const book = first(groupBook[item.book_id]);

                        return {
                            name: book.name,
                            quantity: Number(item.quantity),
                            price: UtilService.getPriceText(item.price),
                            subTotal: UtilService.getPriceText(item.price * Number(item.quantity)),
                            image: book.image,
                        };
                    }),
                    subTotal,
                    vat: UtilService.getPriceText(vatPrice),
                    deliveryCharge: UtilService.getPriceText(this.configService.shipPrice),
                    discount: UtilService.getPriceText(totalDiscount),
                    total: UtilService.getPriceText(totalPrice),
                },
            },
        });
    }

    async page(options: OrderPageOptionsDto): Promise<PageResponseDto<OrderDto>> {
        const { take, page, order, q, ...filter } = options;

        const sort = q ? { [`${q}`]: order.toLowerCase() } : undefined;

        const [data, count] = await Promise.all([this.data.order.page(options.skip, take, filter, sort), this.data.order.count(filter)]);

        return {
            data: data.map((model) => OrderDto.fromModelJoinEmployeeAndCustomer(model)),
            count,
        };
    }

    async getById(id: number): Promise<OrderDto> {
        const order = await this.data.order.findById(id);

        if (!order) {
            throw new HttpException(`Không tìm thấy đơn hàng với id: ${id}`, HttpStatus.NOT_FOUND);
        }

        return OrderDto.fromModelJoinEmployeeAndCustomer(order);
    }

    async update(id: number, formData: OrderUpdateDto): Promise<OrderDto> {
        const order = await this.data.order.findById(id);

        if (!order) {
            throw new HttpException(`Không tìm thấy đơn hàng với id: ${id}`, HttpStatus.NOT_FOUND);
        }

        try {
            await this.data.order.update(id, {
                ...order,
                ...formData.toModel(),
            });
        } catch (error) {
            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return OrderDto.fromModelJoinEmployeeAndCustomer(order);
    }

    async getByUser(options: OrderPageOptionsDto): Promise<PageResponseDto<OrderDto>> {
        const customer = await this.customerProvider.customer();
        const { take, page, order, q, ...filter } = options;

        const sort = q ? { [`${q}`]: order.toLowerCase() } : undefined;

        if (options?.status === OrderStatus.ALL) {
            filter.status = undefined;
        }

        const [data, count] = await Promise.all([
            this.data.order.page(options.skip, take, { ...filter, customer_id: customer.id }, sort),
            this.data.order.count({ ...filter, customer_id: customer.id }),
        ]);

        return {
            data: data.map((model) => OrderDto.fromModelsJoinEmployeeAndCustomer(model)),
            count,
        };
    }

    async getByTransaction(formData: OrderByTransationPageOptionsDto): Promise<OrderByTransationDto> {
        const customer = await this.customerProvider.customer();
        const order = await this.data.order.findUnique({ transaction_id: formData.transactionId });

        if (!order) {
            throw new HttpException(`Không tìm thấy đơn hàng với transactionId: ${formData.transactionId}`, HttpStatus.NOT_FOUND);
        }

        const [orderItems, countOrderItems] = await Promise.all([
            this.data.order.pageOrderDetail(formData.skip, formData.take, {
                order_id: order.id,
            }),
            this.data.order.countOrderDetail({
                order_id: order.id,
            }),
        ]);

        if (orderItems.length === 0) {
            throw new HttpException(`Không tìm thấy chi tiết đơn hàng với transactionId: ${formData.transactionId}`, HttpStatus.NOT_FOUND);
        }

        const books = await this.data.book.findByIds(orderItems.map((item) => item.book_id));

        const groupBook = groupBy(books, 'isbn');

        const data = orderItems.map((item): OrderItemDto => {
            const book = first(groupBook[item.book_id]);

            return {
                book: BookDto.fromModel(book),
                quantity: Number(item.quantity),
                price: Number(item.price),
                priceText: UtilService.getPriceText(item.price),
                subTotal: Number(item.quantity) * Number(item.price),
                subTotalText: UtilService.getPriceText(Number(item.quantity) * Number(item.price)),
                priceDiscount: Number(item.priceDiscount),
                priceDiscountText: UtilService.getPriceText(Number(item.priceDiscount)),
            };
        });

        let totalPrice = reduce(orderItems, (sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
        const vatPrice = reduce(orderItems, (sum, item) => sum + Number(item.price) * Number(item.quantity) * 0.1, 0);

        if (vatPrice > 0) {
            totalPrice = totalPrice + vatPrice;
        }

        const totalDiscount = reduce(orderItems, (sum, item) => sum + Number(item.priceDiscount) * Number(item.quantity), 0);

        // if (totalDiscount > 0) {
        //     totalPrice = totalPrice - totalDiscount;
        // }

        totalPrice = Number(totalPrice) + Number(this.configService.shipPrice);

        return OrderByTransationDto.fromModel(
            order,
            {
                data,
                count: countOrderItems,
            },
            totalPrice,
            totalDiscount,
            vatPrice,
            this.configService.shipPrice,
        );
    }

    getReportOrderByDate(formData: OrderReportOptionsDto): Promise<OrderStaticialByDate[]> {
        return this.data.order.getReportOrderByDate(moment(formData.start, 'YYYY-MM-DD').toDate(), moment(formData.end, 'YYYY-MM-DD').toDate());
    }
}
