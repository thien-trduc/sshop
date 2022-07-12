import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@tproject/libs/core';
import * as Joi from 'joi';

// import { ConfigsBullService } from './service/configs.bull.service';
import { ConfigsOneSignalService } from './service/configs.one-signal.service';
import { ConfigsRabbitService } from './service/configs.rabbit.service';
// import { ConfigsRedisService } from './service/configs.redis.service';
import { ConfigsSendgridService } from './service/configs.sendgrid.sevice';
import { ConfigsService } from './service/configs.service';
import { objectValid } from './validate/env.validate';

@Global()
@Module({
    imports: [
        CoreModule,
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({ ...objectValid }),
            envFilePath: [process.env.NODE_ENV === 'production' ? '.env' : `config/.event-service.${process.env.NODE_ENV}.env`],
        }),
        // BullModule.registerQueue({
        //     name: QueueEnum.CACHE_SERVICE,
        // }),
    ],
    providers: [
        ConfigsService,
        ConfigsRabbitService,
        ConfigsSendgridService,
        // ConfigsRedisService,
        // ConfigsBullService,
        ConfigsOneSignalService,
        // ConfigFirebaseService,
    ],
    exports: [
        ConfigsService,
        ConfigsRabbitService,
        ConfigsSendgridService,
        // ConfigsRedisService,
        // ConfigsBullService,
        ConfigsOneSignalService,
        // ConfigFirebaseService,
    ],
})
export class SharedModule {}
