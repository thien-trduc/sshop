import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common';

import { Exchange, RoutingKey } from './shared/service/configs.rabbit.service';

@Controller()
export class AppController {
    private readonly logger = new Logger('Webhook');

    constructor(private readonly amqp: AmqpConnection) {}

    @Post('webhook')
    handle(@Body() formData: any): any {
        void this.amqp.publish(Exchange.WEBHOOK_EXCHANGE, RoutingKey.WEBHOOK_ROUTING, formData);

        return {
            received: true,
        };
    }

    @Get()
    hello(@Res() res) {
        res.send(
            '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n' +
                '<title>Backend Admin Api</title>\n' +
                '<style>\n' +
                '\tbody {\n' +
                '    \talign-item: center;\n' +
                '    \tjustify-content: center;\n' +
                '  \t\tdisplay: flex;\n' +
                '  \t\ttext-align: center;\n' +
                '    }\n' +
                '\t.content {\n' +
                '    \tmargin: 20% auto;\n' +
                '    }\n' +
                '</style>\n' +
                '</head>\n' +
                '<body>\n' +
                '\n' +
                '<div class="content">\n' +
                '<h1>Welcome to T-Project: Webhook</h1>\n' +
                '</div>\n' +
                '\n' +
                '\n' +
                '</body>\n' +
                '</html>',
        );
    }
}
