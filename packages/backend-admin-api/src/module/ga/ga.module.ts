import { Module } from '@nestjs/common';

import { GaController } from './ga.controller';
import { GaService } from './ga.service';

@Module({
    providers: [GaService],
    controllers: [GaController],
})
export class GaModule {}
