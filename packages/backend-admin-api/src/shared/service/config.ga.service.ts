import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigGaService {
    constructor(private readonly configService: ConfigService) {}

    get googleApiScope(): string {
        return this.configService.get<string>('GOOGLE_API_SCOPE');
    }

    get gaViewId(): string {
        return this.configService.get<string>('GA_VIEW_ID');
    }

    get gaPrivateKey(): string {
        return this.configService.get<string>('GA_PRIVATE_KEY').replace(/\\n/g, '\n');
    }

    get gaClientEmail(): string {
        return this.configService.get<string>('GA_CLIENT_EMAIL').replace(/\\n/g, '\n');
    }
}
