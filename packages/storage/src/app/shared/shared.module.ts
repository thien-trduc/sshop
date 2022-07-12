import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { ConfigsService } from './service/configs.service';
import { objectValid } from './validate/env.validate';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({ ...objectValid }),
            envFilePath: [process.env.NODE_ENV === 'production' ? '.env' : `config/.storage.${process.env.NODE_ENV}.env`],
        }),
    ],
    providers: [ConfigsService],
    exports: [ConfigsService],
})
export class SharedModule {}
