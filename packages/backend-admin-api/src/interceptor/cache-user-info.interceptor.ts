import type { ExecutionContext } from '@nestjs/common';
import { CacheInterceptor, Injectable } from '@nestjs/common';

@Injectable()
export class CacheUserInfoInterceptor extends CacheInterceptor {
    protected trackBy(context: ExecutionContext): string {
        const ctxHttp = context.switchToHttp();
        const request = ctxHttp.getRequest();

        return `${request.url}_${request.user.id}`;
    }
}
