import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { SENDGRID_API_KEY } from './constants';
import {
    SendgridOptions,
    SendgridAsyncOption,
    SendgridOptionsFactory,
} from './interfaces';
import { createSendgridProviders } from './sendgrid.providers';

import { connectionFactory } from './sendgrid-connection.provider';

@Global()
@Module({
    providers: [SendgridService, connectionFactory],
    exports: [SendgridService, connectionFactory],
})
export class SendgridMailModule {
    /**
     * Registers a configured NestKnex Module for import into the current module
     */
    public static register(options: SendgridOptions): DynamicModule {
        return {
            module: SendgridMailModule,
            providers: createSendgridProviders(options),
        };
    }

    /**
     * Registers a configured NestKnex Module for import into the current module
     * using dynamic options (factory, etc)
     */
    public static registerAsync(options: SendgridAsyncOption): DynamicModule {
        return {
            module: SendgridMailModule,
            providers: [...this.createProviders(options)],
        };
    }

    private static createProviders(options: SendgridAsyncOption): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createOptionsProvider(options)];
        }

        return [
            this.createOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createOptionsProvider(options: SendgridAsyncOption): Provider {
        if (options.useFactory) {
            return {
                provide: SENDGRID_API_KEY,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        // For useExisting...
        return {
            provide: SENDGRID_API_KEY,
            useFactory: async (optionsFactory: SendgridOptionsFactory) =>
                await optionsFactory.setApiKey(),
            inject: [options.useExisting || options.useClass],
        };
    }
}
