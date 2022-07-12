import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CacheService, UtilService } from '@tproject/libs/core';
import type { CustomerModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';

import type { PageResponseDto } from '../../../common/dto/page-response.dto';
import { ErrorMessage } from '../../../constant';
import { CustomerProvider } from '../../../provider/customer.provider';
import { CustomerDto } from '../dto/customer.dto';
import type { CustomerCreateDto } from '../dto/customer-create.dto';
import type { CustomerInfoDto } from '../dto/customer-info.dto';
import type { CustomerPageOptionsDto } from '../dto/customer-page-options.dto';
import type { CustomerUpdateDto } from '../dto/customer-update.dto';
import type { BaseReponse } from './../../../common/dto/base-respone.dto';
import { ContextProvider } from './../../../provider/context.provider';
import type { CustomerUpdateAvatarDto } from './../dto/customer-update-avatar.dto';

@Injectable()
export class CustomerService {
    private readonly logger = new Logger(CustomerService.name);

    private readonly name = CustomerService.name;

    constructor(private readonly data: IPgDataService, private readonly customerProvider: CustomerProvider, private readonly cache: CacheService) {}

    async create(formData: CustomerCreateDto): Promise<CustomerDto> {
        let model: CustomerModel;

        try {
            model = await this.data.customer.create(formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return CustomerDto.fromModel(model);
    }

    async findById(id: string): Promise<CustomerDto> {
        return CustomerDto.fromModel(await this.data.customer.findById(id));
    }

    async page(options: CustomerPageOptionsDto): Promise<PageResponseDto<CustomerDto>> {
        const [data, count] = await Promise.all([this.data.customer.page(options.skip, options.take), this.data.customer.count()]);

        return {
            data: data.map((model) => CustomerDto.fromModel(model)),
            count,
        };
    }

    async update(formData: CustomerUpdateDto): Promise<BaseReponse<CustomerInfoDto>> {
        const userId = this.customerProvider.info;
        const customer = await this.data.customer.findOne({ userId });
        const dataOld = UtilService.excludePropObj(customer, 'customer_address');

        try {
            await this.data.customer.update(customer.id, {
                ...dataOld,
                fullname: formData.fullname,
                name: formData.fullname,
                sex: formData.sex,
                birthdate: formData.birthdate,
                phone: formData.phone,
                email: formData.email,
            });
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const data = await this.getCustomerInfo();

        return {
            statusCode: HttpStatus.OK,
            message: 'Cập nhật thông tin thành công!',
            data,
        };
    }

    async deleteById(id: string | number): Promise<void> {
        try {
            await this.data.customer.deleteById(Number(id));
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCurrentInfo(): Promise<CustomerInfoDto> {
        return this.getCustomerInfo();
    }

    async getCustomerInfo(): Promise<CustomerInfoDto> {
        const customer = await this.customerProvider.customer();
        const cusomterValid = await this.data.customer.findById(customer.id);
        const user = await this.data.user.findById(customer.userId);
        const userObj = UtilService.excludePropObj({ ...user }, 'password', 'id', 'createdAt', 'updatedAt', 'refresh_token');

        return {
            ...userObj,
            ...customer,
            validInfo: ContextProvider.validInfo<CustomerModel>(cusomterValid),
            refreshToken: user?.refresh_token,
        };
    }

    async updateAvatar(formData: CustomerUpdateAvatarDto): Promise<BaseReponse<CustomerInfoDto>> {
        const userId = this.customerProvider.info;
        const customer = await this.data.customer.findOne({ userId });
        const dataOld = UtilService.excludePropObj(customer, 'customer_address');

        try {
            await this.data.customer.update(customer.id, {
                ...dataOld,
                avatar: formData.avatar,
            });
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const data = await this.getCustomerInfo();

        return {
            statusCode: HttpStatus.OK,
            message: 'Cập nhật thông tin thành công!',
            data,
        };
    }
}
