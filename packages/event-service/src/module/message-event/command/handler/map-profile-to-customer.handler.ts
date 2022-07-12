import { Nack } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { IPgDataService } from '@tproject/libs/data';
import * as moment from 'moment';

import { NO_CONFIG } from '../../../../constant';
import { MapProfileToCustomerCommand } from '../impl';

@CommandHandler(MapProfileToCustomerCommand)
export class MapProfileToCustomerHandler implements ICommandHandler<MapProfileToCustomerCommand> {
    private readonly name = MapProfileToCustomerHandler.name;

    private readonly logger = new Logger(this.name);

    constructor(private readonly data: IPgDataService) {}

    async execute(command: MapProfileToCustomerCommand): Promise<any> {
        const { userId: id } = command;
        const user = await this.data.user.findOneInnerJoinProfile({ id });

        if (!user || !user.profile) {
            this.logger.error(`Không tồn tại user hoặc user_profile với id: ${id}`);

            return new Nack();
        }

        const userProfile = user.profile;

        try {
            await this.data.customer.create({
                id: undefined,
                createdat: undefined,
                updatedat: undefined,
                name: userProfile?.fullname || NO_CONFIG,
                surname: NO_CONFIG,
                sex: userProfile.gender ? 1 : 0,
                birthdate: moment(userProfile.birthdate).utc().add(7, 'hours').format('DD/MM/YYYY'),
                address: NO_CONFIG,
                phone: userProfile.mobile,
                email: userProfile.email,
                userId: userProfile.userId,
                fullname: userProfile?.fullname || `${userProfile.surname} ${userProfile.name}`.trim(),
                avatar: user?.avatar || '',
            });
        } catch (error) {
            this.logger.error(error?.message);

            return new Nack();
        }
    }
}
