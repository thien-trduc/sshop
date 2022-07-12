import { Injectable } from '@nestjs/common';
import { ClientUtilService } from '@tproject/libs/core';
import * as FormData from 'form-data';

import { ConfigStorageService } from '../../shared/service/configs.storage.service';

@Injectable()
export class StorageService {
    private readonly api: string;

    constructor(private readonly config: ConfigStorageService, private readonly client: ClientUtilService) {
        this.api = this.config.storageUrl;
    }

    async upload(file: any): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('image', file?.buffer, file?.originalname);

        return this.client.post<{ url: string }>(`${this.config.storageUrl}/cdn/file`, formData, {
            ...formData.getHeaders(),
        });
    }
}
