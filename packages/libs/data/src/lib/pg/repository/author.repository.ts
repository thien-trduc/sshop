import { first } from 'lodash';
import { optionsTransation } from '../../constant/prisma';
import { IGenericRepository } from '../../abstract/generic-repository';
import { AuthorModel } from '../model/model';
import { PrismaService } from '../../provider/prisma.service';

export class AuthorRepository extends IGenericRepository<AuthorModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof AuthorModel, any>> | undefined): Promise<number> {
        return this.prisma.author.count({
            where: filter,
        });
    }

    create(model: AuthorModel): Promise<AuthorModel> {
        return this.prisma.author.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<AuthorModel> {
        return this.prisma.author.findUnique({
            where: { id: Number(id) },
        });
    }

    async findOne(filter: Partial<Record<keyof AuthorModel, any>>): Promise<AuthorModel> {
      const models = await this.prisma.author.findMany({
        where: filter,
        take: 1,
      });

      return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof AuthorModel, any>> | undefined,
        sort?: Partial<Record<keyof AuthorModel, any>> | undefined,
    ): Promise<AuthorModel[]> {
        return this.prisma.author.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: AuthorModel): Promise<AuthorModel> {
        return this.prisma.author.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.author.delete({
            where: { id: Number(id) },
        });
    }

    async addBooksToAuthor(authorId: number, bookIds: string[]): Promise<void> {
        return this.prisma.$transaction(async (tx) => {
            for(const isbn of bookIds) {
                await tx.detailCompose.create({
                    data: {
                        author_id: authorId,
                        book_id: isbn,
                    }
                })
            }
        }, optionsTransation);
    }


    async getAuthorByBookId(isbn: string): Promise<AuthorModel> {
        const detail = await this.prisma.detailCompose.findFirst({
            where: {
                book_id: isbn,
            },
            include: { author: true },
        })

        return detail?.author;
    }
}