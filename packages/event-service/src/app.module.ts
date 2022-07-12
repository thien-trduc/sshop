import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { MessageEventModule } from './module/message-event/message-event.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        SharedModule,
        MessageEventModule,
        // BullModule.forRootAsync({
        //     useExisting: ConfigsBullService,
        // }),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
