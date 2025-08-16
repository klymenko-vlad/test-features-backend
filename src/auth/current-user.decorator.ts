import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { RequestWithUser } from './types/request-with-user.interface';

function getCurrentUserByContext(context: ExecutionContext) {
  return context.switchToHttp().getRequest<RequestWithUser>().user;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
