import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import type { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs';
import { EventStoreService, PrismaService } from '@tproject/libs/core';
import { reduce } from 'lodash';

import { MessageTypeEnum } from '../../../../constant/enum/message-type.enum';
import { Exchange, RoutingKey } from '../../../../shared/service/configs.rabbit.service';
import { ProcessFailedMessageEvent } from '../impl';

@EventsHandler(ProcessFailedMessageEvent)
export class ProcessFailedMessageHandler implements IEventHandler<ProcessFailedMessageEvent> {
    private readonly name = ProcessFailedMessageEvent.name;

    private readonly logger = new Logger(this.name);

    constructor(
        private readonly eventStore: EventStoreService,
        private readonly amqp: AmqpConnection,
        // private readonly configRabbit: ConfigsRabbitService,
        private readonly prisma: PrismaService,
    ) {}

    async handle(event: ProcessFailedMessageEvent): Promise<any> {
        const { streamId, messageId, ...eventData } = event;

        try {
            await this.eventStore.save(streamId, this.name, eventData);
        } catch (error: any) {
            this.logger.error(
                '🚀 ~ file: process-failed-message.handler.ts ~ line 31 ~ ProcessFailedMessageHandler ~ handle ~ error',
                error?.message,
            );

            return new Nack();
        }

        // await this.handleMessageEventFail(messageId);
    }

    async handleMessageEventFail(messageId: number): Promise<any> {
        const message = await this.prisma.message_events.findUnique({
            where: {
                id: messageId,
            },
        });
        const stream = await this.prisma.stream.findUnique({
            where: {
                streamid: message.streamid,
            },
            include: { event: true },
        });
        const count = reduce(stream.event, (sum, event) => (event.type === this.name ? sum++ : sum), 0);

        if (count < 3) {
            void this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.EVENT_PUBLISH, {
                streamId: message.streamid,
                messageId: message.id,
                status: MessageTypeEnum.MAIL,
            });
        }
    }
}
