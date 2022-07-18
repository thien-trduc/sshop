import { IGenericRepository } from '../../abstract/generic-repository';
import { PrismaService } from '../../provider/prisma.service';
import { UserProfileModel } from '../model/model';
import { first } from 'lodash';

export class UserProfileRepository extends IGenericRepository<UserProfileModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof UserProfileModel, any>> | undefined): Promise<number> {
        return this.prisma.userProfile.count({
            where: filter,
        });
    }

    create(model: UserProfileModel): Promise<UserProfileModel> {
        return this.prisma.userProfile.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<UserProfileModel> {
        return this.prisma.userProfile.findUnique({
            where: { id: Number(id) },
        });
    }

    async findOne(filter: Partial<Record<keyof UserProfileModel, any>>): Promise<UserProfileModel> {
        const models = await this.prisma.userProfile.findMany({
            where: filter,
            take: 1,
        });

        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof UserProfileModel, any>> | undefined,
        sort?: Partial<Record<keyof UserProfileModel, any>> | undefined,
    ): Promise<UserProfileModel[]> {
        return this.prisma.userProfile.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: UserProfileModel): Promise<UserProfileModel> {
        return this.prisma.userProfile.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.userProfile.delete({
            where: { id: Number(id) },
        });
    }
}
