import { ApiProperty } from '@nestjs/swagger';
import type { DiscountDetailModel, DiscountModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsBoolean, IsISBN, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class DiscountDetailCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Vui lòng nhập mã sách !' })
    @IsISBN('10', { message: 'Vui lòng nhập đúng định dạng ISBN-10 cho mã đầu sách !' })
    @Transform((value) => `${value}`.trim())
    isbn: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Vui lòng nhập mã giảm giá !' })
    @Transform((value) => Number(value))
    discountId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Vui lòng nhập giá trị giảm giá (%) !' })
    @IsNumber()
    value: number;

    @ApiProperty()
    @IsBoolean()
    @ValidateIf((o) => o.status)
    status?: boolean;

    toModel(): DiscountDetailModel {
        return {
            discount_id: this.discountId,
            book_id: this.isbn,
            type: 0,
            value: this.value,
            status: this.status,
        };
    }
}
