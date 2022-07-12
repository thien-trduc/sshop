import { ApiProperty } from '@nestjs/swagger';
import type { DiscountModel } from '@tproject/libs/data';

import { BaseDto } from './../../../common/dto/base.dto';

export class DiscountDto extends BaseDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate: Date;

    @ApiProperty()
    description: string;

    static fromModel(model: DiscountModel): DiscountDto {
        return {
            id: model.id,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            name: model.name,
            startDate: model.start_date,
            endDate: model.end_date,
            description: model.description,
        };
    }
}
