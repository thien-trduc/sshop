import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigsService {
    constructor(private configService: ConfigService) {}

    get port(): number {
        return this.configService.get<number>('PORT');
    }

    get baseUrl(): string {
        return this.configService.get<string>('BASE_URL');
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

    get repoName(): string {
        return this.configService.get<string>('REPO_NAME');
    }

    get directory(): string {
        return this.configService.get<string>('DIRECTORY_PATH');
    }

    get staticUrl(): string {
        return this.configService.get<string>('STATIC_PATH');
    }
}
