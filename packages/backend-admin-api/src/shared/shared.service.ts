import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
    public get isConnected(): boolean {
        return true;
    }
}
