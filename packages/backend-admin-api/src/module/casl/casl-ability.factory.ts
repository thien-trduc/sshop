import type { AbilityClass } from '@casl/ability';
import { AbilityBuilder } from '@casl/ability';
import type { Subjects } from '@casl/prisma';
import { PrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import type {
    Author,
    Book,
    BookPrice,
    BookReceipt,
    BookReceiptDetail,
    BookRepay,
    BookRepayDetail,
    cache_keys,
    Cart,
    CartDetail,
    Category,
    Customer,
    CustomerAddress,
    Department,
    DetailCompose,
    Discount,
    DiscountDetail,
    Employee,
    event,
    MailTemplate,
    message_events,
    Order,
    OrderDetail,
    OtpNumber,
    Publisher,
    Receipt,
    Role,
    RoleUser,
    snapshot,
    stream,
    TokenVerifyOtp,
    User,
    UserProfile,
} from '@prisma/client';
import type { UserPolicies } from '@tproject/libs/data';

import { Action } from '../../constant/enum/action.enum';
import { RoleEnum } from '../../constant/enum/role.enum';

export type TypeAppAbility = PrismaAbility<
    [
        string,
        (
            | Subjects<{
                  Book: Book;
                  Category: Category;
                  Publisher: Publisher;
                  Department: Department;
                  Employee: Employee;
                  User: User;
                  UserProfile: UserProfile;
                  Customer: Customer;
                  BookPrice: BookPrice;
                  Cart: Cart;
                  CartDetail: CartDetail;
                  Receipt: Receipt;
                  Discount: Discount;
                  DiscountDetail: DiscountDetail;
                  Order: Order;
                  OrderDetail: OrderDetail;
                  Role: Role;
                  RoleUser: RoleUser;
                  cache_keys: cache_keys;
                  Author: Author;
                  DetailCompose: DetailCompose;
                  BookReceipt: BookReceipt;
                  BookReceiptDetail: BookReceiptDetail;
                  BookRepay: BookRepay;
                  BookRepayDetail: BookRepayDetail;
                  event: event;
                  snapshot: snapshot;
                  stream: stream;
                  message_events: message_events;
                  CustomerAddress: CustomerAddress;
                  OtpNumber: OtpNumber;
                  TokenVerifyOtp: TokenVerifyOtp;
                  MailTemplate: MailTemplate;
              }>
            | 'all'
        ),
    ]
>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: UserPolicies) {
        const appAbility = PrismaAbility as AbilityClass<TypeAppAbility>;

        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { can, cannot, build } = new AbilityBuilder(appAbility);

        const roles = new Set(user.roles);

        if (roles.has(RoleEnum.ADMIN)) {
            can(Action.Manage, 'all');
        } else if (roles.has(RoleEnum.EMPLOYEE)) {
            can(Action.Read, 'Employee');
            can(Action.Create, 'Employee');
            can(Action.Update, 'Employee');
            cannot(Action.Delete, 'Employee');

            can(Action.Read, 'Department');
            cannot(Action.Create, 'Department');
            cannot(Action.Update, 'Department');
            cannot(Action.Delete, 'Department');

            can(Action.Read, 'Customer');
            can(Action.Create, 'Customer');
            can(Action.Update, 'Customer');
            cannot(Action.Delete, 'Customer');

            can(Action.Manage, 'Book');

            can(Action.Read, 'Cart');
            can(Action.Create, 'Cart');
            can(Action.Update, 'Cart');
            cannot(Action.Delete, 'Cart');

            can(Action.Read, 'Order');
            can(Action.Create, 'Order');
            can(Action.Update, 'Order');
            cannot(Action.Delete, 'Order');

            cannot(Action.Manage, 'Role');
        } else if (roles.has(RoleEnum.USER)) {
            can(Action.Read, 'Book');
            cannot(Action.Create, 'Book');
            cannot(Action.Update, 'Book');
            cannot(Action.Delete, 'Book');

            can(Action.Read, 'Department');
            cannot(Action.Create, 'Department');
            cannot(Action.Update, 'Department');
            cannot(Action.Delete, 'Department');

            can(Action.Read, 'Cart', { customer_id: user.customer_id });
            can(Action.Update, 'Cart', { customer_id: user.customer_id });
            cannot(Action.Create, 'Cart');
            cannot(Action.Delete, 'Cart');

            can(Action.Manage, 'CartDetail');

            can(Action.Read, 'Order', { customer_id: user.customer_id });

            can(Action.Read, 'Customer', { id: user.customer_id });
            can(Action.Create, 'Customer', { id: user.customer_id });
            can(Action.Update, 'Customer', { id: user.customer_id });

            cannot(Action.Manage, 'Role');
            cannot(Action.Manage, 'Department');
            cannot(Action.Manage, 'Employee');
        }

        return build({
            // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
            // detectSubjectType: (item) => item.constructor,
        });
    }
}
