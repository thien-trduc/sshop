import { EmployeeModel } from '../../../../../libs/data/src/lib/model/model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class EmployeeCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên nhân viên không được để trống!' })
    @Transform((value) => `${value}`.trim())
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Tên đệm nhân viên không được để trống!' })
    @Transform((value) => `${value}`.trim())
    surname: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Giới tính nhân viên không được để trống!' })
    @Transform((value) => Number(value))
    sex: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Ngày sinh nhân viên không được để trống!' })
    @Transform((value) => `${value}`.trim())
    birthdate: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Số điện thoại nhân viên không được trống!' })
    @IsPhoneNumber('VN', { message: 'Số điện thoại nhân viên không đúng định dạng! Xin nhập lại!' })
    @Transform((value) => `${value}`.trim())
    phone: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Email nhân viên không được trống!' })
    @IsEmail({}, { message: 'Email nhân viên không đúng định dạng! Xin nhập lại!' })
    @Transform((value) => `${value}`.trim())
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Phòng ban nhân viên không được trống!' })
    @Transform((value) => +value)
    departmentId: number;

    toModel(): EmployeeModel {
        return {
            id: undefined,
            createdat: undefined,
            updatedat: undefined,
            birthdate: this.birthdate,
            address: this.address,
            sex: this.sex,
            name: this.name,
            surname: this.surname,
            email: this.email,
            phone: this.phone,
            department_id: this.departmentId,
            user_id: 0,
        };
    }
}
