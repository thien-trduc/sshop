import { ApiProperty } from '@nestjs/swagger';

export class SessionDto {
    @ApiProperty()
    url: string;
}
