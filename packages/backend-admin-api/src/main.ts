/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cors from 'cors';
import * as expressIp from 'express-ip';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter';
import { setupSwagger } from './setup-swagger';
import { ConfigsService } from './shared/service/configs.service';
import { SharedModule } from './shared/shared.module';
import { setupTracing } from './tracing';

export async function bootstrap(): Promise<NestExpressApplication> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

    const configService = app.select(SharedModule).get(ConfigsService);
    const reflector = app.get(Reflector);

    app.enable('trust proxy');
    app.setGlobalPrefix('/api', { exclude: ['/'] });
    // app.use(helmet());
    // app.use(compression());
    app.enableVersioning();
    app.useGlobalFilters(new HttpExceptionFilter(reflector));

    const whitelist = configService.whiteList; //white list consumers
    const corsOptions = {
        origin(origin, callback) {
            if (whitelist.includes(origin)) {
                callback(undefined, true);
            } else {
                callback(undefined, false);
            }
        },
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
        optionsSuccessStatus: 200,
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'device-remember-token',
            'Access-Control-Allow-Origin',
            'Origin',
            'Accept',
        ],
    };

    app.use(cors(corsOptions));
    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            transform: true,
        }),
    );

    setupSwagger(app);
    setupTracing(app);
    // app.use(
    //     rateLimit({
    //         windowMs: 15 * 60 * 1000, // 15 minutes
    //         max: 10_000, // limit each IP to 100 requests per windowMs
    //     }),
    // );

    app.use(
        rateLimit({
            windowMs: 5 * 60 * 1000, // 2 s
            max: 1000, // limit each IP to 10 requests per windowMs
            message: 'Qúa nhiều request ! Xin chậm lại để server load nữa ! Please !',
        }),
    );

    app.use(expressIp().getIpInfoMiddleware);

    const port = configService.port;
    await app.listen(port, () => {
        Logger.log(`App listen on port: ${port}`);
    });

    return app;
}

void bootstrap();
