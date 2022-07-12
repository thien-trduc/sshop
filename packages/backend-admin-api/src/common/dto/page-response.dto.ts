import { ApiProperty } from '@nestjs/swagger';

export class PageResponseDto<T> {
    @ApiProperty({ isArray: true })
    data: T[];

    @ApiProperty()
    count: number;
}
