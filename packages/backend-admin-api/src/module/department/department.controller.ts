import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { DepartmentService } from './department.service';
import type { DepartmentDto } from './dto/department.dto';
import { DepartmentCreateDto } from './dto/department-create.dto';
import { DepartmentPageOptionsDto } from './dto/department-page-options.dto';
import { DepartmentUpdateDto } from './dto/department-update.dto';

@Controller('departments')
@ApiTags('Phòng ban')
export class DepartmentController {
    constructor(private readonly service: DepartmentService) {}

    @Get()
    page(@Query() options: DepartmentPageOptionsDto): Promise<PageResponseDto<DepartmentDto>> {
        return this.service.page(options);
    }

    @Get(':id')
    getById(@Param('id') id: string): Promise<DepartmentDto> {
        return this.service.findById(id);
    }

    @Post()
    create(@Body() formData: DepartmentCreateDto): Promise<DepartmentDto> {
        return this.service.create(formData);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() formData: DepartmentUpdateDto): Promise<DepartmentDto> {
        return this.service.update(id, formData);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.service.deleteById(id);
    }
}
