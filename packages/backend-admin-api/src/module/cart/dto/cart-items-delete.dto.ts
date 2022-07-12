import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateIf } from 'class-validator';

export class CartItemsDeleteDto {
    @ApiProperty({ description: 'Danh sách mã sách sẽ xóa' })
    @IsArray()
    @IsNotEmpty({ message: 'Danh sách mã isbn của sách sẽ xóa không được để trống !' })
    isbns: string[];

    @ApiProperty({ description: 'Danh sách mã sách đang chọn' })
    @IsArray()
    @ValidateIf((o) => o.bookIds)
    bookIds: string[];
}
