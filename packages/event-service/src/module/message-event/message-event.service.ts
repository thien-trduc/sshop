import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreService, PrismaService } from '@tproject/libs/core';

import type { PageResponseDto } from '../../common/dto/page-response.dto';
import { Exchange, QueueRabbit, RoutingKey } from '../../shared/service/configs.rabbit.service';
import {
    CreateCartForCustomerCommand,
    CreateMessageEventCommand,
    MapProfileToCustomerCommand,
    ProvideRolesForUserCommand,
    SaveCacheCommand,
} from './command/impl';
import type { MessagePageOptionsDto } from './dto/message-page-options.dto';
import { ProcessFailedMessageEvent, ProcessMessageEvent, ProcessSuccessMessageEvent } from './event/impl';
import {
    ICreateCartForCustomer,
    IMapProfileToCustomer,
    IMessageCreateDto,
    IMessageEventProcessCreate,
    IMessageEventSuccess,
    IProviderRoleForUser,
} from './interface';
import { IMessageEventFailCreate } from './interface/message-event-fail-create.interface';
import { MessageEventModel } from './model/message-event.model';

@Injectable()
export class MessageEventService {
    constructor(
        private readonly command: CommandBus,
        private readonly event: EventBus,
        private readonly prisma: PrismaService,
        private readonly eventStore: EventStoreService,
    ) {}

    @RabbitSubscribe({
        exchange: Exchange.MESSAGE_EVENT,
        routingKey: RoutingKey.MAP_PROFILE_TO_CUSTOMER,
        queue: QueueRabbit.MAP_PROFILE_TO_CUSTOMER,
        queueOptions: {
            durable: false,
        },
    })
    mapProfileToCustomer(msg: IMapProfileToCustomer): Promise<void> {
        return this.command.execute(new MapProfileToCustomerCommand(msg.userId));
    }

    @RabbitSubscribe({
        exchange: Exchange.MESSAGE_EVENT,
        routingKey: RoutingKey.CREATE_CART_FOR_CUSTOMER,
        queue: QueueRabbit.CREATE_CART_FOR_CUSTOMER,
        queueOptions: {
            durable: false,
        },
    })
    createCartForCustomer(msg: ICreateCartForCustomer): Promise<void> {
        return this.command.execute(new CreateCartForCustomerCommand(msg.userId));
    }

    @RabbitSubscribe({
        exchange: Exchange.MESSAGE_EVENT,
        routingKey: RoutingKey.PROVIDER_ROLE_FOR_USER,
        queue: QueueRabbit.PROVIDER_ROLE_FOR_USER,
        queueOptions: {
            durable: false,
        },
    })
    provideRolesForUserCommmand(msg: IProviderRoleForUser): Promise<void> {
        return this.command.execute(new ProvideRolesForUserCommand(msg.userId));
    }

    @RabbitSubscribe({
        exchange: Exchange.MESSAGE_EVENT,
        routingKey: RoutingKey.EVENT_CREATE,
        queue: QueueRabbit.EVENT,
        queueOptions: {
            durable: false,
        },
    })
    createMessageEvent(msg: IMessageCreateDto): Promise<void> {
        return this.command.execute(new CreateMessageEventCommand(msg.type, msg.title, msg.topicId, msg.data));
    }

    @RabbitSubscribe({
        exchange: Exchange.MESSAGE_EVENT,
        routingKey: RoutingKey.EVENT_PUBLISH,
        queue: QueueRabbit.EVENT_PROCESS,
        queueOptions: {
            durable: false,
        },
    })
    publishMessageEvent(msg: IMessageEventProcessCreate): Promise<void> {
        return this.event.publish(new ProcessMessageEvent(msg.streamId, msg.messageId, msg.status));
    }

    @RabbitSubscribe({
        exchange: Exchange.MESSAGE_EVENT,
        routingKey: RoutingKey.EVENT_SUCCESS_CREATE,
        queue: QueueRabbit.EVENT_SUCCESS,
        queueOptions: {
            durable: false,
        },
    })
    createMessageEventSuccess(msg: IMessageEventSuccess): Promise<void> {
        return this.event.publish(new ProcessSuccessMessageEvent(msg.streamId, msg.status, msg.message));
    }

    @RabbitSubscribe({
        exchange: Exchange.MESSAGE_EVENT,
        routingKey: RoutingKey.EVENT_FAIL_CREATE,
        queue: QueueRabbit.EVENT_FAIL,
        queueOptions: {
            durable: false,
        },
    })
    createMessageEventFail(msg: IMessageEventFailCreate): Promise<void> {
        return this.event.publish(new ProcessFailedMessageEvent(msg.streamId, msg.messageId, msg.status, msg.message, msg.errorBody));
    }

    @RabbitSubscribe({
        exchange: Exchange.MESSAGE_EVENT,
        routingKey: RoutingKey.SAVE_CACHE,
        queue: QueueRabbit.SAVE_CACHE,
        queueOptions: {
            durable: false,
        },
    })
    saveCache(msg: any): Promise<void> {
        return this.command.execute(new SaveCacheCommand(msg.key, msg.data));
    }

    async page(options: MessagePageOptionsDto): Promise<PageResponseDto<MessageEventModel>> {
        // const cacheKey = `${MessageEventService.name}_page_${this.utilService.jsonToQueryString(options)}`;
        // const cacheData = await this.cacheService.get(cacheKey);
        // if (cacheData) return cacheData;
        const { page, take, order, q, ...filter } = options;
        const [data, count] = await Promise.all([
            this.prisma.message_events.findMany({
                where: { ...filter },
                skip: options.skip,
                take,
                orderBy: { createdat: order },
            }),
            this.prisma.message_events.count({ where: { ...filter } }),
        ]);
        const messageEvents = await Promise.all(data.map(async (message) => this.eventStore.load(new MessageEventModel(message))));

        // await this.cacheQueue.add(ProcessEnum.CREATE_CACHE, { key: cacheKey, value: result });
        return {
            data: messageEvents,
            count,
        };
    }

    async getById(id: number): Promise<MessageEventModel> {
        const message = await this.prisma.message_events.findUnique({
            where: { id: Number(id) },
        });

        return this.eventStore.load(new MessageEventModel(message));
    }

    // async publishByCount(count: number): Promise<void> {
    //     const data = {
    //         to: 'thien.d.tran@pkh.vn',
    //         from: 'tntran496@gmail.com',
    //         templateId: this.configSendgrid.getMailTemplateId,
    //         dynamic_template_data: { test: 1 },
    //         isMultiple: false,
    //     };
    //     let arr: number[] = [];
    //     for (let i = 0; i < count; i++) {
    //         arr = [...arr, i];
    //     }
    //     await Promise.all(
    //         arr.map((item) =>
    //             this.amqp.publish(Exchange.MESSAGE_EVENT, 'event_create', {
    //                 type: MessageTypeEnum.MAIL,
    //                 title: 'test',
    //                 topicId: 'test',
    //                 data,
    //             }),
    //         ),
    //     );
    // }
    //
    // async pushNotification(): Promise<void> {
    //     const data = {
    //         app_id: this.configOneSignal.getAppId,
    //         name: {
    //             en: 'tproject',
    //         },
    //         contents: {
    //             en: 'English Message',
    //         },
    //         headings: {
    //             en: 'English Title',
    //         },
    //         include_player_ids: [
    //             '6392d91a-b206-4b7b-a620-cd68e32c3a76',
    //             '76ece62b-bcfe-468c-8a78-839aeaa8c5fa',
    //             '8e0f21fa-9a5a-4ae7-a9a6-ca1f24294b86',
    //         ],
    //     };
    //     await this.amqp.publish(Exchange.MESSAGE_EVENT, 'event_create', {
    //         type: MessageTypeEnum.PUSH,
    //         title: 'test',
    //         topicId: 'test',
    //         data,
    //     });
    // }
}
