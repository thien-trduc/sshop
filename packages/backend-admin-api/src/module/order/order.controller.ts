import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { JwtAuthGuard } from '../../guard/user.guard';
import { HttpCacheInterceptor } from '../../interceptor';
import { OrderDto } from './dto/order.dto';
import { OrderByTransationDto } from './dto/order-by-transaction.dto';
import { OrderByTransationPageOptionsDto } from './dto/order-by-transaction-page-options.dto';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderPageOptionsDto } from './dto/order-page-options.dto';
import type { OrderStaticialByDate } from './dto/order-report.dto';
import { OrderReportOptionsDto } from './dto/order-report-options.dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { OrderUpdateStatusDto } from './dto/order-update-status.dto';
import { OrderService } from './order.service';

@Controller('orders')
@ApiTags('Đơn hàng')
export class OrderController {
    constructor(private readonly service: OrderService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] -Lấy danh sách đơn hàng !' })
    page(@Query() query: OrderPageOptionsDto): Promise<PageResponseDto<OrderDto>> {
        return this.service.page(query);
    }

    @Get('customer/history')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] -Lấy danh sách đơn hàng của user !' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: OrderDto,
    })
    getByUser(@Query() query: OrderPageOptionsDto): Promise<PageResponseDto<OrderDto>> {
        return this.service.getByUser(query);
    }

    @Get('customer/detail-by-transaction')
    @UseInterceptors(HttpCacheInterceptor)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] -Lấy danh đơn hàng của user theo transactionId !' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: OrderByTransationDto,
    })
    getByTransaction(@Query() formData: OrderByTransationPageOptionsDto): Promise<OrderByTransationDto> {
        return this.service.getByTransaction(formData);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Lấy đơn hàng theo id!' })
    getById(@Param('id') id: number): Promise<OrderDto> {
        return this.service.getById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] -Tạo đơn hàng và đăng session để chuẩn bị thanh toán!' })
    @ApiBody({
        type: OrderCreateDto,
    })
    @ApiResponse({
        type: OrderDto,
    })
    create(@Body() formData: OrderCreateDto): Promise<OrderDto> {
        return this.service.create(formData);
    }

    @Post('order')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Thống kê doanh thu từ ngày đến ngày !' })
    getReportOrder(@Body() formData: OrderReportOptionsDto): Promise<OrderStaticialByDate[]> {
        return this.service.getReportOrderByDate(formData);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Cập nhật đơn hàng !' })
    @ApiBody({
        type: OrderUpdateDto,
    })
    update(@Param('id') id: number, @Body() formData: OrderUpdateDto): Promise<OrderDto> {
        return this.service.update(id, formData);
    }

    @Patch('webhook/status')
    @ApiBody({
        type: OrderUpdateStatusDto,
    })
    @ApiOperation({ summary: '[WEBHOOK] - Cập nhật trạng thái đơn hàng từ cổng sau khi thanh toán!' })
    updateStatus(@Body() formData: OrderUpdateStatusDto): Promise<Required<{ isOK: boolean }>> {
        return this.service.updateStatus(formData);
    }
}
