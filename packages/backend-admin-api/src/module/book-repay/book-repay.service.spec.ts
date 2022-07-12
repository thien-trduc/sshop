import { Test, TestingModule } from '@nestjs/testing';
import { BookRepayService } from './book-repay.service';

describe('BookRepayService', () => {
    let service: BookRepayService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BookRepayService],
        }).compile();

        service = module.get<BookRepayService>(BookRepayService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
