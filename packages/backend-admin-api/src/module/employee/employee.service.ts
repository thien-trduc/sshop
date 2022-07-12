import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EmployeeCreateDto } from './dto/employee-create.dto';
import { EmployeeDto } from './dto/employee.dto';
import {EmployeeModel, IPgDataService} from '@tproject/libs/data';
import { ErrorMessage } from '../../constant';
import { EmployeePageOptionsDto } from './dto/employee-page-options.dto';
import { PageResponseDto } from '../../common/dto/page-response.dto';
import { EmployeeUpdateDto } from './dto/employee-update.dto';

@Injectable()
export class EmployeeService {
    private readonly logger = new Logger(EmployeeService.name);

    constructor(private readonly data: IPgDataService) {}

    async create(formData: EmployeeCreateDto): Promise<EmployeeDto> {
        let model: EmployeeModel;
        try {
            model = await this.data.employee.create(formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);
            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return EmployeeDto.fromModel(model);
    }

    async findById(id: string): Promise<EmployeeDto> {
        return EmployeeDto.fromModel(await this.data.employee.findById(id));
    }

    async page(options: EmployeePageOptionsDto): Promise<PageResponseDto<EmployeeDto>> {
        const [data, count] = await Promise.all([this.data.employee.page(options.skip, options.take), this.data.employee.count()]);
        return {
            data: data.map((model) => EmployeeDto.fromModel(model)),
            count,
        };
    }

    async update(id: string | number, formData: EmployeeUpdateDto): Promise<EmployeeDto> {
        let model: EmployeeModel;
        try {
            model = await this.data.employee.update(id, formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);
            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return EmployeeDto.fromModel(model);
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
