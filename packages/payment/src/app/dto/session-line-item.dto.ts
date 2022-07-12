import { ApiProperty } from '@nestjs/swagger';

export class SessionLineItemDto {
    @ApiProperty()
    price: number;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    image: string;
}
