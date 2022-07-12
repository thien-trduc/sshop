import { ApiProperty } from '@nestjs/swagger';
import type { CustomerAddressModel } from '@tproject/libs/data';

import { BaseDto } from './../../../common/dto/base.dto';

export class CustomerAddressDto extends BaseDto {
    @ApiProperty()
    label: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    fullname: string;

    @ApiProperty()
    phone: string;

    static fromModel(model: CustomerAddressModel): CustomerAddressDto {
        return {
            id: model.id,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            label: model.label,
            address: model.address,
            fullname: model.fullname,
            phone: model.phone,
        };
    }
}
