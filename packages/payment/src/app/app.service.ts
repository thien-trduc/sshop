import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as stripe from 'stripe';

import type { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import type { SessionDto } from './dto/session.dto';
import type { SessionLineItemDto } from './dto/session-line-item.dto';
import { ConfigsService } from './shared/service/configs.service';

@Injectable()
export class AppService {
    private readonly logger = new Logger('Payment');

    private readonly stripeService: stripe.Stripe;

    constructor(private readonly configService: ConfigsService) {
        this.stripeService = new stripe.default(this.configService.getStripeSecretKey, { apiVersion: '2020-08-27' });
    }

    async createCheckoutSession(secret: string, formData: CreateCheckoutSessionDto): Promise<SessionDto> {
        let jwtVerify: any;
        let session: stripe.Stripe.Response<stripe.Stripe.Checkout.Session>;
        const jwtOptions = this.configService.createStripeSecretOptions();

        try {
            jwtVerify = jwt.verify(secret, jwtOptions.secret);
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(error?.message, HttpStatus.UNAUTHORIZED);
        }

        const { cartId, customerId, transactionId } = jwtVerify;

        try {
            const lineItems = formData.datas.map((lineItem: SessionLineItemDto): stripe.Stripe.Checkout.SessionCreateParams.LineItem => {
                const { price, quantity, name, image } = lineItem;

                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name,
                            images: [`${image}`],
                        },
                        unit_amount: price,
                    },
                    quantity: Number(quantity),
                };
            });

            session = await this.stripeService.checkout.sessions.create({
                line_items: lineItems,
                mode: 'payment',
                success_url: formData.webExtraConfig.urlSuccess,
                cancel_url: formData.webExtraConfig.urlFailed,
                payment_method_types: ['card'],
                locale: 'en',
                payment_intent_data: {
                    metadata: {
                        cartId,
                        customerId,
                        transactionId,
                    },
                },
            });
        } catch (error) {
            this.logger.error(error?.message);

            throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
        }

        return { url: session.url };
    }
}
