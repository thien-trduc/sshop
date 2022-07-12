import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { CategoryPageOptionsDto } from '../category/dto/category-page-options.dto';
import { HttpCacheInterceptor } from './../../interceptor/cache.interceptor';
import type { PublisherDto } from './dto/publisher.dto';
import { PublisherCreateDto } from './dto/publisher-create.dto';
import { PublisherUpdateDto } from './dto/publisher-update.dto';
import { PublisherService } from './publisher.service';

@Controller('publishers')
@ApiTags('Nhà Xuất Bản')
export class PublisherController {
    constructor(private readonly service: PublisherService) {}

    @Get('page')
    @UseInterceptors(HttpCacheInterceptor)
    page(@Query() options: CategoryPageOptionsDto): Promise<PageResponseDto<PublisherDto>> {
        return this.service.page(options);
    }

    @Get(':id')
    getById(@Param('id') id: string): Promise<PublisherDto> {
        return this.service.findById(id);
    }

    @Post()
    create(@Body() formData: PublisherCreateDto): Promise<PublisherDto> {
        return this.service.create(formData);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() formData: PublisherUpdateDto): Promise<PublisherDto> {
        return this.service.update(id, formData);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.service.deleteById(id);
    }
}
