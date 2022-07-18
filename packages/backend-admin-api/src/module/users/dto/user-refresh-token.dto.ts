import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserRefreshTokenDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Refresh token chưa được gửi xuống!' })
    @Transform((value) => `${value}`.trim())
    secret: string;
}
