import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { HttpCacheInterceptor } from '../../interceptor';
import { DiscountService } from './discount.service';
import type { DiscountDto } from './dto/discount.dto';
import { DiscountUpdateDto } from './dto/discount.update.dto';
import { DiscountCreateDto } from './dto/discount-create.dto';
import { DiscountDetailCreateDto } from './dto/discount-detail-create.dto';
import { DiscountPageOptionsDto } from './dto/discount-page-options.dto';

@Controller('discounts')
@ApiTags('Giảm giá')
export class DiscountController {
    constructor(private readonly service: DiscountService) {}

    @Get('page')
    @UseInterceptors(HttpCacheInterceptor)
    page(@Query() options: DiscountPageOptionsDto): Promise<PageResponseDto<DiscountDto>> {
        return this.service.page(options);
    }

    @Get(':id')
    getById(@Param('id') id: string): Promise<DiscountDto> {
        return this.service.findById(id);
    }

    @Post()
    @ApiBody({
        type: DiscountCreateDto,
    })
    create(@Body() formData: DiscountCreateDto): Promise<DiscountDto> {
        return this.service.create(formData);
    }

    @Post('detail')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBody({
        type: DiscountDetailCreateDto,
    })
    createDetail(@Body() formData: DiscountDetailCreateDto): Promise<void> {
        return this.service.createDiscountDetail(formData);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() formData: DiscountUpdateDto): Promise<DiscountDto> {
        return this.service.update(id, formData);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.service.deleteById(id);
    }
}
