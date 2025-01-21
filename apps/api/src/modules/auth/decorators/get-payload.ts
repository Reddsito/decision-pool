import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetPayload = createParamDecorator(
  (field, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const payload = req.user;

    if (!payload)
      throw new InternalServerErrorException(
        'Payload no encontrado en la request',
      );

    return !field ? payload : payload[field];
  },
);
