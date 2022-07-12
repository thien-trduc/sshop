import { Nack } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { IPgDataService } from '@tproject/libs/data';
import * as moment from 'moment';

import { CreateCartForCustomerCommand } from '../impl';
import { NO_CONFIG } from './../../../../constant/global';

@CommandHandler(CreateCartForCustomerCommand)
export class CreateCartForCustomerHandler implements ICommandHandler<CreateCartForCustomerCommand> {
    private readonly name = CreateCartForCustomerHandler.name;

    private readonly logger = new Logger(this.name);

    constructor(private readonly data: IPgDataService) {}

    async execute(command: CreateCartForCustomerCommand): Promise<any> {
        const { userId: id } = command;
        const user = await this.data.user.findOneInnerJoinProfile({ id });

        if (!user) {
            this.logger.error(`Không tồn tại user với id: ${id}`);

            return new Nack();
        }

        const userProfile = user.profile;
        const customer = await this.data.customer.findOne({ userId: user.id });
        const cartData = {
            id: undefined,
            updatedat: undefined,
            createdat: undefined,
            date: undefined,
            address: '',
            status: undefined,
            customer_id: undefined,
            receive_name: '',
            receive_phone: '',
            employee_id: undefined,
        };

        if (!customer) {
            try {
                const newCustomer = await this.data.customer.create({
                    id: undefined,
                    createdat: undefined,
                    updatedat: undefined,
                    name: userProfile?.fullname,
                    surname: NO_CONFIG,
                    sex: userProfile.gender ? 1 : 0,
                    birthdate: moment(userProfile.birthdate).utc().add(7, 'hours').format('DD/MM/YYYY'),
                    address: userProfile.address,
                    phone: userProfile.mobile,
                    email: userProfile.email,
                    userId: userProfile.userId,
                    fullname: userProfile?.fullname,
                    avatar: user?.avatar || '',
                });
                cartData.customer_id = newCustomer.id;
            } catch (error) {
                this.logger.error(error?.message);

                return new Nack();
            }
        } else {
            cartData.customer_id = customer.id;
        }

        const isExistCart = await this.data.cart.existByCustomerAndPending(cartData.customer_id);

        if (!isExistCart) {
            await this.data.cart.create(cartData);
        }
    }
}
