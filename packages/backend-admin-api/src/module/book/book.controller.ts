import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { HttpCacheInterceptor } from '../../interceptor';
import { BookService } from './book.service';
import type { BookDto } from './dto/book.dto';
import { BookBestSellerPageOptions } from './dto/book-best-seller-page-options.dto';
import { BookCreateDto } from './dto/book-create.dto';
import { BookPageOptionsDto } from './dto/book-page-options.dto';
import { BookUpdateDto } from './dto/book-update.dto';

@Controller('books')
@ApiTags('Sách')
export class BookController {
    constructor(private readonly service: BookService) {}

    @Get()
    @UseInterceptors(HttpCacheInterceptor)
    @ApiOperation({ summary: '[ADMIN - USER] - Lấy danh sách sản phẩm !' })
    page(@Query() options: BookPageOptionsDto): Promise<PageResponseDto<BookDto>> {
        return this.service.page(options);
    }

    @Get('hot')
    @UseInterceptors(HttpCacheInterceptor)
    @ApiOperation({ summary: '[USER] - Lấy danh sách sản phẩm hot nhất!' })
    getHotBooks(): Promise<BookDto[]> {
        return this.service.getHotBooks();
    }

    @Get('best-seller')
    @UseInterceptors(HttpCacheInterceptor)
    @ApiOperation({ summary: '[USER] - Lấy danh sách sản phẩm bán chạy nhất!' })
    getBestSeller(@Query() options: BookBestSellerPageOptions): Promise<PageResponseDto<BookDto>> {
        return this.service.getBestSeller(options);
    }

    @Get('detail')
    @UseInterceptors(HttpCacheInterceptor)
    getDetailByIsbn(@Query('isbn') id: string): Promise<BookDto> {
        return this.service.findDetail(id);
    }

    @Get(':isbn')
    getById(@Param('isbn') id: string): Promise<BookDto> {
        return this.service.findById(id);
    }

    @Post()
    create(@Body() formData: BookCreateDto): Promise<BookDto> {
        return this.service.create(formData);
    }

    @Put(':isbn')
    update(@Param('isbn') id: string, @Body() formData: BookUpdateDto): Promise<BookDto> {
        return this.service.update(id, formData);
    }

    @Delete(':isbn')
    delete(@Param('isbn') id: string): Promise<void> {
        return this.service.deleteById(id);
    }
}
