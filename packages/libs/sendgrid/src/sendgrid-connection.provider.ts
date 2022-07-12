import { SENDGRID_CONNECTION } from './constants';
import { SendgridService } from './sendgrid.service';

export const connectionFactory = {
  provide: SENDGRID_CONNECTION,
  useFactory: async sendgridService => {
    return sendgridService.setApiKey();
  },
  inject: [SendgridService],
};
