import { ApiProperty } from '@nestjs/swagger';

export class OrderStaticialByDate {
    @ApiProperty()
    label: string;

    @ApiProperty()
    value: number;
}
