import { first } from 'lodash';
import { RoleForUserModel, RoleModel } from '../..';
import { IGenericRepository } from '../abstract/generic-repository';
import { optionsTransation } from '../constant/prisma';
import { PrismaService } from '../provider/prisma.service';

export class RoleRepository extends IGenericRepository<RoleModel>{
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof RoleModel, any>> | undefined): Promise<number> {
        return this.prisma.role.count({
            where: filter,
        });
    }

    create(model: RoleModel): Promise<RoleModel> {
        return this.prisma.role.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<RoleModel> {
        return this.prisma.role.findUnique({
            where: { id: Number(id) },
        });
    }

    async findOne(filter: Partial<Record<keyof RoleModel, any>>): Promise<RoleModel> {
        const models = await this.prisma.role.findMany({
            where: filter,
            take: 1,
        });

        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof RoleModel, any>> | undefined,
        sort?: Partial<Record<keyof RoleModel, any>> | undefined,
    ): Promise<RoleModel[]> {
        return this.prisma.role.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: RoleModel): Promise<RoleModel> {
        return this.prisma.role.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.role.delete({
            where: { id: Number(id) },
        });
    }

    async provideRolesForUser(roleIds: number[], userId: number): Promise<void> {
        return this.prisma.$transaction(async (tx) => {
            await tx.roleUser.deleteMany({
                where: {
                    user_id: userId,
                }
            })
            for (const roleId of roleIds) {
                await tx.roleUser.create({
                    data: {
                        role_id: roleId,
                        user_id: userId
                    }
                })
            }
        }, optionsTransation)
        
    }

    async getAllRoleByUser(userId: number): Promise<string[]> {
        const roleUsers = await this.prisma.roleUser.findMany({
            where: {
                user_id: userId
            },
            include: {
                role: true,
            }
        });
        
        return !roleUsers ? [] : roleUsers.map(roleUser =>  roleUser.role.name);
    }
    
    findByIds(ids: number[]): Promise<RoleModel[]> {
        return this.prisma.role.findMany({
            where: {
                id: { in: ids }
            }
        })
    }
}