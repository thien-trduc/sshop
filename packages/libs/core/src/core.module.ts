import { Global, Module } from '@nestjs/common';
// import { PrismaService } from './service/prisma.service';
import { EventStoreService } from './service/event-store.service';
import { UtilService } from './service/utils.service';
import { HttpModule } from '@nestjs/axios';
import { ClientUtilService } from './service/client-util.service';

@Global()
@Module({
    imports: [HttpModule],
    exports: [
        // PrismaService,
        // EventStoreService,
        UtilService,
        ClientUtilService,
    ],
    providers: [
        // PrismaService,
        // EventStoreService,
        UtilService,
        ClientUtilService,
    ],
})
export class CoreModule {}
