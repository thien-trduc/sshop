import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CustomerUpdateAvatarDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Avatar không được để trống!' })
    @Transform((value) => `${value}`.trim())
    avatar: string;
}
