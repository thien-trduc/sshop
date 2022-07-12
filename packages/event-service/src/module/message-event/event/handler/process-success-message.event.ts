import { Nack } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import type { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs';
import { EventStoreService } from '@tproject/libs/core';

import { ProcessSuccessMessageEvent } from '../impl';

@EventsHandler(ProcessSuccessMessageEvent)
export class ProcessSuccessMessageHandler implements IEventHandler<ProcessSuccessMessageEvent> {
    private readonly logger = new Logger(ProcessSuccessMessageHandler.name);

    private readonly name = ProcessSuccessMessageEvent.name;

    constructor(private readonly eventStore: EventStoreService) {}

    async handle(event: ProcessSuccessMessageEvent): Promise<any> {
        const { streamId, ...eventData } = event;

        try {
            await this.eventStore.save(streamId, this.name, eventData);
        } catch (error: any) {
            this.logger.error(
                '🚀 ~ file: process-success-message.event.ts ~ line 23 ~ ProcessSuccessMessageHandler ~ handle ~ error',
                error?.message,
            );

            return new Nack();
        }
    }
}
