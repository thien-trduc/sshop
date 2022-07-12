import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

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
                '<h1>Welcome to Storage Api</h1>\n' +
                '</div>\n' +
                '\n' +
                '\n' +
                '</body>\n' +
                '</html>',
        );
    }
}
