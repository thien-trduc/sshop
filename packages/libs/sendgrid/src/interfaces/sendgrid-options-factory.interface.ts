import {
  SendgridOptions,
} from './sendgrid-options.interface';

export interface SendgridOptionsFactory {
  setApiKey():
    | Promise<SendgridOptions>
    | SendgridOptions;
}
