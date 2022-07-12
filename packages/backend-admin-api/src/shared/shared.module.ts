import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from '@tproject/libs/core';
import * as Joi from 'joi';

import { ConfigGaService } from './service/config.ga.service';
import { ConfigFirebaseService } from './service/configs.firebase.service';
import { ConfigsJwtService } from './service/configs.jwt.service';
import { ConfigsRabbitService } from './service/configs.rabbit.service';
import { ConfigsRedisService } from './service/configs.redis.service';
import { ConfigsService } from './service/configs.service';
import { ConfigStorageService } from './service/configs.storage.service';
import { objectValid } from './validate/env.validate';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({ ...objectValid }),
            envFilePath: [process.env.NODE_ENV === 'production' ? '.env' : `config/.backend-admin-api.${process.env.NODE_ENV}.env`],
        }),
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
    providers: [
        ConfigsService,
        ConfigFirebaseService,
        ConfigsJwtService,
        ConfigsRabbitService,
        ConfigStorageService,
        ConfigsRedisService,
        CacheService,
        ConfigGaService,
    ],
    exports: [
        ConfigsService,
        ConfigFirebaseService,
        ConfigsJwtService,
        ConfigsRabbitService,
        ConfigStorageService,
        ConfigsRedisService,
        CacheService,
        ConfigGaService,
    ],
})
export class SharedModule {}
