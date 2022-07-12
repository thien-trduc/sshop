import { Test, TestingModule } from '@nestjs/testing';
import { BookRepayController } from './book-repay.controller';

describe('BookRepayController', () => {
    let controller: BookRepayController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookRepayController],
        }).compile();

        controller = module.get<BookRepayController>(BookRepayController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
