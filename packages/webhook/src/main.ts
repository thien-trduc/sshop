/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';
import { ConfigsService } from './app/shared/service/configs.service';
import { SharedModule } from './app/shared/shared.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { cors: true });

    const configService = app.select(SharedModule).get(ConfigsService);

    const port = configService.port;
    await app.listen(port, () => {
        Logger.log(`App listen on port: ${port}`);
    });

    return app;
}

void bootstrap();
