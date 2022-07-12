import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CacheService, UtilService } from '@tproject/libs/core';
import type { CategoryModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { ErrorMessage, OrderLower } from '../../constant';
import { CategoryDto } from './dto/category.dto';
import type { CategoryCreateDto } from './dto/category-create.dto';
import type { CategoryPageOptionsDto } from './dto/category-page-options.dto';
import type { CategoryUpdateDto } from './dto/category-update.dto';

@Injectable()
export class CategoryService {
    private readonly name = CategoryService.name;

    private readonly logger = new Logger(CategoryService.name);

    constructor(private readonly data: IPgDataService, private readonly cache: CacheService, private readonly util: UtilService) {}

    async create(formData: CategoryCreateDto): Promise<CategoryDto> {
        let model: CategoryModel;

        try {
            model = await this.data.category.create(formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return CategoryDto.fromModel(model);
    }

    async findById(id: string): Promise<CategoryDto> {
        return CategoryDto.fromModel(await this.data.category.findById(id));
    }

    async page(options: CategoryPageOptionsDto): Promise<PageResponseDto<CategoryDto>> {
        const [data, count] = await Promise.all([
            this.data.category.page(options.skip, options.take, undefined, {
                priority: OrderLower.ASC,
            }),
            this.data.category.count(),
        ]);

        return {
            data: data.map((model) => CategoryDto.fromModel(model)),
            count,
        };
    }

    async update(id: string | number, formData: CategoryUpdateDto): Promise<CategoryDto> {
        let model: CategoryModel;

        try {
            model = await this.data.category.update(id, formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return CategoryDto.fromModel(model);
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
