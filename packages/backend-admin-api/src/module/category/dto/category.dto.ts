import { ApiProperty } from '@nestjs/swagger';
import type { CategoryModel } from '@tproject/libs/data';

import { BaseDto } from '../../../common/dto/base.dto';

export class CategoryDto extends BaseDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    icon?: string;

    @ApiProperty()
    slug?: string;

    @ApiProperty()
    priority: number;

    static fromModel(model: CategoryModel): CategoryDto {
        return {
            id: model.id,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            description: model.description,
            name: model.name,
            icon: model?.icon,
            slug: model?.slug,
            priority: model?.priority,
        };
    }
}
