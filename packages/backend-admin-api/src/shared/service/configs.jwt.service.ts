import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class ConfigsJwtService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    get jwtSecretKey(): string {
        return this.configService.get<string>('JWT_SECRET_KEY');
    }

    get jwtRefreshSecretKey(): string {
        return this.configService.get<string>('REFRESH_SECRET_KEY');
    }

    get verifyJwtOptions(): JwtModuleOptions {
        return {
            secret: this.configService.get<string>('JWT_SECRET_KEY'),
            signOptions: { expiresIn: this.configService.get<string>('JWT_SECRET_KEY_EXPIRED_IN') },
        };
    }

    get verifyJwtRefreshOptions(): JwtModuleOptions {
        return {
            secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
            signOptions: { expiresIn: this.configService.get<string>('REFRESH_SECRET_EXPIRED') },
        };
    }

    // eslint-disable-next-line sonarjs/no-identical-functions
    createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
        return {
            secret: this.configService.get<string>('JWT_SECRET_KEY'),
            signOptions: { expiresIn: this.configService.get<string>('JWT_SECRET_KEY_EXPIRED_IN') },
        };
    }

    // eslint-disable-next-line sonarjs/no-identical-functions
    createJwtRefreshOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
        return {
            secret: this.configService.get<string>('JWT_SECRET_KEY'),
            signOptions: { expiresIn: this.configService.get<string>('JWT_SECRET_KEY_EXPIRED_IN') },
        };
    }

    createStripeSecretOptions(): JwtModuleOptions {
        return {
            secret: this.configService.get<string>('STRIPE_SECRET'),
            signOptions: { expiresIn: this.configService.get<string>('STRIPE_EXPIRE') },
        };
    }

    createJwtOtpOptions(secret: string): JwtModuleOptions {
        return {
            secret,
            signOptions: { expiresIn: this.configService.get<string>('JWT_OTP_SECRET_KEY_EXPIRED_IN') },
        };
    }

    // eslint-disable-next-line sonarjs/no-identical-functions
    verifyJwtOtpOptions(secret: string): JwtModuleOptions {
        return {
            secret,
            signOptions: { expiresIn: this.configService.get<string>('JWT_OTP_SECRET_KEY_EXPIRED_IN') },
        };
    }
}
