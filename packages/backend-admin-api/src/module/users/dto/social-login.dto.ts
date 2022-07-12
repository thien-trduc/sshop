import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

export class SocialLoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @Transform((value) => `${value}`.trim())
    type: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    accessToken?: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    @IsEmail()
    @ValidateIf((o) => o.value)
    username?: string;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    password?: string;
}
