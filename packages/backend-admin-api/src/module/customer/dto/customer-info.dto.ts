import { ApiProperty } from '@nestjs/swagger';

import type { CustomerAddressDto } from './customer-address.dto';

export class CustomerInfoDto {
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
    username: string;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    fullname?: string;

    @ApiProperty()
    customerAddress?: CustomerAddressDto[];

    @ApiProperty()
    validInfo?: any[];

    @ApiProperty()
    refreshToken?: string;
}
