import { ApiProperty } from '@nestjs/swagger';

export class BaseReponse<T> {
    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    message: string;

    @ApiProperty()
    data?: T;
}
