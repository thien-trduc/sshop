import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { ConfigsRabbitService } from './service/configs.rabbit.service';
import { ConfigsService } from './service/configs.service';
import { envValidateObj } from './validate/env.validate';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                ...envValidateObj,
            }),
            isGlobal: true,
            envFilePath: [process.env.NODE_ENV === 'production' ? '.env' : `config/.webhook.${process.env.NODE_ENV}.env`],
        }),
    ],
    providers: [ConfigsService, ConfigsRabbitService],
    exports: [ConfigsService, ConfigsRabbitService],
})
export class SharedModule {}
