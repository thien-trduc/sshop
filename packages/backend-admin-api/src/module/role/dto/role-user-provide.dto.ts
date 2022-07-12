import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class RoleUserProvideDto {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    roleIds: number[];

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}
