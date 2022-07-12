import { CacheModule, Module } from '@nestjs/common';

import { ConfigsRedisService } from '../../shared/service/configs.redis.service';
import { SharedModule } from '../../shared/shared.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [SharedModule],
            inject: [ConfigsRedisService],
            useFactory: (config: ConfigsRedisService) => config.createRedisOptions,
        }),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule {}
