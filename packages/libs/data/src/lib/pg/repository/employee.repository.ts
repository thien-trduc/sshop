import { IGenericRepository } from '../../abstract/generic-repository';
import { PrismaService } from '../../provider/prisma.service';
import { EmployeeModel } from '../model/model';
import { first } from 'lodash';

export class EmployeeRepository extends IGenericRepository<EmployeeModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof EmployeeModel, any>> | undefined): Promise<number> {
        return this.prisma.employee.count({
            where: filter,
        });
    }

    create(model: EmployeeModel): Promise<EmployeeModel> {
        return this.prisma.employee.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<EmployeeModel> {
        return this.prisma.employee.findUnique({
            where: { id: Number(id) },
        });
    }

    async findOne(filter: Partial<Record<keyof EmployeeModel, any>>): Promise<EmployeeModel> {
        const models = await this.prisma.employee.findMany({
            where: filter,
            take: 1,
        });

        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof EmployeeModel, any>> | undefined,
        sort?: Partial<Record<keyof EmployeeModel, any>> | undefined,
    ): Promise<EmployeeModel[]> {
        return this.prisma.employee.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: EmployeeModel): Promise<EmployeeModel> {
        return this.prisma.employee.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.employee.delete({
            where: { id: Number(id) },
        });
    }

    async getToAssign(): Promise<number> {
        const data: any[] = await this.prisma.$queryRaw`select * from get_employee_handle_customer_order()`;
        if (!data || data.length <= 0) {
            return -1;
        }
        return first(data)?.id;
    }
}
