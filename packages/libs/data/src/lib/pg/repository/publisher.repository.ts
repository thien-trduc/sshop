import { IGenericRepository } from '../../abstract/generic-repository';
import { PrismaService } from '../../provider/prisma.service';
import { PublisherModel } from '../model/model';
import { first } from 'lodash';

export class PublisherRepository extends IGenericRepository<PublisherModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof PublisherModel, any>> | undefined): Promise<number> {
        return this.prisma.publisher.count({
            where: filter,
        });
    }

    create(model: PublisherModel): Promise<PublisherModel> {
        return this.prisma.publisher.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<PublisherModel> {
        return this.prisma.publisher.findUnique({
            where: { id: Number(id) },
        });
    }

    async findOne(filter: Partial<Record<keyof PublisherModel, any>>): Promise<PublisherModel> {
        const models = await this.prisma.publisher.findMany({
            where: filter,
            take: 1,
        });

        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof PublisherModel, any>> | undefined,
        sort?: Partial<Record<keyof PublisherModel, any>> | undefined,
    ): Promise<PublisherModel[]> {
        return this.prisma.publisher.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: PublisherModel): Promise<PublisherModel> {
        return this.prisma.publisher.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.publisher.delete({
            where: { id: Number(id) },
        });
    }
}
