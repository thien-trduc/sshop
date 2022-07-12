import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsRabbitService } from './shared/service/configs.rabbit.service';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        HttpModule,
        SharedModule,
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            imports: [SharedModule],
            inject: [ConfigsRabbitService],
            useFactory: (config: ConfigsRabbitService) => config.getRabbitOption,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
