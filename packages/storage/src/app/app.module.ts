import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
// eslint-disable-next-line unicorn/import-style
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MixinModule } from './modules/mixin/mixin.module';
import { S3Module } from './modules/s3/s3.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        SharedModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
        }),
        MixinModule,
        S3Module,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
