import { HttpException, HttpStatus, Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { IPgDataService } from '@tproject/libs/data';

import { CustomerDto } from '../module/customer/dto/customer.dto';

@Injectable({ scope: Scope.REQUEST })
export class CustomerProvider {
    private readonly logger = new Logger(CustomerProvider.name);

    constructor(@Inject(REQUEST) private readonly req, private readonly data: IPgDataService) {}

    async customer(): Promise<CustomerDto> {
        const customer = await this.data.customer.findOne({
            userId: this.req.user.id,
        });

        if (!customer) {
            throw new HttpException('Vui lòng đăng nhập để tiếp tục', HttpStatus.UNAUTHORIZED);
        }

        return CustomerDto.fromModel(customer);
    }

    get info(): any {
        return this.req.user.id;
    }
}
