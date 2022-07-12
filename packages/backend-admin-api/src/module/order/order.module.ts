import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CacheModule, Module } from '@nestjs/common';

import { CustomerProvider } from '../../provider/customer.provider';
import { ConfigsRabbitService } from '../../shared/service/configs.rabbit.service';
import { ConfigsRedisService } from '../../shared/service/configs.redis.service';
import { SharedModule } from '../../shared/shared.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            imports: [SharedModule],
            inject: [ConfigsRabbitService],
            useFactory: (config: ConfigsRabbitService) => config.getRabbitOption,
        }),
        CacheModule.registerAsync({
            imports: [SharedModule],
            inject: [ConfigsRedisService],
            useFactory: (config: ConfigsRedisService) => config.createRedisOptions,
        }),
    ],
    controllers: [OrderController],
    providers: [OrderService, CustomerProvider],
})
export class OrderModule {}
