import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { CoreModule } from '@tproject/libs/core';
import { DataServiceModule } from '@tproject/libs/data';

import { AppController } from './app.controller';
import { contextMiddleware } from './middleware';
import { AuthorModule } from './module/author/author.module';
import { BookModule } from './module/book/book.module';
import { BookRepayModule } from './module/book-repay/book-repay.module';
import { CartModule } from './module/cart/cart.module';
import { CaslModule } from './module/casl/casl.module';
import { CategoryModule } from './module/category/category.module';
import { CustomerModule } from './module/customer/customer.module';
import { DepartmentModule } from './module/department/department.module';
import { DiscountModule } from './module/discount/discount.module';
import { EmployeeModule } from './module/employee/employee.module';
import { GaModule } from './module/ga/ga.module';
import { HealthModule } from './module/health/health.module';
import { MetricsModule } from './module/metrics/metrics.module';
import { OrderModule } from './module/order/order.module';
import { OtpModule } from './module/otp/otp.module';
import { PaymentModule } from './module/payment/payment.module';
import { PrometheusModule } from './module/prometheus/prometheus.module';
import { PublisherModule } from './module/publisher/publisher.module';
import { ReceiptModule } from './module/receipt/receipt.module';
import { RoleModule } from './module/role/role.module';
import { StorageModule } from './module/storage/storage.module';
import { UsersModule } from './module/users/users.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        DataServiceModule,
        CoreModule,
        SharedModule,
        UsersModule,
        BookModule,
        EmployeeModule,
        DepartmentModule,
        CustomerModule,
        CartModule,
        BookRepayModule,
        DiscountModule,
        OrderModule,
        AuthorModule,
        PublisherModule,
        CategoryModule,
        ReceiptModule,
        StorageModule,
        PaymentModule,
        RoleModule,
        CaslModule,
        GaModule,
        OtpModule,
        HealthModule,
        PrometheusModule,
        MetricsModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
