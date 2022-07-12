import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

import { ConfigGaService } from '../../shared/service/config.ga.service';

@Injectable()
export class GaService {
    constructor(private readonly configGaSerivce: ConfigGaService) {}

    async fetch(): Promise<any> {
        const jwt = new google.auth.JWT(
            this.configGaSerivce.gaClientEmail,
            undefined,
            this.configGaSerivce.gaPrivateKey,
            this.configGaSerivce.googleApiScope,
        );
        await jwt.authorize();

        // return google.analytics('v3').data.ga.get({
        //     auth: jwt,
        //     ids: `ga:${this.configGaSerivce.gaViewId}`,
        //     [`start-date`]: '30daysAgo',
        //     [`end-date`]: 'today',
        //     metrics: 'ga:sess',
        // });
        const response = await google.analytics('v3').data.ga.get({
            auth: jwt,
            ids: `ga:${this.configGaSerivce.gaViewId}`,
            [`start-date`]: 'yesterday',
            [`end-date`]: 'yesterday',
            metrics: 'ga:sessions',
            filters: 'ga:medium==organic',
            dimensions: 'ga:browser',
        });

        return response.data;
    }
}
