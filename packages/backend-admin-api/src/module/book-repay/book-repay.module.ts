import { Module } from '@nestjs/common';
import { BookRepayService } from './book-repay.service';
import { BookRepayController } from './book-repay.controller';

@Module({
    providers: [BookRepayService],
    controllers: [BookRepayController],
})
export class BookRepayModule {}
