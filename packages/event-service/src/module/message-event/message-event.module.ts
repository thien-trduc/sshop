import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreService, PrismaService } from '@tproject/libs/core';
import { DataServiceModule } from '@tproject/libs/data';
import { SendgridMailModule } from '@tproject/libs/sendgrid';

import { ConfigsRabbitService } from '../../shared/service/configs.rabbit.service';
import { ConfigsSendgridService } from '../../shared/service/configs.sendgrid.sevice';
import { SharedModule } from '../../shared/shared.module';
import { CreateCartForCustomerHandler } from './command/handler/create-cart-for-customer.handler';
import { CreateMessageEventHandler } from './command/handler/create-message-event.handler';
import { MapProfileToCustomerHandler } from './command/handler/map-profile-to-customer.handler';
import { ProvideRoleForUserHandler } from './command/handler/provide-roles-for-user.handler';
import { SaveChacheHandler } from './command/handler/save-cache.handler';
import { ProcessFailedMessageHandler } from './event/handler/process-failed-message.handler';
import { ProcessMessageHandler } from './event/handler/process-message.handler';
import { ProcessSuccessMessageHandler } from './event/handler/process-success-message.event';
import { MessageEventController } from './message-event.controller';
import { MessageEventService } from './message-event.service';

export const command = [
    CreateMessageEventHandler,
    MapProfileToCustomerHandler,
    CreateCartForCustomerHandler,
    SaveChacheHandler,
    ProvideRoleForUserHandler,
];
export const event = [ProcessFailedMessageHandler, ProcessMessageHandler, ProcessSuccessMessageHandler];

@Module({
    imports: [
        DataServiceModule,
        CqrsModule,
        HttpModule,
        SendgridMailModule.registerAsync({
            useExisting: ConfigsSendgridService,
        }),
        // BullModule.registerQueue({
        //     name: QueueEnum.CACHE_SERVICE,
        // }),
        // FirebaseAdminModule.forRootAsync({
        //     imports: [SharedModule],
        //     inject: [ConfigFirebaseService],
        //     useFactory: (config: ConfigFirebaseService) => config.createServiceAccount(),
        // }),
        // CacheModule.registerAsync({
        //     imports: [SharedModule],
        //     inject: [ConfigsRedisService],
        //     useFactory: (config: ConfigsRedisService) => config.createRedisOptions,
        // }),
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            imports: [SharedModule],
            inject: [ConfigsRabbitService],
            useFactory: (config: ConfigsRabbitService) => config.getRabbitOption,
        }),
    ],
    providers: [...command, ...event, MessageEventService, PrismaService, EventStoreService],
    controllers: [MessageEventController],
})
export class MessageEventModule {}
