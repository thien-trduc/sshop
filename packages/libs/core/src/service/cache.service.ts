import { Injectable } from '@nestjs/common';

// export enum CacheRouting {
//     SAVE = 'cache_save'
// }

// export enum CacheExchange {
//     MESSAGE_EVENT = 'message-event-exchange'
// }

@Injectable()
// @Processor(QueueEnum.CACHE_SERVICE)
export class CacheService {
    // private readonly logger = new Logger(CacheService.name);
    
    // constructor(
    //     @Inject(CACHE_MANAGER) private cacheManager: Cache,
    //     private readonly amqp: AmqpConnection,
    // ) {}
    
    // get(key: string): Promise<any> {
    //     return this.cacheManager.get(key);
    // }

    // async set(key: string, data: any): Promise<void> {
    //     await this.amqp.publish(CacheExchange.MESSAGE_EVENT, CacheRouting.SAVE, {
    //         key,
    //         data
    //     })
    // }
    
    // @Process(ProcessEnum.CREATE_CACHE)
    // async set(payload: any): Promise<void> {
    //     const { key, value } = payload.data;
    //     try {
    //         await this.prisma.cache_keys.create({
    //             data: { key },
    //         });
    //     } catch (error: any) {
    //         await this.prisma.cache_keys.update({
    //             where: { key },
    //             data: { isDeleted: false },
    //         });
    //     }
    //     await this.cacheManager.set(key, value);
    // }
    //
    // @Process(ProcessEnum.DELETE_CACHE_BY_KEY)
    // async delByKey(key: string): Promise<void> {
    //     try {
    //         await this.prisma.cache_keys.update({
    //             where: { key },
    //             data: { isDeleted: true },
    //         });
    //     } catch (error: any) {
    //         this.logger.warn(error?.message);
    //     }
    //     await this.cacheManager.del(key);
    // }
    //
    // @Process(ProcessEnum.RESET_CACHE)
    // async reset(): Promise<void> {
    //     try {
    //         await this.prisma.cache_keys.updateMany({
    //             data: { isDeleted: true },
    //         });
    //     } catch (error: any) {
    //         this.logger.warn(error?.message);
    //     }
    //     await this.cacheManager.reset();
    // }
}
