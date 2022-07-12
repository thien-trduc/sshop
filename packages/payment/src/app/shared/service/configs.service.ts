import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class ConfigsService {
    constructor(private configService: ConfigService) {}

    get port(): number {
        return this.configService.get<number>('PORT');
    }

    get baseUrl(): string {
        return this.configService.get<string>('BASE_URL');
    }

    get getStripeSecretKey(): string {
        return this.configService.get<string>('STRIPE_SECRET_KEY');
    }

    createStripeSecretOptions(): JwtModuleOptions {
        return {
            secret: this.configService.get<string>('STRIPE_SECRET'),
            signOptions: { expiresIn: this.configService.get<string>('STRIPE_EXPIRE') },
        };
    }

    get redirectUrl(): string {
        return this.configService.get<string>('WEB_REDIRECT_URL');
    }
}
