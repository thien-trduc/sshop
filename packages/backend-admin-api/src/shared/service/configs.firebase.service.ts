import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FirebaseAdminModuleOptions } from '@tproject/libs/firebase-admin';
import * as admin from 'firebase-admin';

@Injectable()
export class ConfigFirebaseService {
    private readonly logger = new Logger(ConfigFirebaseService.name);

    constructor(private configService: ConfigService) {}

    get projectId(): string {
        return this.configService.get<string>('FIREBASE_PROJECT_ID');
    }

    get privateKey(): string {
        return this.configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');
    }

    get clientEmail(): string {
        return this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    }

    createServiceAccount(): FirebaseAdminModuleOptions {
        const options = {
            projectId: this.projectId,
            privateKey: this.privateKey,
            clientEmail: this.clientEmail,
        };
        this.logger.log(`Firebase admin connection: ${JSON.stringify(options)}`);

        return {
            credential: admin.credential.cert(options),
        };
    }
}
