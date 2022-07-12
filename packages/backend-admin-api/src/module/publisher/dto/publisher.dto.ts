import { PublisherModel } from '@tproject/libs/data';
import { BaseDto } from '../../../common/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PublisherDto extends BaseDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    static fromModel(model: PublisherModel): PublisherDto {
        return {
            id: model.id,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            name: model.name,
            address: model.address,
            email: model.email,
        };
    }
}
