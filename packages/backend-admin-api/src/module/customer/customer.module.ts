import { CacheModule, Module } from '@nestjs/common';

import { CustomerProvider } from '../../provider/customer.provider';
import { ConfigsRedisService } from '../../shared/service/configs.redis.service';
import { SharedModule } from '../../shared/shared.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './service/customer.service';
import { CustomerAddressService } from './service/customer-address.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [SharedModule],
            inject: [ConfigsRedisService],
            useFactory: (config: ConfigsRedisService) => config.createRedisOptions,
        }),
    ],
    providers: [CustomerService, CustomerProvider, CustomerAddressService],
    controllers: [CustomerController],
})
export class CustomerModule {}
