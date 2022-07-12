import { IGenericRepository } from '../abstract/generic-repository';
import { PrismaService } from '../provider/prisma.service';
import { UserModel, UserProfileModel } from '../model/model';
import { first } from 'lodash';
import { optionsTransation } from '../constant/prisma';

export class UserRepository extends IGenericRepository<UserModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof UserModel, any>> | undefined): Promise<number> {
        return this.prisma.user.count({
            where: filter,
        });
    }

    create(model: UserModel): Promise<UserModel> {
        return this.prisma.user.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<UserModel> {
        return this.prisma.user.findUnique({
            where: { id: Number(id) },
        });
    }

    async findOne(filter: Partial<Record<keyof UserModel, any>>): Promise<UserModel> {
        const models = await this.prisma.user.findMany({
            where: filter,
            take: 1,
        });

        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof UserModel, any>> | undefined,
        sort?: Partial<Record<keyof UserModel, any>> | undefined,
    ): Promise<UserModel[]> {
        return this.prisma.user.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: UserModel): Promise<UserModel> {
        return this.prisma.user.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.user.delete({
            where: { id: Number(id) },
        });
    }

    async createWithProfile(userModel: UserModel, userProfileModel: UserProfileModel): Promise<UserModel> {
        const userNew = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: userModel,
            });
            await tx.userProfile.create({
                data: {
                    ...userProfileModel,
                    email: userModel.username,
                    userId: user.id,
                },
            });
            return user;
        }, optionsTransation);
        return this.prisma.user.findUnique({
            where: { id: userNew.id },
            include: { profile: true },
        });
    }

    async findOneInnerJoinProfile(filter: Partial<Record<keyof UserModel, any>>): Promise<UserModel & { profile: UserProfileModel }> {
        const models = await this.prisma.user.findMany({
            where: filter,
            take: 1,
            include: { profile: true },
        });

        return models.length ? first(models) : null;
    }
}
