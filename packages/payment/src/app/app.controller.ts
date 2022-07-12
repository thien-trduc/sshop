import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { ApiBody, ApiExcludeEndpoint } from '@nestjs/swagger';

import { AppService } from './app.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import type { SessionDto } from './dto/session.dto';

@Controller()
export class AppController {
    constructor(private readonly service: AppService) {}

    @Post('payment/create-checkout-session')
    @ApiBody({
        type: CreateCheckoutSessionDto,
    })
    createCheckoutSession(@Headers('secret') secret: string, @Body() formData: CreateCheckoutSessionDto): Promise<SessionDto> {
        return this.service.createCheckoutSession(secret, formData);
    }

    @Get()
    @ApiExcludeEndpoint()
    hello(@Res() res) {
        res.send(
            '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n' +
                '<title>Payment Api</title>\n' +
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
                '<h1>Welcome to T-Project: Payment Api</h1>\n' +
                '</div>\n' +
                '\n' +
                '\n' +
                '</body>\n' +
                '</html>',
        );
    }
}
