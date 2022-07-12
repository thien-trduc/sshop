import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MixinController } from './mixin.controller';
import { MixinMulterService } from './mixin-multer.provider';

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MixinMulterService,
        }),
    ],
    providers: [],
    controllers: [MixinController],
})
export class MixinModule {}
