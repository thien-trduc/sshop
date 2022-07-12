import type { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const enum Exchange {
    WEBHOOK_EXCHANGE = 'webhook_exchange',
}

export const enum RoutingKey {
    WEBHOOK_ROUTING = 'webhook_routing',
}

export const enum QueueRabbit {
    WEBHOOK_QUEUE = 'webhook_queue',
}

@Injectable()
export class ConfigsRabbitService {
    constructor(private readonly configService: ConfigService) {}

    get getRabbitUser(): string {
        return this.configService.get<string>('RABBIT_USER');
    }

    get getRabbitPassword(): string {
        return this.configService.get<string>('RABBIT_PASSWORD');
    }

    get getRabbitHost(): string {
        return this.configService.get<string>('RABBIT_HOST');
    }

    get getRabbitPort(): number {
        return this.configService.get<number>('RABBIT_PORT');
    }

    get getRabbitUri(): string {
        return `amqp://${this.getRabbitUser}:${this.getRabbitPassword}@${this.getRabbitHost}:${this.getRabbitPort}`;
    }

    get getRabbitOption(): RabbitMQConfig {
        return {
            connectionInitOptions: {
                timeout: 10_000,
            },
            enableControllerDiscovery: true,
            exchanges: [
                {
                    name: Exchange.WEBHOOK_EXCHANGE,
                    type: 'direct',
                },
            ],
            uri: this.getRabbitUri,
        };
    }
}
