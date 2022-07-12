import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SendgridOptions, SendgridOptionsFactory } from '@tproject/libs/sendgrid';

@Injectable()
export class ConfigsSendgridService implements SendgridOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    setApiKey(): SendgridOptions {
        return {
            apiKey: this.getApiKey,
        };
    }

    get getMailFrom(): string {
        return this.configService.get<string>('MAIL_FROM');
    }

    get getApiKey(): string {
        return this.configService.get<string>('SENDGRID_API_KEY');
    }

    get getMailTemplateId(): string {
        return this.configService.get<string>('SENDGRID_TEMPLATE');
    }

    get getMailTemplateIdRegister(): string {
        return this.configService.get<string>('SENDGRID_TEMPLATE_REGISTER');
    }

    get getMailTemplateIdReceipt(): string {
        return this.configService.get<string>('SENDGRID_TEMPLATE_RECEIPT');
    }

    get getMailTemplateIdOtpVerify(): string {
        return this.configService.get<string>('SENDGRID_TEMPLATE_OTP_VERIFY');
    }
}
