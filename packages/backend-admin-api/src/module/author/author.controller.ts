import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BaseReponse } from '../../common/dto/base-respone.dto';
import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { JwtAuthGuard } from './../../guard/user.guard';
import { AuthorService } from './author.service';
import type { AuthorDto } from './dto/author.dto';
import { AuthorBookCreateDto } from './dto/author-book-create.dto';
import { AuthorCreateDto } from './dto/author-create.dto';
import { AuthorPageOptionsDto } from './dto/author-page-options.dto';
import { AuthorUpdateDto } from './dto/author-update.dto';

@Controller('author')
@ApiTags('Tác giả')
export class AuthorController {
    constructor(private readonly service: AuthorService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Lấy danh sách tác giả!' })
    page(@Query() options: AuthorPageOptionsDto): Promise<PageResponseDto<AuthorDto>> {
        return this.service.page(options);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Lấy tác giả theo id!' })
    getById(@Param('id') id: string): Promise<AuthorDto> {
        return this.service.findById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Tạo tác giả' })
    @ApiBody({
        type: AuthorCreateDto,
    })
    create(@Body() formData: AuthorCreateDto): Promise<AuthorDto> {
        return this.service.create(formData);
    }

    @Post('books/provide')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Thêm sách cho tác giả' })
    @ApiBody({
        type: BaseReponse,
    })
    addBookToAuthor(@Body() formData: AuthorBookCreateDto): Promise<BaseReponse<any>> {
        return this.service.addBookToAuthor(formData);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Cập nhật tác giả theo id' })
    @ApiBody({
        type: AuthorUpdateDto,
    })
    update(@Param('id') id: string, @Body() formData: AuthorUpdateDto): Promise<AuthorDto> {
        return this.service.update(id, formData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Xóa tác giả theo id' })
    delete(@Param('id') id: number): Promise<void> {
        return this.service.deleteById(id);
    }
}
