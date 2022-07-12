import { IGenericRepository } from '../abstract/generic-repository';
import { PrismaService } from '../provider/prisma.service';
import { CartDetailModel, CartDetailModelJoinBookAndCart, CartModel } from '../model/model';
import { OrderLower } from '../constant/order';
import { first } from 'lodash';
import { optionsTransation } from '../constant/prisma';

const enum CartStatus {
    PENDING = 1,
    PAYMENT = 2,
}

export class CartRepository extends IGenericRepository<CartModel> {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this.prisma = prisma;
    }

    count(filter?: Partial<Record<keyof CartModel, any>> | undefined): Promise<number> {
        return this.prisma.cart.count({
            where: filter,
        });
    }

    create(model: CartModel): Promise<CartModel> {
        return this.prisma.cart.create({
            data: model,
        });
    }

    findById(id: string | number): Promise<CartModel> {
        return this.prisma.cart.findUnique({
            where: { id: `${id}` },
        });
    }

    async findOne(filter: Partial<Record<keyof CartModel, any>>): Promise<CartModel> {
        const models = await this.prisma.cart.findMany({
            where: filter,
            take: 1,
        });
        return models.length ? first(models) : null;
    }

    page(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof CartModel, any>> | undefined,
        sort?: Partial<Record<keyof CartModel, any>> | undefined,
    ): Promise<CartModel[]> {
        return this.prisma.cart.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
        });
    }

    update(id: string | number, model: CartModel): Promise<CartModel> {
        return this.prisma.cart.update({
            where: { id: `${id}` },
            data: model,
        });
    }

    async deleteById(id: string | number): Promise<void> {
        await this.prisma.cart.delete({
            where: { id: `${id}` },
        });
    }

    async existByCustomerAndPending(customerId: number): Promise<boolean> {
        const cart = await this.prisma.cart.findMany({
            where: { customer_id: customerId, status: CartStatus.PENDING },
            orderBy: { updatedat: OrderLower.DESC },
            take: 1,
        });
        return cart && cart.length > 0;
    }

    createItemForCart(model: CartDetailModel): Promise<CartDetailModel> {
        return this.prisma.cartDetail.create({
            data: model,
        });
    }

    pageCartItems(
        page: number,
        limit: number,
        filter?: Partial<Record<keyof CartDetailModel, any>> | undefined,
        sort?: Partial<Record<keyof CartDetailModel, any>> | undefined,
    ): Promise<CartDetailModelJoinBookAndCart[]> {
        return this.prisma.cartDetail.findMany({
            where: filter,
            orderBy: sort,
            skip: page,
            take: limit,
            include: { book: true },
        });
    }

    findCartItemsByCartId(cartId: string): Promise<CartDetailModel[]> {
        return this.prisma.cartDetail.findMany({
            where: {
                cart_id: cartId,
            },
        });
    }

    findCartItemsByCartIdAndSelected(cartId: string, selected: boolean): Promise<CartDetailModel[]> {
        return this.prisma.cartDetail.findMany({
            where: {
                cart_id: cartId,
                is_selected: selected,
            },
        });
    }

    async findCartItemByCartIdAndBookId(cartId: string, bookId: string): Promise<CartDetailModel> {
        const models = await this.prisma.cartDetail.findMany({
            where: {
                cart_id: cartId,
                book_id: bookId,
            },
            take: 1
        });
        return models.length ? first(models) : null;
    }

    updateCartItem(cartId: string, bookId: string, model: CartDetailModel): Promise<CartDetailModel> {
        return this.prisma.cartDetail.update({
            where: {
                cart_id_book_id: {
                    cart_id: cartId,
                    book_id: bookId,
                },
            },
            data: model,
        });
    }

    countCartItem(filter?: Partial<Record<keyof CartDetailModel, any>> | undefined): Promise<number> {
        return this.prisma.cartDetail.count({
            where: filter,
        });
    }

    async updateForPreparePayment(cartId: string, cart: CartModel, dataBook: Record<string, number>): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            await tx.cart.update({
                where: { id: cartId },
                data: cart,
            });
            for (const key of Object.keys(dataBook)) {
                await tx.book.update({
                    where: { isbn: key },
                    data: { quantity: BigInt(dataBook[key]) },
                });
            }
        }, optionsTransation);
    }

    async findItemsByCartIdAndCustomerId(cartId: string, customerId: number): Promise<CartDetailModelJoinBookAndCart[]> {
        const carts = await this.prisma.cart.findMany({
            where: { customer_id: customerId, id: cartId, status: CartStatus.PENDING },
            take: 1
        });
        if (!carts.length) {
            return [];
        }
        return this.prisma.cartDetail.findMany({
            where: { cart_id: first(carts).id },
            include: { book: true },
        });
    }

    deleteItemsInCart(cartId: string, bookIds: string[]): Promise<void> {
        return this.prisma.$transaction(async (tx) => {
            for(const isbn of bookIds) {
                await tx.cartDetail.delete({
                    where: {
                        cart_id_book_id: {
                            cart_id: cartId,
                            book_id: isbn,
                        }
                    }
                })
            }
        }, optionsTransation);
    }


}
