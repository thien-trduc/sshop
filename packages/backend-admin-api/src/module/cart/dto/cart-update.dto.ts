import { ApiProperty } from '@nestjs/swagger';
import type { CartModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsPhoneNumber, ValidateIf } from 'class-validator';

export class CartUpdateDto {
    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    receiveName: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    address: string;

    @ApiProperty()
    @ValidateIf((o) => o.receivePhone)
    @IsPhoneNumber('VI', { message: 'Số điện thoại người nhận không đúng định dạng!' })
    @Transform((value) => `${value}`.trim())
    receivePhone: string;

    @ApiProperty()
    @Transform((value) => Number(value))
    employeeId?: number;

    toModel(): CartModel {
        return {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            date: undefined,
            status: undefined,
            employee_id: this.employeeId || undefined,
            receive_name: this.receiveName || '',
            address: this.address || '',
            receive_phone: this.receivePhone || '',
            customer_id: undefined,
        };
    }
}
