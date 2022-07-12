import { ApiProperty } from '@nestjs/swagger';
import { UtilService } from '@tproject/libs/core';
import type { OrderModelJoinEmployeeAndCustomer } from '@tproject/libs/data';
import * as moment from 'moment';

import { CustomerDto } from '../../customer/dto/customer.dto';
import { CustomerAddressDto } from '../../customer/dto/customer-address.dto';
import { PageResponseDto } from './../../../common/dto/page-response.dto';
import { orderStatusObj } from './../../../constant/enum/order-status.enum';
import { RECEIVE_DATE } from './../../../constant/global';
import { OrderDto } from './order.dto';
import type { OrderItemDto } from './order-item.dto';
import { OrderPaymentInfoDto } from './order-payment-info.dto';

export class OrderByTransationDto {
    @ApiProperty()
    paymentInfo: OrderPaymentInfoDto;

    @ApiProperty()
    details: PageResponseDto<OrderItemDto>;

    @ApiProperty()
    order: OrderDto;

    @ApiProperty()
    receiver: CustomerAddressDto;

    @ApiProperty()
    customer: CustomerDto;

    static fromModel(
        model: OrderModelJoinEmployeeAndCustomer,
        details: PageResponseDto<OrderItemDto>,
        totalPrice: number,
        totalDiscount: number,
        vatPrice: number,
        priceShip,
    ): OrderByTransationDto {
        return {
            order: {
                id: model.id,
                createdAt: model.createdat,
                updatedAt: model.updatedat,
                date: moment(model.date).format('HH:mm DD/MM/YYYY'),
                dateReceive: moment(model.date).add(RECEIVE_DATE, 'days').add(7, 'hours').format('HH:mm DD/MM/YYYY'),
                total: model.total_price,
                status: orderStatusObj[`${model.status}`],
                type: model.type,
                transactionId: model.transaction_id,
                totalPriceText: UtilService.getPriceText(model.total_price),
                session: undefined,
                customer: undefined,
                employee: undefined,
                receiver: undefined,
            },
            details,
            receiver: JSON.parse(`${model?.receiver}`),
            paymentInfo: {
                totalPrice,
                totalPriceText: UtilService.getPriceText(totalPrice),
                totalDiscount,
                totalDiscountText: UtilService.getPriceText(totalDiscount),
                vatPrice,
                vatPriceText: UtilService.getPriceText(vatPrice),
                priceShip,
                priceShipText: UtilService.getPriceText(priceShip),
            },
            customer: model?.customer ? CustomerDto.fromModel(model.customer) : undefined,
        };
    }
}
