import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CacheService, UtilService } from '@tproject/libs/core';
import type { DiscountModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { ErrorMessage } from '../../constant';
import { DiscountDto } from './dto/discount.dto';
import type { DiscountUpdateDto } from './dto/discount.update.dto';
import type { DiscountCreateDto } from './dto/discount-create.dto';
import type { DiscountDetailCreateDto } from './dto/discount-detail-create.dto';
import type { DiscountPageOptionsDto } from './dto/discount-page-options.dto';

@Injectable()
export class DiscountService {
    private readonly name = DiscountService.name;

    private readonly logger = new Logger(DiscountService.name);

    constructor(private readonly data: IPgDataService, private readonly cache: CacheService, private readonly util: UtilService) {}

    async create(formData: DiscountCreateDto): Promise<DiscountDto> {
        let model: DiscountModel;

        try {
            model = await this.data.discount.create(formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return DiscountDto.fromModel(model);
    }

    async findById(id: string): Promise<DiscountDto> {
        return DiscountDto.fromModel(await this.data.discount.findById(id));
    }

    async page(options: DiscountPageOptionsDto): Promise<PageResponseDto<DiscountDto>> {
        const [data, count] = await Promise.all([this.data.discount.page(options.skip, options.take), this.data.discount.count()]);

        return {
            data: data.map((model) => DiscountDto.fromModel(model)),
            count,
        };
    }

    async update(id: string | number, formData: DiscountUpdateDto): Promise<DiscountDto> {
        let model: DiscountModel;

        try {
            model = await this.data.discount.update(id, formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return DiscountDto.fromModel(model);
    }

    async deleteById(id: string | number): Promise<void> {
        try {
            await this.data.discount.deleteById(Number(id));
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createDiscountDetail(formData: DiscountDetailCreateDto): Promise<void> {
        try {
            await this.data.discount.createDiscountDetail(formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
