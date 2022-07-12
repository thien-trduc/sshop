import type { message_events as MessageEvent } from '@prisma/client';
import { BaseModel } from '@tproject/libs/core';

import { ProcessFailedMessageEvent, ProcessMessageEvent, ProcessSuccessMessageEvent } from '../event/impl';

export class MessageEventModel extends BaseModel {
    private type: string;

    private status: number;

    private title: string;

    private topicId: string;

    private data: any;

    private message: string;

    private errorBody: string;

    constructor(entity: MessageEvent) {
        super(Number(entity.id), entity.createdat.toISOString(), entity.updatedat.toISOString(), entity.streamid);
        this.type = entity.type;
        this.status = entity.status;
        this.title = entity.title;
        this.topicId = entity.topicid;
        this.data = entity.data;
    }

    when<T = any>(event: T, eventName: string): void {
        switch (eventName) {
            case ProcessMessageEvent.name:
                return this.processMessageEvent(event);
            case ProcessSuccessMessageEvent.name:
                return this.processSuccessMessageEvent(event);
            case ProcessFailedMessageEvent.name:
                return this.processFailedMessageEvent(event);
        }
    }

    processMessageEvent<T = any>(event: Required<T & ProcessMessageEvent>): void {
        this.status = event.status;
    }

    processSuccessMessageEvent<T = any>(event: Required<T & ProcessSuccessMessageEvent>): void {
        const { status, message } = event;
        this.status = status;
        this.message = message;
    }

    processFailedMessageEvent<T = any>(event: Required<T & ProcessFailedMessageEvent>): void {
        const { status, message, errorBody } = event;
        this.status = status;
        this.message = message;
        this.errorBody = errorBody;
    }
}
