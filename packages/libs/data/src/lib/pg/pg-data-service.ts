import { DiscountRepository } from './../repository/discount.repository';
import { BookRepository } from '../repository/book.repository';
import { CategoryRepository } from '../repository/category.repository';
import { PublisherRepository } from '../repository/publisher.repository';
import { DepartmentRepository } from '../repository/department.repository';
import { EmployeeRepository } from '../repository/employee.repository';
import { UserRepository } from '../repository/user.repository';
import { UserProfileRepository } from '../repository/user-profile.repository';
import { CustomerRepository } from '../repository/customer.repository';
import { CartRepository } from '../repository/cart.repository';
import { TransactionRepository } from '../repository/transaction.repository';
import { OrderRepository } from '../repository/order.repository';
import { RoleRepository } from '../repository/role.repository';
import { AuthorRepository } from '../repository/author.repository';
import { OtpRepository } from '../repository/otp.repository';
import { MailTemplateRepository } from '../repository/mail-template.repository';
import { EventRepository } from '../repository/event.repository';

export abstract class IPgDataService {
    abstract transaction: TransactionRepository;
    abstract book: BookRepository;
    abstract category: CategoryRepository;
    abstract publisher: PublisherRepository;
    abstract department: DepartmentRepository;
    abstract employee: EmployeeRepository;
    abstract user: UserRepository;
    abstract userProfile: UserProfileRepository;
    abstract customer: CustomerRepository;
    abstract cart: CartRepository;
    abstract discount: DiscountRepository;
    abstract order: OrderRepository;
    abstract role: RoleRepository;
    abstract author: AuthorRepository;
    abstract otp: OtpRepository;
    abstract mailTemplate: MailTemplateRepository;
    abstract event: EventRepository;
}
