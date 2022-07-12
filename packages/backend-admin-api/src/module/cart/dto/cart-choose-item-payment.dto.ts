import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CartChoosePaymentDto {
    @ApiProperty()
    @IsArray()
    bookIds: string[];
}
