import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

import { ConfigsService } from './shared/service/configs.service';

@Controller()
export class AppController {
    private readonly swaggerUrl: string;

    constructor(private readonly configService: ConfigsService) {
        this.swaggerUrl = `${this.configService.baseUrl}/api-docs`;
    }

    @Get()
    @ApiExcludeEndpoint()
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
                '<h1>Welcome to Backend Admin Api</h1>\n' +
                `<a href="${this.swaggerUrl}">Please go to api docs</a>\n` +
                '</div>\n' +
                '\n' +
                '\n' +
                '</body>\n' +
                '</html>',
        );
    }
}
