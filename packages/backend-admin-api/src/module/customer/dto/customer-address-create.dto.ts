import { ApiProperty } from '@nestjs/swagger';
import type { CustomerAddressModel } from '@tproject/libs/data';

export class CustomerAddressCreateDto {
    @ApiProperty()
    label: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    fullname: string;

    @ApiProperty()
    phone: string;

    toModel(customerId?: number): CustomerAddressModel {
        return {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            label: this.label,
            address: this.address,
            fullname: this.fullname,
            phone: this.phone,
            customer_id: customerId || undefined,
        };
    }
}
