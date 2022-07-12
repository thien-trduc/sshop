import type { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const enum Exchange {
    MESSAGE_EVENT = 'message-event-exchange',
}

export const enum RoutingKey {
    EVENT_CREATE = 'event_create',
    MAP_PROFILE_TO_CUSTOMER = 'map_profile_to_customer',
    CREATE_CART_FOR_CUSTOMER = 'create_cart_for_customer',
    PROVIDER_ROLE_FOR_USER = 'provide_role_for_user',
    OTP_CREATE = 'otp_create',
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
                    name: Exchange.MESSAGE_EVENT,
                    type: 'direct',
                },
            ],
            uri: this.getRabbitUri,
        };
    }
}
