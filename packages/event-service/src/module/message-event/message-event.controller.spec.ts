import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { MessageEventController } from './message-event.controller';

describe('MessageEventController', () => {
    let controller: MessageEventController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MessageEventController],
        }).compile();

        controller = module.get<MessageEventController>(MessageEventController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
