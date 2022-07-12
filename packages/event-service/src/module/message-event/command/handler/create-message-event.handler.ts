import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { message_events as MessageEvent } from '@prisma/client';
import { EventStoreService, PrismaService } from '@tproject/libs/core';

import { MessageTypeEnum } from '../../../../constant/enum/message-type.enum';
import { Exchange, RoutingKey } from '../../../../shared/service/configs.rabbit.service';
import { CreateMessageEventCommand } from '../impl';

@CommandHandler(CreateMessageEventCommand)
export class CreateMessageEventHandler implements ICommandHandler<CreateMessageEventCommand> {
    private readonly name = CreateMessageEventHandler.name;

    private readonly logger = new Logger(this.name);

    constructor(private readonly prisma: PrismaService, private readonly amqp: AmqpConnection) {}

    async execute(command: CreateMessageEventCommand): Promise<any> {
        let message: MessageEvent;
        const streamid = EventStoreService.genStreamId('MessageEvent');

        try {
            message = await this.prisma.message_events.create({
                data: {
                    ...command,
                    streamid,
                },
            });
        } catch (error) {
            this.logger.error(error?.message);

            return new Nack();
        }

        void this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.EVENT_PUBLISH, {
            streamId: streamid,
            messageId: message.id,
            status: MessageTypeEnum.MAIL,
        });
    }
}
