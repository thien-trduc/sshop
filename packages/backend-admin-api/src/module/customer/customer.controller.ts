import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { BaseReponse } from '../../common/dto/base-respone.dto';
import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { JwtAuthGuard } from '../../guard/user.guard';
import { CacheUserInfoInterceptor } from '../../interceptor';
import type { CustomerDto } from './dto/customer.dto';
import type { CustomerAddressDto } from './dto/customer-address.dto';
import { CustomerAddressCreateDto } from './dto/customer-address-create.dto';
import { CustomerAddressPageOptionsDto } from './dto/customer-address-page-options.dto';
import { CustomerAddressUpdateDto } from './dto/customer-address-update.dto';
import { CustomerCreateDto } from './dto/customer-create.dto';
import type { CustomerInfoDto } from './dto/customer-info.dto';
import { CustomerPageOptionsDto } from './dto/customer-page-options.dto';
import { CustomerUpdateDto } from './dto/customer-update.dto';
import { CustomerUpdateAvatarDto } from './dto/customer-update-avatar.dto';
import { CustomerService } from './service/customer.service';
import { CustomerAddressService } from './service/customer-address.service';

@Controller('customers')
@ApiTags('Khách hàng')
export class CustomerController {
    constructor(private readonly service: CustomerService, private readonly customerAddressService: CustomerAddressService) {}

    @Get()
    @ApiOperation({ summary: '[ADMIN] - Lấy danh sách khách hàng' })
    page(@Query() options: CustomerPageOptionsDto): Promise<PageResponseDto<CustomerDto>> {
        return this.service.page(options);
    }

    @Get('info')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(CacheUserInfoInterceptor)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Lấy thông tin phiên đăng nhập' })
    getCurrentInfo(): Promise<CustomerInfoDto> {
        return this.service.getCurrentInfo();
    }

    @Get('address')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Lấy danh sách thông tin sổ địa chỉ của khách hàng' })
    pageAddress(@Query() options: CustomerAddressPageOptionsDto): Promise<PageResponseDto<CustomerAddressDto>> {
        return this.customerAddressService.page(options);
    }

    @Get('address/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Lấy thông tin sổ địa chỉ của khách hàng theo id (id địa chỉ)' })
    getAddressById(@Param('id') id: number): Promise<CustomerAddressDto> {
        return this.customerAddressService.findById(id);
    }

    @Get(':id')
    @ApiOperation({ summary: '[ADMIN]] - Lấy thông tin khách hàng theo id (id khách hàng)' })
    getById(@Param('id') id: string): Promise<CustomerDto> {
        return this.service.findById(id);
    }

    @Post('address')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Tạo thông tin sổ địa chỉ của khách hàng' })
    @ApiBody({
        type: CustomerAddressCreateDto,
    })
    createAddress(@Body() formData: CustomerAddressCreateDto): Promise<BaseReponse<CustomerAddressDto>> {
        return this.customerAddressService.create(formData);
    }

    @Post()
    @ApiOperation({ summary: '[ADMIN] - Tạo thông tin khách hàng' })
    create(@Body() formData: CustomerCreateDto): Promise<CustomerDto> {
        return this.service.create(formData);
    }

    @Put('address/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Cập nhât thông tin sổ địa chỉ khách hàng' })
    @ApiBody({
        type: CustomerAddressUpdateDto,
    })
    updateAddress(@Param('id') id: number, @Body() formData: CustomerAddressUpdateDto): Promise<BaseReponse<CustomerAddressDto>> {
        return this.customerAddressService.update(id, formData);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Cập nhât thông tin khách hàng' })
    @ApiBody({
        type: CustomerUpdateDto,
    })
    update(@Body() formData: CustomerUpdateDto): Promise<BaseReponse<CustomerInfoDto>> {
        return this.service.update(formData);
    }

    @Patch('avatar')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Cập nhât avatar khách hàng' })
    @ApiBody({
        type: CustomerUpdateAvatarDto,
    })
    updateAvatar(@Body() formData: CustomerUpdateAvatarDto): Promise<BaseReponse<CustomerInfoDto>> {
        return this.service.updateAvatar(formData);
    }

    @Delete('address/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[USER] - Xóa sổ địa chỉ khách hàng theo id (id địa chỉ)' })
    deleteAddress(@Param('id') id: number): Promise<void> {
        return this.customerAddressService.deleteById(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] - Xóa thong tin khách hàng theo id' })
    delete(@Param('id') id: number): Promise<void> {
        return this.service.deleteById(id);
    }
}
