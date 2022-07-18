import { CustomerModel, CustomerAddressModel, CustomerModelJoinAddress } from '../model/model';
import { PrismaService } from '../../provider/prisma.service';
import { IGenericRepository } from '../../abstract/generic-repository';
import { first } from 'lodash';

export class CustomerRepository extends IGenericRepository<CustomerModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof CustomerModel, any>> | undefined): Promise<number> {
        return this.prisma.customer.count({
            where: filter,
        });
    }

    create(model: CustomerModel): Promise<CustomerModel> {
        return this.prisma.customer.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<CustomerModelJoinAddress> {
        return this.prisma.customer.findUnique({
            where: { id: Number(id) },
            include: {customer_address: true}
        });
    }

    async findOne(filter: Partial<Record<keyof CustomerModel, any>>): Promise<CustomerModelJoinAddress> {
        const models = await this.prisma.customer.findMany({
            where: filter,
            take: 1,
            include: { customer_address: true }
        });

        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof CustomerModel, any>> | undefined,
        sort?: Partial<Record<keyof CustomerModel, any>> | undefined,
    ): Promise<CustomerModel[]> {
        return this.prisma.customer.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: CustomerModel): Promise<CustomerModel> {
        return this.prisma.customer.update({
            where: { id: Number(id) },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.customer.delete({
            where: { id: Number(id) },
        });
    }

    countAddress(filter?: Partial<Record<keyof CustomerAddressModel, any>> | undefined): Promise<number> {
        return this.prisma.customerAddress.count({
            where: filter,
        });
    }

    pageAddress(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof CustomerAddressModel, any>> | undefined,
        sort?: Partial<Record<keyof CustomerAddressModel, any>> | undefined,
    ): Promise<CustomerAddressModel[]> {
        return this.prisma.customerAddress.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    findOneAdressById(id: number): Promise<CustomerAddressModel> {
        return this.prisma.customerAddress.findUnique({
            where: {
                id,
            },

        });
    }

    createAddress(data: CustomerAddressModel): Promise<CustomerAddressModel> {
        return this.prisma.$transaction(async (tx) => {
            const newCustomerAddress = await tx.customerAddress.create({
                data,
            });

            const address = await tx.customerAddress.findMany({
                where: { customer_id: data.customer_id }, 
            })

            if (address.length > 0) {
                tx.customer.update({
                    where: {
                        id: Number(data?.customer_id),
                    },
                    data: newCustomerAddress.address,
                })
            }

            return newCustomerAddress;
        });
    }

    updateAddress(id: number, data: CustomerAddressModel): Promise<CustomerAddressModel> {
        return this.prisma.customerAddress.update({
            where: { id },
            data,
        })
    }

    async deleteAddress(id: number): Promise<void> {
        await this.prisma.customerAddress.delete({
            where: { id },
        })
    }

    async getAddressByCustomer(customerId: number): Promise<CustomerAddressModel[]> {
        return this.prisma.customerAddress.findMany({
            where: { customer_id: customerId }, 
        });
    }
}
