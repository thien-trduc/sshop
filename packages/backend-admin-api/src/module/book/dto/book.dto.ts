import { ApiProperty } from '@nestjs/swagger';
import { UtilService } from '@tproject/libs/core';
import type { AuthorModel, BookModel, BookModelJoinPublisherCategory, BookWithSaleModel } from '@tproject/libs/data';

import { AuthorDto } from '../../author/dto/author.dto';
import { CategoryDto } from '../../category/dto/category.dto';
import { PublisherDto } from '../../publisher/dto/publisher.dto';
import { BookSaleDto } from './book-sale.dto';

export class BookDto {
    @ApiProperty()
    isbn: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    name: string;

    @ApiProperty()
    page?: number;

    @ApiProperty()
    quantity?: number;

    @ApiProperty()
    yearOfPublish?: number;

    @ApiProperty()
    status: number;

    @ApiProperty()
    image?: string;

    @ApiProperty()
    category?: CategoryDto;

    @ApiProperty()
    publisher?: PublisherDto;

    @ApiProperty()
    price?: number;

    @ApiProperty()
    priceText?: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    sale?: BookSaleDto;

    @ApiProperty()
    images?: string[];

    @ApiProperty()
    slug?: string;

    @ApiProperty()
    inforDetails?: string;

    @ApiProperty()
    author?: AuthorDto;

    static fromModel(model: BookModel): BookDto {
        return {
            isbn: model.isbn,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            name: model.name,
            page: Number(model.page),
            quantity: Number(model.quantity),
            yearOfPublish: model.yearOfPublish,
            status: model.status,
            image: model.image,
            description: model?.description,
            images: model?.images,
            slug: model?.slug || UtilService.slugVietnameseName(model.name),
            inforDetails: model?.info_details.replace('{page}', `${model.page}`) || '',
        };
    }

    static fromModelJoinPublisherCategory(
        model: BookModelJoinPublisherCategory,
        price: number,
        saleModel?: BookWithSaleModel,
        author?: AuthorModel,
    ): BookDto {
        return {
            isbn: model.isbn,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            name: model.name,
            page: Number(model.page),
            quantity: Number(model.quantity),
            yearOfPublish: model.yearOfPublish,
            status: model.status,
            image: model.image,
            category: CategoryDto.fromModel(model.category),
            publisher: PublisherDto.fromModel(model.publisher),
            price,
            priceText: UtilService.getPriceText(price),
            description: model?.description,
            sale: saleModel ? BookSaleDto.fromModel(saleModel) : undefined,
            images: model?.images,
            slug: model?.slug || UtilService.slugVietnameseName(model.name),
            inforDetails: model?.info_details.replace('{page}', `${model.page}`) || '',
            author: author ? AuthorDto.fromModel(author) : undefined,
        };
    }

    static fromModelsJoinPublisherCategory(
        model: BookModelJoinPublisherCategory,
        price: number,
        saleModel?: BookWithSaleModel,
        author?: AuthorModel,
    ): BookDto {
        return {
            isbn: model.isbn,
            createdAt: model.createdat,
            updatedAt: model.updatedat,
            name: model.name,
            status: model.status,
            image: model.image,
            category: CategoryDto.fromModel(model.category),
            publisher: PublisherDto.fromModel(model.publisher),
            priceText: UtilService.getPriceText(price),
            sale: saleModel ? BookSaleDto.fromModel(saleModel) : undefined,
            images: model?.images,
            slug: model?.slug || UtilService.slugVietnameseName(model.name),
            author: author ? AuthorDto.fromModel(author) : undefined,
        };
    }
}
