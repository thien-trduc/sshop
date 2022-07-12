/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();

import { HttpStatus, Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as expressIp from 'express-ip';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app/app.module';
import { ConfigsService } from './app/shared/service/configs.service';
import { SharedModule } from './app/shared/shared.module';

async function bootstrap() {
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
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            transform: true,
            dismissDefaultMessages: true,
            exceptionFactory: (errors) => new UnprocessableEntityException(errors),
        }),
    );

    const port = configService.port;
    await app.listen(port, () => {
        Logger.log(`App listen on port: ${port}`);
    });

    return app;
}

void bootstrap();
