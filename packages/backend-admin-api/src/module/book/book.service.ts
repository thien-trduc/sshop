import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import type { BookModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';
import * as moment from 'moment';

import type { IGenericService } from '../../common/abstract/generic-service';
import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { BookOneTypeEnum, ErrorMessage, SLUG_CATEGORY_ALL } from '../../constant';
import { BookDto } from './dto/book.dto';
import type { BookBestSellerPageOptions } from './dto/book-best-seller-page-options.dto';
import type { BookCreateDto } from './dto/book-create.dto';
import type { BookPageOptionsDto } from './dto/book-page-options.dto';
import type { BookUpdateDto } from './dto/book-update.dto';

@Injectable()
export class BookService implements IGenericService<BookDto> {
    private readonly name = BookService.name;

    private readonly logger = new Logger(this.name);

    constructor(private readonly data: IPgDataService) {}

    async create(formData: BookCreateDto): Promise<BookDto> {
        let model: BookModel;

        try {
            model = await this.data.book.createWithPrice(formData.toModel(), formData.price);
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return BookDto.fromModel(model);
    }

    async findById(id: string, type: BookOneTypeEnum = BookOneTypeEnum.ONE): Promise<BookDto> {
        const [book, price, saleModel, author] = await Promise.all([
            this.data.book.findById(id),
            this.data.book.findPriceBook(id),
            this.data.book.getSaleForBook(id),
            this.data.author.getAuthorByBookId(id),
        ]);

        switch (type) {
            case BookOneTypeEnum.LIST:
                return BookDto.fromModelsJoinPublisherCategory(book, price, saleModel, author);
            case BookOneTypeEnum.ONE:
                return BookDto.fromModelJoinPublisherCategory(book, price, saleModel, author);
            default:
                return BookDto.fromModelJoinPublisherCategory(book, price, saleModel, author);
        }
    }

    async findDetail(id: string): Promise<BookDto> {
        return this.findById(id);
    }

    async page(options: BookPageOptionsDto): Promise<PageResponseDto<BookDto>> {
        const { skip, take, ...params } = options;
        let filter = {
            category_id: params?.categoryId,
        };

        if (params?.categorySlug) {
            const category = await this.data.category.findOne({ slug: params.categorySlug });
            filter = {
                ...filter,
                category_id: category.slug !== SLUG_CATEGORY_ALL ? category.id : undefined,
            };
        }

        const [data, count] = await Promise.all([this.data.book.page(skip, take, filter), this.data.book.count(filter)]);
        const dataHandler = await Promise.all(data.map(async (model) => this.findById(model.isbn, BookOneTypeEnum.LIST)));

        if (count === 0) {
            throw new HttpException('Xin lỗi vì điều này, chúng tôi đang cập nhật sách cho danh mục này!', HttpStatus.NOT_FOUND);
        }

        return {
            data: dataHandler,
            count,
        };
    }

    async update(id: string | number, formData: BookUpdateDto): Promise<BookDto> {
        let model: BookModel;

        try {
            model = await this.data.book.updateWithPrice(id, formData.toModel(), formData?.price);
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return BookDto.fromModel(model);
    }

    async deleteById(id: string | number): Promise<void> {
        try {
            await this.data.book.deleteById(id);
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getBestSeller(options: BookBestSellerPageOptions): Promise<PageResponseDto<BookDto>> {
        const start = moment(options.start).utc().toDate();
        const end = moment(options.end).utc().toDate();
        const [listIsbn, count] = await Promise.all([
            this.data.book.getBookSellers(options.skip, options.take, start, end),
            this.data.book.countBookSellers(start, end),
        ]);
        const data = await Promise.all(listIsbn.map(async (bestSeller) => this.findById(bestSeller.isbn)));

        if (count === 0) {
            throw new HttpException('Không tìm thấy sản phẩm!', HttpStatus.NOT_FOUND);
        }

        return {
            data,
            count,
        };
    }

    async getHotBooks(): Promise<BookDto[]> {
        const bookIds = await this.data.book.getHotBooks();

        return Promise.all(bookIds.map(async (item) => this.findById(item.isbn, BookOneTypeEnum.LIST)));
    }
}
