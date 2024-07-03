import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ShowInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.show ? request.show : null;
  },
);
