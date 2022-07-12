import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

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
            envFilePath: [process.env.NODE_ENV === 'production' ? '.env' : `config/.payment.${process.env.NODE_ENV}.env`],
        }),
    ],
    providers: [ConfigsService],
    exports: [ConfigsService],
})
export class SharedModule {}
