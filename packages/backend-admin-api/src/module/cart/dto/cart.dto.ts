import { ApiProperty } from '@nestjs/swagger';
import type { CartModel } from '@tproject/libs/data';

import type { CustomerDto } from '../../customer/dto/customer.dto';

export class CartDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    status: number;

    @ApiProperty()
    address: string;

    @ApiProperty()
    fullname: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    employeeId: number;

    @ApiProperty()
    customerId: number;

    @ApiProperty()
    validInfo?: any;

    static fromModel(model: CartModel, customer?: CustomerDto, validInfo?: any): CartDto {
        return {
            address: model.address,
            createdAt: model.createdat,
            customerId: model.customer_id,
            date: model.date,
            employeeId: model?.employee_id,
            id: model.id,
            phone: customer?.phone || '',
            fullname: customer?.fullname || '',
            status: model.status,
            updatedAt: model.updatedat,
            validInfo,
        };
    }
}
