import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import type { ConfigOptions } from 'cloudinary';

export const enum ServiceStorage {
    CLOUDINARY = 'CLOUDINARY',
    S3 = 'S3',
}

@Injectable()
export class ConfigStorageService {
    constructor(private readonly config: ConfigService) {}

    get getApiKey(): string {
        return this.config.get<string>('API_STORAGE_KEY');
    }

    get getApiSecret(): string {
        return this.config.get<string>('SECRET_STORAGE_KEY');
    }

    get getName(): string {
        return this.config.get<string>('NAME_STORAGE_SECRET');
    }

    get getBucket(): string {
        return this.config.get<string>('MY_BUCKET');
    }

    get getServiceStorage(): string {
        return this.config.get<string>('SERVICE_STORAGE') || 'CLOUDINARY';
    }

    // get getConfigCloudinary(): ConfigOptions {
    //     return {
    //         api_key: this.getApiKey,
    //         api_secret: this.getApiSecret,
    //         cloud_name: this.getName,
    //     };
    // }

    // get configOptions(): any {
    //     switch (this.getServiceStorage) {
    //         case ServiceStorage.CLOUDINARY:
    //             return this.getConfigCloudinary;
    //         case ServiceStorage.S3:
    //             return {};
    //     }
    // }

    get storageUrl(): string {
        return this.config.get<string>('STORAGE_URL');
    }
}
