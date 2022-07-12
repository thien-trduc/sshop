import { ApiProperty } from '@nestjs/swagger';
import type { CustomerModel, CustomerModelJoinAddress } from '@tproject/libs/data';

import { BaseDto } from '../../../common/dto/base.dto';
import { AVATAR_FEMALE_DEFAULT, AVATAR_MALE_DEFAULT } from './../../../constant/global';
import { CustomerAddressDto } from './customer-address.dto';

export class CustomerDto extends BaseDto {
    @ApiProperty()
    sex: number;

    @ApiProperty()
    birthdate: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    customerAddress?: CustomerAddressDto[];

    @ApiProperty()
    fullname?: string;

    @ApiProperty()
    avatar?: string;

    static fromModel(model: CustomerModelJoinAddress & CustomerModel): CustomerDto {
        return {
            id: model.id,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            email: model.email,
            sex: model.sex,
            phone: model.phone,
            birthdate: model.birthdate,
            userId: model.userId,
            customerAddress: model?.customer_address ? model.customer_address.map((address) => CustomerAddressDto.fromModel(address)) : undefined,
            fullname: model?.fullname || `${model.surname} ${model.name}`.trim(),
            avatar: model?.avatar || (model.sex === 0 ? AVATAR_MALE_DEFAULT : AVATAR_FEMALE_DEFAULT),
        };
    }
}
