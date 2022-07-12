import { ApiProperty } from '@nestjs/swagger';
import { UtilService } from '@tproject/libs/core';
import type { OrderModelJoinEmployeeAndCustomer } from '@tproject/libs/data';
import * as moment from 'moment';

import { CustomerDto } from '../../customer/dto/customer.dto';
import { CustomerAddressDto } from '../../customer/dto/customer-address.dto';
import { BaseDto } from './../../../common/dto/base.dto';
import { orderStatusObj } from './../../../constant/enum/order-status.enum';
import { RECEIVE_DATE } from './../../../constant/global';
import { EmployeeDto } from './../../employee/dto/employee.dto';

export class OrderDto extends BaseDto {
    @ApiProperty()
    date: string;

    @ApiProperty()
    dateReceive: string;

    @ApiProperty()
    total: number;

    @ApiProperty()
    totalPriceText: string;

    @ApiProperty()
    status: Partial<{
        value: string;
        label: string;
    }>;

    @ApiProperty()
    type: number;

    @ApiProperty()
    transactionId: string;

    @ApiProperty()
    session: string;

    @ApiProperty()
    customer?: CustomerDto;

    @ApiProperty()
    employee?: EmployeeDto;

    @ApiProperty()
    receiver?: CustomerAddressDto;

    static fromModelJoinEmployeeAndCustomer(model: OrderModelJoinEmployeeAndCustomer): OrderDto {
        return {
            id: model.id,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            date: moment(model.date).add(7, 'hours').format('DD/MM/YYYY'),
            dateReceive: moment(model.date).add(RECEIVE_DATE, 'days').add(7, 'hours').format('DD/MM/YYYY'),
            total: model.total_price,
            totalPriceText: UtilService.getPriceText(model.total_price),
            status: orderStatusObj[`${model.status}`],
            type: model.type,
            transactionId: model.transaction_id,
            session: model.session,
            customer: model?.customer ? CustomerDto.fromModel(model.customer) : undefined,
            employee: model?.employee ? EmployeeDto.fromModel(model.employee) : undefined,
            receiver: JSON.parse(`${model?.receiver}`),
        };
    }

    static fromModelsJoinEmployeeAndCustomer(model: OrderModelJoinEmployeeAndCustomer): OrderDto {
        return {
            id: model.id,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            date: moment(model.date).add(7, 'hours').format('DD/MM/YYYY'),
            dateReceive: moment(model.date).add(RECEIVE_DATE, 'days').add(7, 'hours').format('DD/MM/YYYY'),
            total: model.total_price,
            totalPriceText: UtilService.getPriceText(model.total_price),
            status: orderStatusObj[`${model.status}`],
            type: undefined,
            transactionId: model.transaction_id,
            session: undefined,
            customer: model?.customer ? CustomerDto.fromModel(model.customer) : undefined,
            employee: undefined,
            receiver: JSON.parse(`${model?.receiver}`),
        };
    }
}
