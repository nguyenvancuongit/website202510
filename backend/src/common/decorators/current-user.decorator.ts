import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Permission } from '../../users/constants';

export interface AuthUser {
  sub: bigint;
  username: string;
  id: string;
  email: string;
  status: string;
  permissions: Permission[];
  iat?: number;
  exp?: number;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
