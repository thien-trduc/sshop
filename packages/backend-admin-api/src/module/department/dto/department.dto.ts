import { DepartmentModel } from '@tproject/libs/data';
import { BaseDto } from '../../../common/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentDto extends BaseDto {
    @ApiProperty()
    name: string;

    static fromModel(model: DepartmentModel): DepartmentDto {
        return {
          id: model.id,
          createdAt: model.createdat,
          updatedAt: model.updatedat,
          name: model.name,
        };
    }
}
