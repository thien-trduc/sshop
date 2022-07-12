import { ApiProperty } from '@nestjs/swagger';
import { UtilService } from '@tproject/libs/core';
import type { CustomerAddressModel, OrderModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

import { OrderTypeEnum } from '../../..//constant/enum/order-type.enum';
import { OrderStatus } from '../../../constant/enum/order-status.enum';
import type { CustomerAddressDto } from '../../customer/dto/customer-address.dto';
import { WebExtraConfigDto } from './web-extra-config.dto';

export class OrderCreateDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: 'Id Của sổ địa chỉ người nhận không được để trống!' })
    @Transform((value) => Number(value))
    customerAddressId: number;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty({ message: 'Danh sách mã ISBN không được để trống!' })
    bookIds: string[];

    @ApiProperty()
    webExtraConfig: WebExtraConfigDto;

    toModel(customerAddress: CustomerAddressDto | CustomerAddressModel): OrderModel {
        return {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            date: undefined,
            total_price: undefined,
            status: OrderStatus.INIT,
            type: OrderTypeEnum.CUSTOMER,
            transaction_id: UtilService.genTransactionCode(),
            session: undefined,
            customer_id: undefined,
            employee_id: undefined,
            receiver: JSON.stringify(customerAddress),
        };
    }
}
