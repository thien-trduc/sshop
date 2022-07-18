import { PrismaService } from '../../provider/prisma.service';
import { CartModel, ReceiptModel } from '../model/model';
import { CartDetailModel, OrderDetailModel, OrderModel, OrderModelJoinEmployeeAndCustomer } from '../model/model';
import { optionsTransation } from '../../constant/prisma';
import { OrderStatus } from '../../constant/enum/order-status.enum';

export class TransactionRepository {
    private readonly prisma: PrismaService;

    constructor(prisma: PrismaService) {
        this.prisma = prisma;
    }

    async paymentSuccess(
        cartModel: CartModel,
        booksQuantity: Record<string, number>,
        receiptModel: ReceiptModel,
        orderModel: OrderModel,
        cartItemsNotSelected: CartDetailModel[],
    ): Promise<void> {
        return this.prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: {
                    id: orderModel.id,
                },
                data: orderModel,
            });
            await tx.cart.update({
                where: { id: cartModel.id },
                data: cartModel,
            });
            await tx.receipt.create({
                data: receiptModel,
            });
            for (const key of Object.keys(booksQuantity)) {
                const book = await tx.book.findUnique({
                    where: { isbn: key }
                })
                await tx.book.update({
                    where: { isbn: key },
                    data: { quantity: book.quantity - BigInt(booksQuantity[key]) },
                });
            }

            const cartNew = await tx.cart.create({
                data: {
                    id: undefined,
                    createdat: undefined,
                    updatedat: undefined,
                    date: undefined,
                    receive_name: '',
                    address: '',
                    receive_phone: '',
                    employee_id: undefined,
                    customer_id: cartModel.customer_id,
                }
            });

            if (cartItemsNotSelected.length > 0) {
                for (const cartItem of cartItemsNotSelected) {
                    await tx.cartDetail.create({
                        data: {
                            ...cartItem,
                            cart_id: cartNew.id,
                            is_selected: false,
                        }
                    })
                }
            }
        }, optionsTransation);
    }

    async createOrderForCustomer(order: OrderModel, orderDetails: OrderDetailModel[], cart: CartModel, bookIds: string[]): Promise<OrderModelJoinEmployeeAndCustomer> {
        return this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: order
            });
            await Promise.all(orderDetails.map(detail => tx.orderDetail.create({
                data: { ...detail, order_id: newOrder.id }
            })));
            await tx.cart.update({
                where: { id: cart.id },
                data: cart,
            })
            await Promise.all(bookIds.map(isbn => tx.cartDetail.update({
                where: {
                    cart_id_book_id: {
                        cart_id: cart.id,
                        book_id: isbn,
                    }
                },
                data: { is_selected: true },
            })));
            const orderUpdate = await tx.order.update({
                where: {
                    id: newOrder.id,
                },
                data: {
                    ...newOrder,
                    status: OrderStatus.NOT_PAYMENT,
                }
            })
            return orderUpdate;
        }, optionsTransation)
    }
}
