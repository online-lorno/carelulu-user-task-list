import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  async (_data: unknown, context: ExecutionContext) => {
    let ctx;
    const contextType = context.getType<ContextType | GqlContextType>();

    if (contextType == 'graphql') {
      ctx = GqlExecutionContext.create(context).getContext();
    } else {
      ctx = context.switchToHttp().getRequest();
    }

    if (!ctx?.user || !ctx?.user?.sub) {
      return null;
    }

    return ctx.user;
  },
);
