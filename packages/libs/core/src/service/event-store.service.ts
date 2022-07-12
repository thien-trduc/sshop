import { IPgDataService, optionsTransation } from '@tproject/libs/data'
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@tproject/libs/core';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel } from '../model/base.model';
import { first, get, last } from 'lodash';

@Injectable()
export class EventStoreService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly data: IPgDataService,
    ) {}

    private readonly logger = new Logger(EventStoreService.name);

    async save<T = any>(streamid: string, type: string, objEvent: T, streamType: string = ''): Promise<void> {
        const stream = await this.prisma.stream.findUnique({
            where: {
                streamid,
            }
        });
        if (!stream) {
            try {
                await this.prisma.$transaction(async (tx) => {
                    await tx.stream.create({
                        data: {
                            streamid,
                            type: streamType,
                            version: 1,
                        },
                    });
                    await tx.event.create({
                        data: {
                            data: JSON.stringify(objEvent),
                            type,
                            version: 1,
                            streamid,
                            meta: JSON.stringify(objEvent),
                        },
                    });
                }, optionsTransation);
            } catch (error: any) {
                this.logger.error(error?.message);

                throw error
            }
        } else {
            const event = await this.data.event.findOne({
                streamid
            });
            const checkVersion = event.version + 1 > event.version
            if (!checkVersion) {
                throw Error(`Không thể lưu trạng thái sự kiện với stream: ${streamid}!`);
            }
            try {
                await this.prisma.event.create({
                    data: {
                        data: JSON.stringify(objEvent),
                        type,
                        version: event.version  + 1,
                        streamid: stream.streamid,
                        meta: JSON.stringify(objEvent),
                    },
                });
            } catch (error: any) {
                this.logger.error(error?.message);

                throw error;
            }
        }
    }

    async load<T extends BaseModel>(model: T): Promise<T> {
        const stream = await this.prisma.stream.findUnique({
            where: {
                streamid: model.streamId,
            },
            include: {
                event: true,
            },
        });
        if (stream && stream.event.length > 0) {
            for (const event of stream.event) {
                const data = JSON.parse(`${event.data}`);
                model.when(data, event.type);
            }
        }
        return model;
    }

    static genStreamId(name: string): string {
        return `${name}-#${uuidv4()}`;
    }
}
