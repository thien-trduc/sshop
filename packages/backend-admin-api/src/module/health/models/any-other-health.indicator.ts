import type { HealthIndicatorResult } from '@nestjs/terminus';

import type { SharedService } from '../../../shared/shared.service';
import type { PrometheusService } from '../../prometheus/prometheus.service';
import type { HealthIndicator } from '../interfaces/health-indicator.interface';
import { BaseHealthIndicator } from './base-health.indicator';

export class AnyOtherHealthIndicator extends BaseHealthIndicator implements HealthIndicator {
    public readonly name = 'AnyOtherCustomHealthIndicator';

    protected readonly help = 'Status of ' + this.name;

    constructor(private service: SharedService, protected promClientService: PrometheusService) {
        super();
        // this.registerMetrics();
        this.registerGauges();
    }

    public async isHealthy(): Promise<HealthIndicatorResult> {
        const isHealthy = this.service.isConnected;
        this.updatePrometheusData(isHealthy);

        return Promise.resolve(this.getStatus(this.name, isHealthy));
    }
}
