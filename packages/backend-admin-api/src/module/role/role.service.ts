import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import type { RoleModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';
import { groupBy } from 'lodash';

import type { BaseReponse } from '../../common/dto/base-respone.dto';
import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { ErrorMessage } from '../../constant';
import { RoleDto } from './dto/role.dto';
import type { RoleCreateDto } from './dto/role-create.dto';
import type { RolePageOptionsDto } from './dto/role-page-options.dto';
import type { RoleUpdateDto } from './dto/role-update.dto';
import type { RoleUserProvideDto } from './dto/role-user-provide.dto';

@Injectable()
export class RoleService {
    private readonly logger = new Logger(RoleService.name);

    constructor(private readonly data: IPgDataService) {}

    async create(formData: RoleCreateDto): Promise<RoleDto> {
        let model: RoleModel;

        try {
            model = await this.data.role.create(formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return RoleDto.fromModel(model);
    }

    async findById(id: string): Promise<RoleDto> {
        return RoleDto.fromModel(await this.data.role.findById(id));
    }

    async page(options: RolePageOptionsDto): Promise<PageResponseDto<RoleDto>> {
        const [data, count] = await Promise.all([this.data.role.page(options.skip, options.take), this.data.role.count()]);

        return {
            data: data.map((model) => RoleDto.fromModel(model)),
            count,
        };
    }

    async update(id: string | number, formData: RoleUpdateDto): Promise<RoleDto> {
        let model: RoleModel;

        try {
            model = await this.data.role.update(id, formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return RoleDto.fromModel(model);
    }

    async deleteById(id: string | number): Promise<void> {
        try {
            await this.data.role.deleteById(Number(id));
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async provideRolesForUser(formData: RoleUserProvideDto): Promise<BaseReponse<{ isOK: boolean }>> {
        const [roles, user] = await Promise.all([this.data.role.findByIds(formData.roleIds), this.data.user.findById(formData.userId)]);
        const groupRoles = groupBy(roles, 'id');

        if (!user) {
            throw new HttpException(`Không tìm thấy user với id: ${formData.userId}`, HttpStatus.NOT_FOUND);
        }

        for (const roleId of formData.roleIds) {
            if (!groupRoles[roleId]) {
                throw new HttpException(`Không tìm thấy role với id: ${roleId}`, HttpStatus.NOT_FOUND);
            }
        }

        try {
            await this.data.role.provideRolesForUser(formData.roleIds, formData.userId);
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            message: 'Tạo quyền cho người dùng thành công!',
            statusCode: HttpStatus.OK,
            data: {
                isOK: true,
            },
        };
    }
}
