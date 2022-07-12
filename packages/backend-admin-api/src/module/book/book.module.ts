import { CacheModule, Module } from '@nestjs/common';

import { ConfigsRedisService } from '../../shared/service/configs.redis.service';
import { SharedModule } from '../../shared/shared.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [SharedModule],
            inject: [ConfigsRedisService],
            useFactory: (config: ConfigsRedisService) => config.createRedisOptions,
        }),
    ],
    controllers: [BookController],
    providers: [BookService],
})
export class BookModule {}
