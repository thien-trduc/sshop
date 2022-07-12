/* Dependencies */
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/* Interfaces */
import { SendgridOptions } from './sendgrid-options.interface';
import { SendgridOptionsFactory } from './sendgrid-options-factory.interface';

export interface SendgridAsyncOption extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<SendgridOptionsFactory>;
  useClass?: Type<SendgridOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SendgridOptions> | SendgridOptions;
}
