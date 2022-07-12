import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { PaymentIntentStripe } from './constant/enum/payment-intent.enum';
import { PaymentStatusEnum } from './constant/enum/payment-status.enum';
import { Exchange, QueueRabbit, RoutingKey } from './shared/service/configs.rabbit.service';
import { ConfigsService } from './shared/service/configs.service';

@Injectable()
export class AppService {
    private readonly logger = new Logger('Webhook');

    private readonly backend: string;

    constructor(private readonly config: ConfigsService, private readonly http: HttpService) {
        this.backend = this.config.backendAdminApi;
    }

    @RabbitSubscribe({
        exchange: Exchange.WEBHOOK_EXCHANGE,
        routingKey: RoutingKey.WEBHOOK_ROUTING,
        queue: QueueRabbit.WEBHOOK_QUEUE,
        queueOptions: {
            durable: false,
        },
    })
    async listen(msg: any): Promise<void> {
        const { data } = msg;

        switch (msg.type) {
            case PaymentIntentStripe.FAIL:
                break;
            case PaymentIntentStripe.SUCCESS:
                try {
                    await lastValueFrom(
                        this.http.patch(`${this.backend}/api/orders/webhook/status`, {
                            status: PaymentStatusEnum.SUCCESS,
                            cartId: data.object.metadata?.cartId,
                            transactionId: data.object.metadata?.transactionId,
                            customerId: data.object.metadata?.customerId,
                        }),
                    );
                } catch (error) {
                    this.logger.error(`${error?.message}`);
                }

                break;
        }
    }
}
