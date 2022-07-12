/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable unicorn/no-null */
import { Injectable } from '@nestjs/common';
import type { MulterOptionsFactory } from '@nestjs/platform-express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { last } from 'lodash';
import * as uuid from 'uuid';
import mkdirp = require('mkdirp');
import * as multer from 'multer';

import { ConfigsService } from '../../shared/service/configs.service';

@Injectable()
export class MixinMulterService implements MulterOptionsFactory {
    private readonly mimeTypes = new Set(['image/png', 'image/jpeg', 'image/svg+xml']);

    constructor(private readonly config: ConfigsService) {}

    createMulterOptions(): MulterOptions | Promise<MulterOptions> {
        return {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    const dir = this.config.directory;
                    mkdirp(dir, (err) => {
                        cb(err, dir);
                    });
                },
                filename: (req, file, cb) => {
                    const mimetype = last(file.originalname.split('.'));
                    const filename = `${uuid.v4().replace(/-/g, '')}.${mimetype}`;
                    req.headers.filename = filename;
                    cb(null, filename);
                },
            }),
            limits: {
                fileSize: 1024 * 1024 * 5,
            },
            fileFilter: (req, file, cb) =>
                this.mimeTypes.has(file.mimetype)
                    ? cb(null, true)
                    : cb(new Error(`Chỉ được tải lên các file có định dạng ${[...this.mimeTypes]}`), false),
        };
    }
}
