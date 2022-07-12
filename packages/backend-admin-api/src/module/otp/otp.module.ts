import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

import { ConfigsRabbitService } from '../../shared/service/configs.rabbit.service';
import { SharedModule } from '../../shared/shared.module';
import { OtpService } from './otp.service';

@Module({
    imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            imports: [SharedModule],
            inject: [ConfigsRabbitService],
            useFactory: (config: ConfigsRabbitService) => config.getRabbitOption,
        }),
    ],
    providers: [OtpService],
    exports: [OtpService],
})
export class OtpModule {}
