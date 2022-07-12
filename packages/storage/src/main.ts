/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as expressIp from 'express-ip';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app/app.module';
import { setupSwagger } from './app/setup-swagger';
import { ConfigsService } from './app/shared/service/configs.service';
import { SharedModule } from './app/shared/shared.module';

void (async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { cors: true });
    const configService = app.select(SharedModule).get(ConfigsService);

    // app.use(helmet());
    // app.use(compression());
    app.enableVersioning();
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 10_000, // limit each IP to 100 requests per windowMs
        }),
    );
    app.use(expressIp().getIpInfoMiddleware);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    setupSwagger(app);

    const port = configService.port;
    await app.listen(port, () => {
        Logger.log(`App listen on port: ${port}`);
    });
})();
