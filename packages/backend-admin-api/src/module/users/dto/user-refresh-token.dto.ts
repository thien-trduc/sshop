import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UserRefreshTokenDto {
    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    secret: string;
}
