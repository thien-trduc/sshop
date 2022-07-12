import { OrderRepository } from './../repository/order.repository';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BookRepository } from '../repository/book.repository';
import { CategoryRepository } from '../repository/category.repository';
import { PublisherRepository } from '../repository/publisher.repository';
import { DepartmentRepository } from '../repository/department.repository';
import { EmployeeRepository } from '../repository/employee.repository';
import { UserProfileRepository } from '../repository/user-profile.repository';
import { UserRepository } from '../repository/user.repository';
import { CustomerRepository } from '../repository/customer.repository';
import { PrismaService } from '../provider/prisma.service';
import { IPgDataService } from './pg-data-service';
import { CartRepository } from '../repository/cart.repository';
import { TransactionRepository } from "../repository/transaction.repository";
import { DiscountRepository } from '../repository/discount.repository';
import { RoleRepository } from '../repository/role.repository';
import { AuthorRepository } from '../repository/author.repository';
import { OtpRepository } from '../repository/otp.repository';
import { MailTemplateRepository } from '../repository/mail-template.repository';
import { EventRepository } from '../repository/event.repository';

@Injectable()
export class PgPrismaService implements IPgDataService, OnApplicationBootstrap {
  book: BookRepository;
  category: CategoryRepository;
  customer: CustomerRepository;
  department: DepartmentRepository;
  employee: EmployeeRepository;
  publisher: PublisherRepository;
  user: UserRepository;
  userProfile: UserProfileRepository;
  cart: CartRepository;
  transaction: TransactionRepository;
  discount: DiscountRepository;
  order: OrderRepository;
  role: RoleRepository;
  author: AuthorRepository
  otp: OtpRepository;
  mailTemplate: MailTemplateRepository;
  event: EventRepository;

  constructor(private readonly prisma: PrismaService) { }

  onApplicationBootstrap() {
    this.book = new BookRepository(this.prisma);
    this.category = new CategoryRepository(this.prisma);
    this.publisher = new PublisherRepository(this.prisma);
    this.department = new DepartmentRepository(this.prisma);
    this.employee = new EmployeeRepository(this.prisma);
    this.userProfile = new UserProfileRepository(this.prisma);
    this.user = new UserRepository(this.prisma);
    this.customer = new CustomerRepository(this.prisma);
    this.cart = new CartRepository(this.prisma);
    this.transaction = new TransactionRepository(this.prisma);
    this.discount = new DiscountRepository(this.prisma);
    this.order = new OrderRepository(this.prisma);
    this.role = new RoleRepository(this.prisma);
    this.author = new AuthorRepository(this.prisma);
    this.otp = new OtpRepository(this.prisma);
    this.mailTemplate = new MailTemplateRepository(this.prisma)
    this.event = new EventRepository(this.prisma);
  }
}
