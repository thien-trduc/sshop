import type { HealthIndicatorResult } from '@nestjs/terminus';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface HealthIndicator {
    name: string;
    callMetrics: any;
    customMetricsRegistered: boolean;
    customGaugesRegistered: boolean;
    updatePrometheusData(isConnected: boolean): void;
    isHealthy(): Promise<HealthIndicatorResult>;
    reportUnhealthy(): HealthIndicatorResult;
}
