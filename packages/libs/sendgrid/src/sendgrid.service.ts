import { Injectable, Inject, Logger } from '@nestjs/common';
import { SENDGRID_API_KEY } from './constants';
import * as sendgrid from '@sendgrid/mail';
import { SendgridOptions } from './interfaces';

interface ISendgridService {
    setApiKey(): any;
}

@Injectable()
export class SendgridService implements ISendgridService {
    private readonly logger: Logger;
    // tslint:disable-next-line: variable-name
    private _sendgridConnection: any;
    // tslint:disable-next-line: variable-name
    constructor(@Inject(SENDGRID_API_KEY) private _sendgridApiKey: SendgridOptions) {
        this.logger = new Logger('SendgridService');
        this.logger.log(`Options: ${JSON.stringify(this._sendgridApiKey)}`);
    }

    setApiKey(): any {
        if (!this._sendgridConnection) {
            sendgrid.setApiKey(this._sendgridApiKey.apiKey);
            this._sendgridConnection = sendgrid;
        }
        return this._sendgridConnection;
    }
}
