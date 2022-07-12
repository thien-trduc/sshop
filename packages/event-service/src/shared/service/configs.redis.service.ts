// import type { CacheModuleOptions } from '@nestjs/common';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as redisStore from 'cache-manager-redis-store';

// @Injectable()
// export class ConfigsRedisService {
//     constructor(private readonly config: ConfigService) {}

//     get getRedisHost(): string {
//         return this.config.get<string>('REDIS_HOST');
//     }

//     get getRedisPort(): number {
//         return this.config.get<number>('REDIS_PORT');
//     }

//     get getRedisPassword(): string {
//         return this.config.get<string>('REDIS_PASSWORD');
//     }

//     get getRedisExpireTime(): number {
//         return this.config.get<number>('REDIS_EXPIRE');
//     }

//     get createRedisOptions(): CacheModuleOptions {
//         return {
//             store: redisStore,
//             host: this.getRedisHost,
//             port: this.getRedisPort,
//             password: this.getRedisPassword,
//             ttl: this.getRedisExpireTime,
//         };
//     }
// }
