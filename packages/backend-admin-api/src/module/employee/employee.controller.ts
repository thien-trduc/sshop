import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { EmployeeReadPolicyHandler } from '../casl/policy/handler';
import { Policy } from '../casl/policy/policy.decorator';
import { PoliciesGuard } from '../casl/policy/policy.guard';
import { CategoryPageOptionsDto } from '../category/dto/category-page-options.dto';
import { JwtAuthGuard } from './../../guard/user.guard';
import type { EmployeeDto } from './dto/employee.dto';
import { EmployeeCreateDto } from './dto/employee-create.dto';
import { EmployeeUpdateDto } from './dto/employee-update.dto';
import { EmployeeService } from './employee.service';

@Controller('employee')
@ApiTags('Nhân viên')
@ApiBearerAuth()
export class EmployeeController {
    constructor(private readonly service: EmployeeService) {}

    @Get()
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Policy(new EmployeeReadPolicyHandler())
    page(@Query() options: CategoryPageOptionsDto): Promise<PageResponseDto<EmployeeDto>> {
        return this.service.page(options);
    }

    @Get(':id')
    getById(@Param('id') id: string): Promise<EmployeeDto> {
        return this.service.findById(id);
    }

    @Post()
    create(@Body() formData: EmployeeCreateDto): Promise<EmployeeDto> {
        return this.service.create(formData);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() formData: EmployeeUpdateDto): Promise<EmployeeDto> {
        return this.service.update(id, formData);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.service.deleteById(id);
    }
}
