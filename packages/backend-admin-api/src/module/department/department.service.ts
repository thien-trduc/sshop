import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import type { DepartmentModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { ErrorMessage } from '../../constant';
import { DepartmentDto } from './dto/department.dto';
import type { DepartmentCreateDto } from './dto/department-create.dto';
import type { DepartmentPageOptionsDto } from './dto/department-page-options.dto';
import type { DepartmentUpdateDto } from './dto/department-update.dto';

@Injectable()
export class DepartmentService {
    private readonly logger = new Logger(DepartmentService.name);

    constructor(private readonly data: IPgDataService) {}

    async create(formData: DepartmentCreateDto): Promise<DepartmentDto> {
        let model: DepartmentModel;

        try {
            model = await this.data.department.create(formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return DepartmentDto.fromModel(model);
    }

    async findById(id: string): Promise<DepartmentDto> {
        return DepartmentDto.fromModel(await this.data.department.findById(id));
    }

    async page(options: DepartmentPageOptionsDto): Promise<PageResponseDto<DepartmentDto>> {
        const [data, count] = await Promise.all([this.data.department.page(options.skip, options.take), this.data.department.count()]);

        return {
            data: data.map((model) => DepartmentDto.fromModel(model)),
            count,
        };
    }

    async update(id: string | number, formData: DepartmentUpdateDto): Promise<DepartmentDto> {
        let model: DepartmentModel;

        try {
            model = await this.data.department.update(id, formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return DepartmentDto.fromModel(model);
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
