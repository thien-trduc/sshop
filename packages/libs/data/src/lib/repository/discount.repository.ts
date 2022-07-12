import { DiscountDetailModel } from './../model/model';
import { IGenericRepository } from '../abstract/generic-repository';
import { PrismaService } from '../provider/prisma.service';
import { DiscountModel } from '../model/model';
import { first } from "lodash";

export class DiscountRepository extends IGenericRepository<DiscountModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof DiscountModel, any>> | undefined): Promise<number> {
        return this.prisma.discount.count({
            where: filter,
        });
    }

    create(model: DiscountModel): Promise<DiscountModel> {
        return this.prisma.discount.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<DiscountModel> {
        return this.prisma.discount.findUnique({
            where: { id: Number(id) },
        });
    }

    async findOne(filter: Partial<Record<keyof DiscountModel, any>>): Promise<DiscountModel> {
        const models = await this.prisma.discount.findMany({
            where: filter,
            take: 1,
        });

        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof DiscountModel, any>> | undefined,
        sort?: Partial<Record<keyof DiscountModel, any>> | undefined,
    ): Promise<DiscountModel[]> {
        return this.prisma.discount.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: DiscountModel): Promise<DiscountModel> {
        return this.prisma.discount.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.discount.delete({
            where: { id: Number(id) },
        });
    }

    async createDiscountDetail(model: DiscountDetailModel): Promise<void> {
        await this.prisma.discountDetail.create({
            data: model
        });
    }

    async deleteDiscountDetail(discountId: number, bookId: string): Promise<void> {
        await this.prisma.discountDetail.delete({
            where: {
                discount_id_book_id: {
                    discount_id: discountId,
                    book_id: bookId,
                }
            }
        })
    }

}