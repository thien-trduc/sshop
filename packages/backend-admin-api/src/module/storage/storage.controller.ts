import { Controller, Post, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { StorageService } from './storage.service';

@Controller('storage')
@ApiTags('Upload file')
export class StorageController {
    constructor(private readonly service: StorageService) {}

    @Post('file')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    upload(@UploadedFile() file): Promise<{ url: string }> {
        return this.service.upload(file);
    }
}
