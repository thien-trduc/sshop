import { IGenericRepository } from '../../abstract/generic-repository';
import { PrismaService } from '../../provider/prisma.service';
import { DepartmentModel } from '../model/model';
import {first} from "lodash";

export class DepartmentRepository extends IGenericRepository<DepartmentModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof DepartmentModel, any>> | undefined): Promise<number> {
        return this.prisma.department.count({
            where: filter,
        });
    }

    create(model: DepartmentModel): Promise<DepartmentModel> {
        return this.prisma.department.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<DepartmentModel> {
        return this.prisma.department.findUnique({
            where: { id: Number(id) },
        });
    }

    async findOne(filter: Partial<Record<keyof DepartmentModel, any>>): Promise<DepartmentModel> {
      const models = await this.prisma.department.findMany({
        where: filter,
        take: 1,
      });

      return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof DepartmentModel, any>> | undefined,
        sort?: Partial<Record<keyof DepartmentModel, any>> | undefined,
    ): Promise<DepartmentModel[]> {
        return this.prisma.department.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: DepartmentModel): Promise<DepartmentModel> {
        return this.prisma.department.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.department.delete({
            where: { id: Number(id) },
        });
    }
}
