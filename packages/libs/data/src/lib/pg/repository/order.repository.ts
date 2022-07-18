import { IGenericRepository } from '../../abstract/generic-repository';
import { PrismaService } from '../../provider/prisma.service';
import { OrderModel, OrderDetailModel, OrderDetailModelJoinBookAndOrder, OrderModelJoinEmployeeAndCustomer } from '../model/model';
import { first } from 'lodash';
import { OrderLower } from '../../constant/order';

export class OrderRepository extends IGenericRepository<OrderModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof OrderModel, any>> | undefined): Promise<number> {
        return this.prisma.order.count({
            where: filter,
        });
    }

    create(model: OrderModel): Promise<OrderModel> {
        return this.prisma.order.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<OrderModelJoinEmployeeAndCustomer> {
        return this.prisma.order.findUnique({
            where: { id: Number(id) },
            include: { customer: true, employee: true }
        });
    }

    async findOne(filter: Partial<Record<keyof OrderModel, any>>): Promise<OrderModel> {
        const models = await this.prisma.order.findMany({
            where: filter,
            take: 1,
        });

        return models.length ? first(models) : null;
    }

    async findUnique(filter: Partial<Record<keyof OrderModel, any>>): Promise<OrderModelJoinEmployeeAndCustomer> {
        const model = await this.prisma.order.findUnique({
            where: filter,
            include: { customer: true, employee: true }
        });

        return model;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof OrderModel, any>> | undefined,
        sort?: Partial<Record<keyof OrderModel, any>> | undefined,
    ): Promise<OrderModelJoinEmployeeAndCustomer[]> {
        return this.prisma.order.findMany({
            where: filter,
            orderBy: sort || { createdat: OrderLower.DESC },
            skip: page,
            take: limit,
            include: { customer: true, employee: true }
        });
    }

    update(id: string | number, model: OrderModel): Promise<OrderModel> {
        return this.prisma.order.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.order.delete({
            where: { id: Number(id) },
        });
    }

    async findItemsByTransachtionOrderId(transactionId: string): Promise<OrderDetailModelJoinBookAndOrder[]> {
        const order = await this.prisma.order.findUnique({
            where: { transaction_id: transactionId },
        });
        if (!order) {
            return [];
        }
        return this.prisma.orderDetail.findMany({
            where: { order_id: order.id },
            include: { book: true },
        });
    }

    pageOrderDetail(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof OrderDetailModel, any>> | undefined,
        sort?: Partial<Record<keyof OrderDetailModel, any>> | undefined,
    ): Promise<OrderDetailModelJoinBookAndOrder[]> {
        return this.prisma.orderDetail.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
            include: { book: true }
        });
    }

    countOrderDetail(filter?: Partial<Record<keyof OrderDetailModel, any>> | undefined): Promise<number> {
        return this.prisma.orderDetail.count({
            where: filter,
        });
    }

    getReportOrderByDate(start: Date, end: Date): Promise<Required<{
        label: string,
        value: number
    }[]>>  {
        return this.prisma.$queryRaw`select * from get_report_order(${start}, ${end})`
    }
}
