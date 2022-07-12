import { CacheModule, Module } from '@nestjs/common';

import { ConfigsRedisService } from '../../shared/service/configs.redis.service';
import { SharedModule } from '../../shared/shared.module';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [SharedModule],
            inject: [ConfigsRedisService],
            useFactory: (config: ConfigsRedisService) => config.createRedisOptions,
        }),
    ],
    providers: [PublisherService],
    controllers: [PublisherController],
})
export class PublisherModule {}
