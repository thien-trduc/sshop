import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

import { SharedModule } from './shared/shared.module';
import { ConfigsService } from './shared/service/configs.service';

export function setupSwagger(app: INestApplication): void {
    const configService = app.select(SharedModule).get(ConfigsService);

    const config = new DocumentBuilder()
        .setTitle(configService.repoName)
        .addServer(`${configService.baseUrl}`)
        .setDescription(configService.repoName)
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        })
        .setExternalDoc(`${configService.baseUrl}/api-doc-json`, '/api-doc-json')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    app.use(
        '/api-docs',
        basicAuth({
            challenge: true,
            users: configService.swaggerConfig,
        }),
    );

    SwaggerModule.setup('/api-docs', app, document, {
        customSiteTitle: configService.repoName,
        customfavIcon: '',
    });
}
