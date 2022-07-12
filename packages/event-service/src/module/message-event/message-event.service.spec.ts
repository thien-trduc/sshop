import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { MessageEventService } from './message-event.service';

describe('MessageEventService', () => {
    let service: MessageEventService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MessageEventService],
        }).compile();

        service = module.get<MessageEventService>(MessageEventService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
