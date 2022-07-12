import { Nack } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { IPgDataService } from '@tproject/libs/data';

import { ProvideRolesForUserCommand } from '../impl';

@CommandHandler(ProvideRolesForUserCommand)
export class ProvideRoleForUserHandler implements ICommandHandler<ProvideRolesForUserCommand> {
    private readonly name = ProvideRoleForUserHandler.name;

    private readonly logger = new Logger(this.name);

    constructor(private readonly data: IPgDataService) {}

    async execute(command: ProvideRolesForUserCommand): Promise<any> {
        const [user, role] = await Promise.all([this.data.user.findById(command.userId), this.data.role.findOne({ name: 'USER' })]);

        if (!user) {
            this.logger.error(`Không tìm thấy user với id: ${command.userId}!`);

            return false;
        }

        if (!role) {
            this.logger.error(`Không tìm thấy role user!`);

            return false;
        }

        try {
            await this.data.role.provideRolesForUser([role.id], user.id);
        } catch (error) {
            this.logger.error(error?.message);

            return new Nack();
        }

        return true;
    }
}
