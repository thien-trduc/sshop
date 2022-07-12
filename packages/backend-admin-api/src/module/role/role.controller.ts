import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { BaseReponse } from '../../common/dto/base-respone.dto';
import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { JwtAuthGuard } from '../../guard/user.guard';
import type { RoleDto } from './dto/role.dto';
import { RoleCreateDto } from './dto/role-create.dto';
import { RolePageOptionsDto } from './dto/role-page-options.dto';
import { RoleUpdateDto } from './dto/role-update.dto';
import { RoleUserProvideDto } from './dto/role-user-provide.dto';
import { RoleService } from './role.service';

@Controller('roles')
@ApiTags('Nhóm quyền')
@ApiBearerAuth()
export class RoleController {
    constructor(private readonly service: RoleService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '[ADMIN] - Lấy danh sách quyền !' })
    page(@Query() options: RolePageOptionsDto): Promise<PageResponseDto<RoleDto>> {
        return this.service.page(options);
    }

    @Get('detail')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '[ADMIN] - Xem chi tiết quyền !' })
    getDetailById(@Query('id') id: string): Promise<RoleDto> {
        return this.service.findById(id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '[ADMIN] - Xem chi tiết quyền !' })
    getById(@Param('id') id: string): Promise<RoleDto> {
        return this.service.findById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '[ADMIN] - Tạo quyền cho user!' })
    @ApiBody({
        type: RoleCreateDto,
    })
    create(@Body() formData: RoleCreateDto): Promise<RoleDto> {
        return this.service.create(formData);
    }

    @Put('providing-to-user')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '[ADMIN] - Cấp quyền cho user !' })
    @ApiBody({
        type: RoleUserProvideDto,
    })
    provideRolesForUser(@Body() formData: RoleUserProvideDto): Promise<BaseReponse<{ isOK: boolean }>> {
        return this.service.provideRolesForUser(formData);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() formData: RoleUpdateDto): Promise<RoleDto> {
        return this.service.update(id, formData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id') id: string): Promise<void> {
        return this.service.deleteById(id);
    }
}
