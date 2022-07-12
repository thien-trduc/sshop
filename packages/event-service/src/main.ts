/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { HttpStatus, Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as expressIp from 'express-ip';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter';
import { setupSwagger } from './setup-swagger';
import { ConfigsService } from './shared/service/configs.service';
import { SharedModule } from './shared/shared.module';

export async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { cors: true });
    const configService = app.select(SharedModule).get(ConfigsService);
    const reflector = app.get(Reflector);

    app.enable('trust proxy');
    app.setGlobalPrefix('/api', { exclude: ['/'] });
    app.enableVersioning();
    app.useGlobalFilters(new HttpExceptionFilter(reflector));
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 10_000, // limit each IP to 100 requests per windowMs
        }),
    );
    app.use(expressIp().getIpInfoMiddleware);
    app.useGlobalPipes(
        new ValidationPipe({
            // whitelist: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            transform: true,
            dismissDefaultMessages: true,
            exceptionFactory: (errors) => new UnprocessableEntityException(errors),
        }),
    );

    setupSwagger(app);

    const port = configService.port;
    const url = configService.baseUrl;
    await app.listen(port, () => {
        Logger.log(`App listen on port: ${port}`);
        Logger.log(`Url: ${url}`);
    });
}

void bootstrap();
