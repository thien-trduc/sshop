import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { HttpCacheInterceptor } from '../../interceptor';
import { CategoryService } from './category.service';
import type { CategoryDto } from './dto/category.dto';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryPageOptionsDto } from './dto/category-page-options.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';

@Controller('categories')
@ApiTags('Thể Loại Sách')
export class CategoryController {
    constructor(private readonly service: CategoryService) {}

    @Get()
    @UseInterceptors(HttpCacheInterceptor)
    page(@Query() options: CategoryPageOptionsDto): Promise<PageResponseDto<CategoryDto>> {
        return this.service.page(options);
    }

    @Get(':id')
    getById(@Param('id') id: string): Promise<CategoryDto> {
        return this.service.findById(id);
    }

    @Post()
    create(@Body() formData: CategoryCreateDto): Promise<CategoryDto> {
        return this.service.create(formData);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() formData: CategoryUpdateDto): Promise<CategoryDto> {
        return this.service.update(id, formData);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.service.deleteById(id);
    }
}
