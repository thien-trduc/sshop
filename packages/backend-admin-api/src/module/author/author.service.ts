import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import type { AuthorModel } from '@tproject/libs/data';
import { IPgDataService } from '@tproject/libs/data';
import { first, groupBy } from 'lodash';

import type { BaseReponse } from '../../common/dto/base-respone.dto';
import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { ErrorMessage } from '../../constant';
import { AuthorDto } from './dto/author.dto';
import type { AuthorBookCreateDto } from './dto/author-book-create.dto';
import type { AuthorCreateDto } from './dto/author-create.dto';
import type { AuthorPageOptionsDto } from './dto/author-page-options.dto';
import type { AuthorUpdateDto } from './dto/author-update.dto';

@Injectable()
export class AuthorService {
    private readonly logger = new Logger(AuthorService.name);

    constructor(private readonly data: IPgDataService) {}

    async create(formData: AuthorCreateDto): Promise<AuthorDto> {
        let model: AuthorModel;

        try {
            model = await this.data.author.create(formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return AuthorDto.fromModel(model);
    }

    async findById(id: string): Promise<AuthorDto> {
        return AuthorDto.fromModel(await this.data.author.findById(id));
    }

    async page(options: AuthorPageOptionsDto): Promise<PageResponseDto<AuthorDto>> {
        const [data, count] = await Promise.all([this.data.author.page(options.skip, options.take), this.data.author.count()]);

        return {
            data: data.map((model) => AuthorDto.fromModel(model)),
            count,
        };
    }

    async update(id: string | number, formData: AuthorUpdateDto): Promise<AuthorDto> {
        let model: AuthorModel;

        try {
            model = await this.data.author.update(id, formData.toModel());
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return AuthorDto.fromModel(model);
    }

    async deleteById(id: string | number): Promise<void> {
        try {
            await this.data.category.deleteById(Number(id));
        } catch (error) {
            this.logger.log(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addBookToAuthor(formData: AuthorBookCreateDto): Promise<BaseReponse<any>> {
        const author = await this.data.author.findById(formData.authorId);

        if (!author) {
            throw new HttpException(`Không tìm thấy tác giả với id: ${formData.authorId}`, HttpStatus.NOT_FOUND);
        }

        const books = await this.data.book.findByIds(formData.bookIds);
        const groupBooks = groupBy(books, 'isbn');

        for (const bookId of formData.bookIds) {
            const book = first(groupBooks[bookId]);

            if (!book) {
                throw new HttpException(`Không tìm thấy sách với mã: ${bookId}`, HttpStatus.NOT_FOUND);
            }
        }

        try {
            await this.data.author.addBooksToAuthor(formData.authorId, formData.bookIds);
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(error?.message || ErrorMessage.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'Thêm sách vào tác giả thành công!',
        };
    }
}
