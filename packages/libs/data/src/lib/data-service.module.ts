import { Global, Module } from '@nestjs/common';
import { PgPrismaService } from './pg/pg-prisma.service';
import { IPgDataService } from './pg/pg-data-service';
import { PrismaService } from './provider/prisma.service';

@Global()
@Module({
    providers: [
        PrismaService,
        {
            provide: IPgDataService,
            useClass: PgPrismaService,
        },
    ],
    exports: [PrismaService, IPgDataService],
})
export class DataServiceModule {}
