import { Logger } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import { SaveCacheCommand } from '../impl';

@CommandHandler(SaveCacheCommand)
export class SaveChacheHandler implements ICommandHandler<SaveCacheCommand> {
    execute(command: SaveCacheCommand): Promise<any> {
        throw new Error('Method not implemented.');
    }
    // private readonly name = SaveChacheHandler.name;

    // private readonly logger = new Logger(this.name);

    // execute(command: SaveCacheCommand): Promise<void> {}
}
