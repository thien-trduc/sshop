import { SendgridOptions } from './interfaces';

import { SENDGRID_API_KEY } from './constants';

export function createSendgridProviders(
  options: SendgridOptions,
) {
  return [
    {
      provide: SENDGRID_API_KEY,
      useValue: options,
    },
  ];
}
