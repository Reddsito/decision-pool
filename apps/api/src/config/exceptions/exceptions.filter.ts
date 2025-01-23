import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { Socket } from 'socket.io';
import { SocketWithAuth } from 'src/socket/types/socket-auth.type';
import {
  WsBadRequestException,
  WsTypeException,
  WsUnknownException,
} from './ws-exception';

// Filtro para HttpException
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    this.logger.error(`HTTP Exception: ${message}`, exception.stack);

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.name,
    });
  }
}

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const socket: SocketWithAuth = host.switchToWs().getClient();

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();
      const exceptionMessage =
        exceptionData['message'] ?? exceptionData ?? exception.name;

      const wsException = new WsBadRequestException(exceptionMessage);
      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof WsTypeException) {
      socket.emit('exception', exception.getError());
      return;
    }

    const wsException = new WsUnknownException(exception.message);
    socket.emit('exception', wsException.getError());
  }
}

@Catch(Error)
export class GeneralExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GeneralExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const message = exception.message;

    this.logger.error(`General Exception: ${message}`, exception.stack);

    if (host.getType() === 'http') {
      const response = host.switchToHttp().getResponse<Response>();
      response.status(500).json({
        statusCode: 500,
        message,
        error: exception.name,
      });
    }

    if (host.getType() === 'ws') {
      const client = host.switchToWs().getClient<Socket>();
      client.emit('error', { message, stack: exception.stack });
    }
  }
}
