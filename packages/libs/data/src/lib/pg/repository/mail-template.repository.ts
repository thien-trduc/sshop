import { IGenericRepository } from '../../abstract/generic-repository';
import { PrismaService } from '../../provider/prisma.service';
import { MailTemplateModel } from '../model/model';
import { first } from 'lodash';

export class MailTemplateRepository extends IGenericRepository<MailTemplateModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof MailTemplateModel, any>> | undefined): Promise<number> {
        return this.prisma.mailTemplate.count({
            where: filter,
        });
    }

    create(model: MailTemplateModel): Promise<MailTemplateModel> {
        return this.prisma.mailTemplate.create({
            data: model,
        });
    }

    findById(id: string): Promise<MailTemplateModel> {
        return this.prisma.mailTemplate.findUnique({
            where: { id },
        });
    }

    async findOne(filter: Partial<Record<keyof MailTemplateModel, any>>): Promise<MailTemplateModel> {
        const models = await this.prisma.mailTemplate.findMany({
            where: filter,
            take: 1,
        });

        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof MailTemplateModel, any>> | undefined,
        sort?: Partial<Record<keyof MailTemplateModel, any>> | undefined,
    ): Promise<MailTemplateModel[]> {
        return this.prisma.mailTemplate.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string, model: MailTemplateModel): Promise<MailTemplateModel> {
        return this.prisma.mailTemplate.update({
            where: { id },
            data: model,
        });
    }

    async deleteById(id: string): Promise<void> {
        await this.prisma.mailTemplate.delete({
            where: { id },
        });
    }
}
