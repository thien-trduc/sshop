import { IGenericRepository } from '../abstract/generic-repository';
import { PrismaService } from '../provider/prisma.service';
import { EventModel } from '../model/model';
import { first } from 'lodash';

export class EventRepository extends IGenericRepository<EventModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof EventModel, any>> | undefined): Promise<number> {
        return this.prisma.event.count({
            where: filter,
        });
    }

    create(model: EventModel): Promise<EventModel> {
        return this.prisma.event.create({
            data: model,
        });
    }

    findById(sequenceNumber: number): Promise<EventModel> {
        return this.prisma.event.findUnique({
            where: { sequencenum: sequenceNumber },
        });
    }

    async findOne(filter: Partial<Record<keyof EventModel, any>>): Promise<EventModel> {
        const models = await this.prisma.event.findMany({
            where: filter,
            take: 1,
            orderBy: { version: 'desc' }
        });

        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof EventModel, any>> | undefined,
        sort?: Partial<Record<keyof EventModel, any>> | undefined,
    ): Promise<EventModel[]> {
        return this.prisma.event.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(sequenceNumber: number, model: EventModel): Promise<EventModel> {
        return this.prisma.event.update({
            where: { sequencenum: sequenceNumber },
            data: model,
        });
    }

    async deleteById(sequenceNumber: number): Promise<void> {
        await this.prisma.event.delete({
            where: { sequencenum: sequenceNumber },
        });
    }
}
