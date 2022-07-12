import { CacheModule, Module } from '@nestjs/common';

import { ConfigsRedisService } from '../../shared/service/configs.redis.service';
import { SharedModule } from '../../shared/shared.module';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [SharedModule],
            inject: [ConfigsRedisService],
            useFactory: (config: ConfigsRedisService) => config.createRedisOptions,
        }),
    ],
    controllers: [DiscountController],
    providers: [DiscountService],
})
export class DiscountModule {}
