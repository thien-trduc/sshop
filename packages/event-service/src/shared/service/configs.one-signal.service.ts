import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigsOneSignalService {
    constructor(private readonly config: ConfigService) {}

    get getAppId(): string {
        return this.config.get<string>('ONE_SIGNAL_APP_ID');
    }
}
