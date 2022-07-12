import { ApiProperty } from '@nestjs/swagger';
import type { RoleModel } from '@tproject/libs/data';

import { BaseDto } from '../../../common/dto/base.dto';

export class RoleDto extends BaseDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    static fromModel(model: RoleModel): RoleDto {
        return {
            id: model.id,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            name: model.name,
            description: model.description,
        };
    }
}
