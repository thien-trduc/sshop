import { IGenericRepository } from '../../abstract/generic-repository';
import { PrismaService } from '../../provider/prisma.service';
import { CategoryModel } from '../model/model';
import { first } from 'lodash';

export class CategoryRepository extends IGenericRepository<CategoryModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof CategoryModel, any>> | undefined): Promise<number> {
        return this.prisma.category.count({
            where: filter,
        });
    }

    create(model: CategoryModel): Promise<CategoryModel> {
        return this.prisma.category.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<CategoryModel> {
        return this.prisma.category.findUnique({
            where: { id: Number(id) },
        });
    }

    async findOne(filter: Partial<Record<keyof CategoryModel, any>>): Promise<CategoryModel> {
        const models = await this.prisma.category.findMany({
            where: filter,
            take: 1,
        });
        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof CategoryModel, any>> | undefined,
        sort?: Partial<Record<keyof CategoryModel, any>> | undefined,
    ): Promise<CategoryModel[]> {
        return this.prisma.category.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: CategoryModel): Promise<CategoryModel> {
        return this.prisma.category.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.category.delete({
            where: { id: Number(id) },
        });
    }
}
