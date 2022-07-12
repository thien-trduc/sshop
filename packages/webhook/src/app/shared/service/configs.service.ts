import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

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

    get backendAdminApi(): string {
        return this.configService.get<string>('BACKEND_ADMIN_API');
    }
}
