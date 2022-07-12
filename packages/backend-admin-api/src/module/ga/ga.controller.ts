import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GaService } from './ga.service';

@Controller('analytics')
@ApiTags('Google Analytics')
export class GaController {
    constructor(private readonly service: GaService) {}

    @Get()
    fetch(): Promise<any> {
        return this.service.fetch();
    }
}
