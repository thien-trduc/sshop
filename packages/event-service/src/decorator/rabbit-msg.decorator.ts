import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RabbitMsg = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  console.log(ctx)
    const request = ctx.switchToRpc().getData();
    console.log(request)
    return request;
});
