import { ApiProperty } from '@nestjs/swagger';
import { UtilService } from '@tproject/libs/core';
import type { BookModel } from '@tproject/libs/data';
import { Transform } from 'class-transformer';
import { IsArray, IsISBN, IsNotEmpty } from 'class-validator';

export class BookCreateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Mã đầu sách không được để trống!' })
    @IsISBN('10', { message: 'Vui lòng nhập đúng định dạng ISBN-10 cho mã đầu sách' })
    @Transform((value) => `${value}`.trim())
    isbn: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Tên đầu sách không được để trống!' })
    @Transform((value) => `${value}`.trim())
    name: string;

    @ApiProperty()
    @Transform((value) => Number(value))
    page?: number;

    @ApiProperty()
    @Transform((value) => Number(value))
    quantity?: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Năm xuất bản đầu sách không được để trống!' })
    @Transform((value) => Number(value))
    yearOfPublish: number;

    @ApiProperty()
    @Transform((value) => Number(value))
    status?: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Hình ảnh sách không được để trống!' })
    @Transform((value) => `${value}`.trim())
    image: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Giá không được để trống!' })
    @Transform((value) => Number(value))
    price: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Thể loại sách không được để trống!' })
    @Transform((value) => Number(value))
    categoryId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Nhà xuất bản không được để trống!' })
    @Transform((value) => Number(value))
    publisherId: number;

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    description?: string;

    @ApiProperty()
    @IsArray({ message: 'Danh sách hình ảnh phải là 1 mảng' })
    images?: string[];

    @ApiProperty()
    @Transform((value) => `${value}`.trim())
    infoDetails?: string;

    toModel(): BookModel {
        return {
            isbn: this.isbn,
            createdat: undefined,
            updatedat: undefined,
            name: this.name,
            page: BigInt(this.page),
            quantity: BigInt(this.quantity),
            yearOfPublish: this.yearOfPublish,
            status: this.status,
            image: this.image,
            category_id: this.categoryId,
            publisher_id: this.publisherId,
            description: this.description,
            images: this.images || [],
            slug: UtilService.slugVietnameseName(this.name),
            info_details: this.infoDetails,
        };
    }
}
