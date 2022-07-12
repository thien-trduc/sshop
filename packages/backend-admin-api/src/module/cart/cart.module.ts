import { Module } from '@nestjs/common';

import { CustomerProvider } from '../../provider/customer.provider';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
    providers: [CartService, CustomerProvider],
    controllers: [CartController],
})
export class CartModule {}
