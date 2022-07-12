import { ApiProperty } from '@nestjs/swagger';

export class SocialLoginVerifyDto {
    @ApiProperty()
    token: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    role?: string[];
}
