import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import { Inject, Logger } from '@nestjs/common';
import type { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs';
import type { message_events as MessageEvent } from '@prisma/client';
import { EventStoreService, PrismaService } from '@tproject/libs/core';
import { IPgDataService } from '@tproject/libs/data';
// import { FirebaseMessagingService } from '@tproject/libs/firebase-admin';
import { SENDGRID_CONNECTION } from '@tproject/libs/sendgrid';

import { ServiceError, Topic } from '../../../../constant';
import { MessageStatus } from '../../../../constant/enum/message-status.enum';
import { MessageTypeEnum } from '../../../../constant/enum/message-type.enum';
import { Exchange, RoutingKey } from '../../../../shared/service/configs.rabbit.service';
import { ProcessMessageEvent } from '../impl';
import { ConfigsSendgridService } from './../../../../shared/service/configs.sendgrid.sevice';

@EventsHandler(ProcessMessageEvent)
export class ProcessMessageHandler implements IEventHandler<ProcessMessageEvent> {
    private readonly name = ProcessMessageEvent.name;

    private readonly logger = new Logger(ProcessMessageHandler.name);

    constructor(
        @Inject(SENDGRID_CONNECTION) private readonly sendgrid,
        // private readonly fcm: FirebaseMessagingService,
        private readonly eventStore: EventStoreService,
        private readonly prisma: PrismaService,
        private readonly amqp: AmqpConnection,
        private readonly configSendrid: ConfigsSendgridService,
        private readonly data: IPgDataService,
    ) {}

    async handle(event: ProcessMessageEvent): Promise<any> {
        const { streamId, messageId, ...dataEvent } = event;

        try {
            await this.eventStore.save(streamId, this.name, dataEvent, 'MessageEvent');
        } catch (error: any) {
            this.logger.error('🚀 ~ file: process-message.handler.ts ~ line 40 ~ ProcessMessageHandler ~ handle ~ error', error?.message);

            return new Nack();
        }

        await this.publish(messageId);
    }

    async publish(messageId: number): Promise<any> {
        const message = await this.prisma.message_events.findUnique({
            where: { id: messageId },
        });

        try {
            switch (message.type) {
                case MessageTypeEnum.MAIL:
                    await this.sendMail(message);
                    break;
                case MessageTypeEnum.PUSH:
                    // await this.pushFCM();
                    this.logger.warn('Push Send');
                    break;
            }
        } catch (error) {
            this.logger.error('🚀 ~ file: process-message.handler.ts ~ line 64 ~ ProcessMessageHandler ~ publish ~ error', error?.message);

            void this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.EVENT_FAIL_CREATE, {
                streamId: message.streamid,
                status: MessageStatus.FAILED,
                message: error?.message || ServiceError.PUSH_EVENT,
                errorBody: { message: error?.message || ServiceError.PUSH_EVENT },
                messageId: message.id,
            });

            return new Nack();
        }

        void this.amqp.publish(Exchange.MESSAGE_EVENT, RoutingKey.EVENT_SUCCESS_CREATE, {
            streamId: message.streamid,
            status: MessageStatus.SUCCESS,
            message: 'Push event thành công!',
        });
    }

    async sendMail(message: MessageEvent): Promise<void> {
        const eventData: any = message.data;
        const from = this.configSendrid.getMailFrom;

        const templateId = await this.data.mailTemplate.findOne({
            topic: message.topicid,
        });

        await this.sendgrid.send({
            to: eventData?.to,
            from,
            templateId: `${templateId.id}`,
            dynamic_template_data: eventData?.dynamicData,
            isMultiple: false,
        });
    }

    // async pushFCM(): Promise<void> {
    //     await this.fcm.messaging.send({
    //         token: 'cRPn2juu5UHzEBZs36d-h_:APA91bHV52y12XWwFgDyTbhvOnXJ3CXp3kmtAODvJpvDM2MrAqpp8sgnlHEHhIM2dAZRt6h9Ejwv-rcYMMWinpU6pmEv0iZOdtXpEDNoebBNolY5bB1-r8vi3WLX2hQ4F3bqr_VFmsfE',
    //         notification: {
    //             title: 'io',
    //             body: 'asdhaishdio',
    //         },
    //         webpush: {
    //             fcmOptions: { link: 'http://localhost:4200' },
    //         },
    //         data: {
    //             test: 'qwjdopwqjodpjpo',
    //         },
    //     });
    // }
}
