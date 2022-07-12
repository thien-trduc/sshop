import { Controller, Get, Param, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

import { ConfigsService } from '../../shared/service/configs.service';

@Controller('cdn')
export class MixinController {
    constructor(private readonly config: ConfigsService) {}

    @Post('file')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
    @ApiOperation({ summary: 'Upload static file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    upload(@UploadedFiles() files, @Req() req): Promise<{ url: string }> {
        return Promise.resolve({
            url: `${this.config.staticUrl}/${req.headers.filename}`,
        });
    }

    @Get('file/:path')
    @ApiOperation({ summary: `Lấy file theo path` })
    seeUploadedFile(@Param('path') path: string, @Res() res) {
        return res.sendFile(path, { root: `./${this.config.directory}` });
    }
}
