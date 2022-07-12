// import type { BullModuleOptions, SharedBullConfigurationFactory } from '@nestjs/bull';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class ConfigsBullService implements SharedBullConfigurationFactory {
//     constructor(private readonly configService: ConfigService) {}

//     get getRedisHost(): string {
//         return this.configService.get<string>('REDIS_HOST');
//     }

//     get getRedisPort(): number {
//         return this.configService.get<number>('REDIS_PORT');
//     }

//     get getRedisPassword(): string {
//         return this.configService.get<string>('REDIS_PASSWORD');
//     }

//     createSharedConfiguration(): BullModuleOptions {
//         return {
//             redis: {
//                 host: this.getRedisHost,
//                 port: this.getRedisPort,
//                 password: this.getRedisPassword,
//             },
//         };
//     }
// }
