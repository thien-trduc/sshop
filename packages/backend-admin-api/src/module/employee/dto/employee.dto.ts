import { BaseDto } from '../../../common/dto/base.dto';
import { EmployeeModel } from '../../../../../libs/data/src/lib/model/model';
import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDto extends BaseDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    surname: string;

    @ApiProperty()
    sex: number;

    @ApiProperty()
    birthdate: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    static fromModel(model: EmployeeModel): EmployeeDto {
        return {
            id: model.id,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            address: model.address,
            email: model.email,
            name: model.name,
            sex: model.sex,
            birthdate: model.birthdate,
            phone: model.phone,
            surname: model.surname,
        };
    }
}
