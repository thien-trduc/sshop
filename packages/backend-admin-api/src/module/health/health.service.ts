import { Injectable, Logger } from '@nestjs/common';
import type { HealthCheckResult } from '@nestjs/terminus';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

import { SharedService } from '../../shared/shared.service';
import { PrometheusService } from '../prometheus/prometheus.service';
import type { HealthIndicator } from './interfaces/health-indicator.interface';
import { AnyOtherHealthIndicator } from './models/any-other-health.indicator';
import { NestjsHealthIndicator } from './models/nestjs-health.indicator';

@Injectable()
export class HealthService {
    private readonly listOfThingsToMonitor: HealthIndicator[];

    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private promClientService: PrometheusService,
        private service: SharedService,
    ) {
        this.listOfThingsToMonitor = [
            new NestjsHealthIndicator(this.http, 'https://docs.nestjs.com', this.promClientService),
            new AnyOtherHealthIndicator(this.service, this.promClientService),
        ];
    }

    @HealthCheck()
    public async check(): Promise<HealthCheckResult | undefined> {
        return this.health.check(
            this.listOfThingsToMonitor.map((apiIndicator: HealthIndicator) => async () => {
                try {
                    return await apiIndicator.isHealthy();
                } catch (error) {
                    Logger.warn(error);

                    return apiIndicator.reportUnhealthy();
                }
            }),
        );
    }
}
