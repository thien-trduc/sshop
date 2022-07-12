import { ApiProperty } from '@nestjs/swagger';
import type { OrderModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsNumber, ValidateIf } from 'class-validator';

import { CustomerAddressUpdateDto } from '../../customer/dto/customer-address-update.dto';

export class OrderUpdateDto {
    @ApiProperty()
    @IsNumber()
    @Transform((value) => `${value}`)
    @ValidateIf((o) => o.status)
    status?: string;

    @ApiProperty()
    receiver?: CustomerAddressUpdateDto;

    @ApiProperty()
    @IsNumber()
    @Transform((value) => Number(value))
    @ValidateIf((o) => o.employeeId)
    employeeId?: number;

    toModel(): Partial<OrderModel> {
        return {
            receiver: JSON.stringify(this.receiver),
            status: this.status,
            employee_id: this.employeeId,
        };
    }
}
