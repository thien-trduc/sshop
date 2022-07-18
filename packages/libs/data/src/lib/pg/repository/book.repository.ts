import { IGenericRepository } from '../../abstract/generic-repository';
import { PrismaService } from '../../provider/prisma.service';
import { BookModelJoinPublisherCategory, BookModel, BookWithSaleModel, BookSellerModel } from '../model/model';
import { OrderLower } from '../../constant/order';
import { first } from 'lodash';
import { optionsTransation } from '../../constant/prisma';

export class BookRepository extends IGenericRepository<BookModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof BookModel, any>> | undefined): Promise<number> {
        return this.prisma.book.count({
            where: filter,
        });
    }

    create(model: BookModel): Promise<BookModelJoinPublisherCategory> {
        return this.prisma.book.create({
            data: model,
            include: { category: true, publisher: true },
        });
    }

    async createWithPrice(model: BookModel, price: number): Promise<BookModel> {
        return this.prisma.$transaction(async (tx) => {
            const book = await tx.book.create({
                data: model,
            });
            await tx.bookPrice.create({
                data: {
                    book_id: book.isbn,
                    price,
                    date: undefined,
                },
            });
            return book;
        }, optionsTransation );
    }

    async findById(id: string | number): Promise<BookModelJoinPublisherCategory> {
        return this.prisma.book.findUnique({
            where: { isbn: `${id}` },
            include: { category: true, publisher: true, booking_prices: true },
        });
    }

    async findOne(filter: Partial<Record<keyof BookModel, any>>): Promise<BookModel> {
        const models = await this.prisma.book.findMany({
            where: filter,
            take: 1,
        });
        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof BookModel, any>> | undefined,
        sort?: Partial<Record<keyof BookModel, any>> | undefined,
    ): Promise<BookModelJoinPublisherCategory[]> {
        return this.prisma.book.findMany({
            where: filter,
            orderBy: sort || { createdat: OrderLower.DESC },
            skip: page,
            take: limit,
            include: { category: true, publisher: true, booking_prices: true },
        });
    }

    update(id: string | number, model: BookModel): Promise<BookModel> {
        return this.prisma.book.update({
            where: { isbn: `${id}` },
            data: model,
        });
    }

    async updateWithPrice(id: string | number, model: BookModel, price?: number): Promise<BookModel> {
        return this.prisma.$transaction(async (tx) => {
            const bookUpdate = await tx.book.update({
                where: { isbn: `${id}` },
                data: model,
            });
            if (price) {
                await tx.bookPrice.create({
                    data: {
                        book_id: bookUpdate.isbn,
                        price,
                        date: undefined,
                    },
                });
            }
            return bookUpdate;
        }, optionsTransation);
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.book.delete({
            where: { isbn: `${id}` },
        });
    }

    async findPriceBook(id: string): Promise<number> {
        const prices = await this.prisma.bookPrice.findMany({
            where: { book_id: id },
            orderBy: { date: OrderLower.DESC },
        });
        return first(prices)?.price || 0;
    }

    async findByIds(ids: string[]): Promise<BookModelJoinPublisherCategory[]> {
        return this.prisma.book.findMany({
            where: {
                isbn: { in: ids },
            },
            include: { category: true, publisher: true, booking_prices: true },
        });
    }

    async updateQuantityByIds(dataBook: Record<string, number>): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            for (const key of Object.keys(dataBook)) {
                await tx.book.update({
                    where: { isbn: key },
                    data: { quantity: BigInt(dataBook[key]) },
                });
            }
        }, optionsTransation);
    }

    async getSaleForBook(isbn: string): Promise<BookWithSaleModel> {
        const data: BookWithSaleModel[] = await this.prisma.$queryRaw`select * from get_sale_book(${isbn})`
        return data ? first(data) : null;
    }

    async getBookSellers(
        page: number,
        limit: number,
        start: Date,
        end: Date,
    ): Promise<BookSellerModel[]> {
        return this.prisma.$queryRaw`select * from get_book_best_seller(${page}, ${limit}, ${start}, ${end}) `
    }

    async countBookSellers(
        start: Date,
        end: Date,
    ): Promise<number> {
        const result: Required<{ total: number}>[] = await this.prisma.$queryRaw`select count_book_best_seller(${start}, ${end}) as total`;
        return first(result).total;
    }

    async getHotBooks(): Promise<{isbn: string}[]> {
        return this.prisma.$queryRaw`select * from get_hot_books()`;
    }

}
