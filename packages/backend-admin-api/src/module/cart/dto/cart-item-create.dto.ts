import { ApiProperty } from '@nestjs/swagger';
import type { CartDetailModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsISBN, IsNotEmpty, IsNumber, Max, Min, ValidateIf } from 'class-validator';

export class CartItemCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Vui lòng nhập mã sách !' })
    @IsISBN('10', { message: 'Vui lòng nhập đúng định dạng ISBN-10 cho mã đầu sách' })
    @Transform((value) => `${value}`.trim())
    isbn: string;

    @ApiProperty()
    @Max(100, { message: 'Chỉ được mua tối đa 100 quyển sách!' })
    @Min(1, { message: 'Số lượng ít nhất phải là 1!' })
    @IsNumber()
    @IsNotEmpty({ message: 'Vui lòng nhập số lượng !' })
    @Transform((value) => Number(value))
    quantity: number;

    toModel(): CartDetailModel {
        return {
            book_id: this.isbn,
            quantity: BigInt(this.quantity),
            cart_id: undefined,
            price: undefined,
            is_selected: false,
        };
    }
}
