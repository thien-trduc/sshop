import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigsService {
    constructor(private configService: ConfigService) {}

    get port(): number {
        return this.configService.get<number>('PORT');
    }

    get swaggerPassword(): string {
        return this.configService.get<string>('SWAGGER_PASSWORD');
    }

    get swaggerName(): string {
        return this.configService.get<string>('SWAGGER_NAME');
    }

    get swaggerConfig(): any {
        return { [this.swaggerName]: this.swaggerPassword };
    }

    get baseUrl(): string {
        return this.configService.get<string>('BASE_URL');
    }

    get repoName(): string {
        return this.configService.get<string>('REPO_NAME');
    }

    get saltHash(): number {
        return this.configService.get<number>('SALT_HASH') || 10;
    }

    get getMailTemplateId(): string {
        return this.configService.get<string>('SENDGRID_TEMPLATE');
    }

    get getPaymentUrl(): string {
        return this.configService.get<string>('PAYMENT_URL');
    }

    get whiteList(): string[] {
        return this.configService.get<string>('WHITE_LIST').split(',');
    }

    get shipPrice(): number {
        return this.configService.get<number>('SHIP_PRICE') || 10_000;
    }

    get redirectUrl(): string {
        return this.configService.get<string>('WEB_REDIRECT_URL');
    }
}
