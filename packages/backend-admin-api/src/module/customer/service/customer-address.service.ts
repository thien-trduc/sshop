import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CacheService } from '@tproject/libs/core';
import type { CustomerAddressModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';

import { CustomerAddressDto } from '../dto/customer-address.dto';
import type { CustomerAddressCreateDto } from '../dto/customer-address-create.dto';
import type { CustomerAddressPageOptionsDto } from '../dto/customer-address-page-options.dto';
import type { CustomerAddressUpdateDto } from '../dto/customer-address-update.dto';
import type { BaseReponse } from './../../../common/dto/base-respone.dto';
import type { PageResponseDto } from './../../../common/dto/page-response.dto';
import { ErrorMessage } from './../../../constant/enum/error-message.enum';
import { CustomerProvider } from './../../../provider/customer.provider';

@Injectable()
export class CustomerAddressService {
    private readonly logger = new Logger(CustomerAddressService.name);

    private readonly name = CustomerAddressService.name;

    constructor(private readonly data: IPgDataService, private readonly cache: CacheService, private readonly customerProvider: CustomerProvider) {}

    async create(formData: CustomerAddressCreateDto): Promise<BaseReponse<CustomerAddressDto>> {
        let model: CustomerAddressModel;
        const customer = await this.customerProvider.customer();

        try {
            model = await this.data.customer.createAddress(formData.toModel(customer.id));
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'Thêm địa chỉ thành công!',
            data: CustomerAddressDto.fromModel(model),
        };
    }

    async findById(id: number): Promise<CustomerAddressDto> {
        return CustomerAddressDto.fromModel(await this.data.customer.findOneAdressById(id));
    }

    async page(options: CustomerAddressPageOptionsDto): Promise<PageResponseDto<CustomerAddressDto>> {
        const customer = await this.customerProvider.customer();
        const [data, count] = await Promise.all([
            this.data.customer.pageAddress(options.skip, options.take, {
                customer_id: customer.id,
            }),
            this.data.customer.countAddress(),
        ]);

        return {
            data: data.map((model) => CustomerAddressDto.fromModel(model)),
            count,
        };
    }

    async update(id: number, formData: CustomerAddressUpdateDto): Promise<BaseReponse<CustomerAddressDto>> {
        let model: CustomerAddressModel;
        const customer = await this.customerProvider.customer();

        try {
            model = await this.data.customer.updateAddress(id, formData.toModel(customer.id));
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'Cập nhật địa chỉ thành công!',
            data: CustomerAddressDto.fromModel(model),
        };
    }

    async deleteById(id: string | number): Promise<void> {
        try {
            await this.data.customer.deleteAddress(Number(id));
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
