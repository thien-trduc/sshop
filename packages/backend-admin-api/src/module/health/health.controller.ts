import { Controller, Get } from '@nestjs/common';
import type { HealthCheckResult } from '@nestjs/terminus';

import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
    constructor(private healthService: HealthService) {}

    @Get()
    public async check(): Promise<HealthCheckResult> {
        return this.healthService.check();
    }
}
