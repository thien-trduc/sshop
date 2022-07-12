import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CacheService, UtilService } from '@tproject/libs/core';
import type { PublisherModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { ErrorMessage } from '../../constant';
import { PublisherDto } from './dto/publisher.dto';
import type { PublisherCreateDto } from './dto/publisher-create.dto';
import type { PublisherPageOptionsDto } from './dto/publisher-page-options.dto';
import type { PublisherUpdateDto } from './dto/publisher-update.dto';

@Injectable()
export class PublisherService {
    private readonly name = PublisherService.name;

    private readonly logger = new Logger(PublisherService.name);

    constructor(private readonly data: IPgDataService, private readonly util: UtilService, private readonly cache: CacheService) {}

    async create(formData: PublisherCreateDto): Promise<PublisherDto> {
        let model: PublisherModel;

        try {
            model = await this.data.publisher.create(formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return PublisherDto.fromModel(model);
    }

    async findById(id: string): Promise<PublisherDto> {
        return PublisherDto.fromModel(await this.data.publisher.findById(id));
    }

    async page(options: PublisherPageOptionsDto): Promise<PageResponseDto<PublisherDto>> {
        const [data, count] = await Promise.all([this.data.publisher.page(options.skip, options.take), this.data.publisher.count()]);

        return {
            data: data.map((model) => PublisherDto.fromModel(model)),
            count,
        };
    }

    async update(id: string | number, formData: PublisherUpdateDto): Promise<PublisherDto> {
        let model: PublisherModel;

        try {
            model = await this.data.publisher.update(id, formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return PublisherDto.fromModel(model);
    }

    async deleteById(id: string | number): Promise<void> {
        try {
            await this.data.category.deleteById(Number(id));
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
