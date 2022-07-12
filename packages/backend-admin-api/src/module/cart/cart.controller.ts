import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { BaseReponse } from '../../common/dto/base-respone.dto';
import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { JwtAuthGuard } from '../../guard/user.guard';
import { CartService } from './cart.service';
import type { CartDto } from './dto/cart.dto';
import { CartChoosePaymentDto } from './dto/cart-choose-item-payment.dto';
import type { CartDetailDto } from './dto/cart-detail.dto';
import { CartDetailPageOptionsDto } from './dto/cart-detail-page-options.dto';
import type { CartInfoPaymentDto } from './dto/cart-info-payment.dto';
import type { CartItemDto } from './dto/cart-item.dto';
import { CartItemCreateDto } from './dto/cart-item-create.dto';
import { CartItemPageOptionsDto } from './dto/cart-item-page-options.dto';
import { CartItemUpdateDto } from './dto/cart-item-update.dto';
import { CartItemsDeleteDto } from './dto/cart-items-delete.dto';
import { CartPageOptionsDto } from './dto/cart-page-options.dto';
import { CartUpdateDto } from './dto/cart-update.dto';

@Controller('carts')
@ApiTags('Giỏ hàng')
export class CartController {
    constructor(private readonly service: CartService) {}

    @Get()
    @ApiOperation({ summary: '[ADMIN] - Lấy danh sách giỏ hàng!' })
    page(@Query() options: CartPageOptionsDto): Promise<PageResponseDto<CartDto>> {
        return this.service.page(options);
    }

    @Get('details-by-customer')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Lấy tất cả giỏ hàng của khách hàng!' })
    getByCustomer(@Query() options: CartDetailPageOptionsDto): Promise<CartDetailDto> {
        return this.service.getCartByCustomer(options);
    }

    @Get('quantity-items-customer')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Lấy sổ lượng giỏ hàng của khách hàng!' })
    getCartCountItemByCustomer(): Promise<{ count: number }> {
        return this.service.getCartCountItemByCustomer();
    }

    @Get(':cartid')
    @ApiOperation({ summary: '[ADMIN] - Lấy giỏ hàng bằng id!' })
    getById(@Param('cartid') id: string): Promise<CartDto> {
        return this.service.findById(id);
    }

    @Get(':cartid/items')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Lấy tất cả chỉ tiết của giỏ hàng!' })
    pageCartItem(@Param('cartid') cartId: string, @Query() options: CartItemPageOptionsDto): Promise<PageResponseDto<CartItemDto>> {
        return this.service.pageCartItem(cartId, options);
    }

    @Post('item')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Thêm sản phẩm vào giỏ hàng ở trang chi tiết sản phẩm!' })
    @ApiBody({
        type: CartItemCreateDto,
    })
    insertItemForCart(@Body() formData: CartItemCreateDto): Promise<BaseReponse<{ isOK: boolean }>> {
        return this.service.insertItemForCart(formData);
    }

    @Put('item/multiple-deleting-by-user')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Khách hàng bỏ nhiều sản phẩm trong giỏ hàng không muốn mua nữa !' })
    @ApiBody({
        type: CartItemsDeleteDto,
    })
    deleteItemsForCart(@Body() formData: CartItemsDeleteDto): Promise<BaseReponse<CartInfoPaymentDto>> {
        return this.service.deleteItemForCart(formData);
    }

    @Patch('info-payment')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Lấy thông tin giỏ hàng để thanh toán khi click chọn sản phẩm!' })
    @ApiBody({
        type: CartChoosePaymentDto,
    })
    getInfoByCartToPayment(@Body() formData: CartChoosePaymentDto): Promise<BaseReponse<CartInfoPaymentDto>> {
        return this.service.getInfoByCartToPayment(formData);
    }

    @Put('item/deleting-by-user')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Khách hàng bỏ 1 sản phẩm trong giỏ hàng không muốn mua nữa !' })
    deleteItemForCart(@Query('isbn') id: string, @Body() formData: CartChoosePaymentDto): Promise<BaseReponse<CartInfoPaymentDto>> {
        return this.service.deleteItemForCart({
            ...formData,
            isbns: [id],
        });
    }

    @Patch('item')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Cập nhật lại số lượng của sản phẩm trong trang giỏ hàng của khách hàng!' })
    @ApiBody({
        type: CartItemUpdateDto,
    })
    updateItemForCart(@Body() formData: CartItemUpdateDto): Promise<BaseReponse<CartInfoPaymentDto>> {
        return this.service.updateItemForCart(formData);
    }

    @Put(':cartid')
    @ApiOperation({ summary: '[ADMIN] - Cập nhật giỏ hàng bằng id!' })
    update(@Param('cartid') id: string, @Body() formData: CartUpdateDto): Promise<CartDto> {
        return this.service.update(id, formData);
    }

    @Delete(':cartid')
    @ApiOperation({ summary: '[ADMIN] - Xóa giỏ hàng bằng id!' })
    delete(@Param('cartid') id: number): Promise<void> {
        return this.service.deleteById(id);
    }
}
