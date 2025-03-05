import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  BadRequestException, // Import BadRequestException
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, BadRequestException) // Catch both WsException and BadRequestException
export class WebSocketExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost) {
    const client: Socket = host.switchToWs().getClient();

    if (exception instanceof WsException) {
      client.emit('exception', {
        error: true,
        code: 500,
        message: exception.message,
        data: null,
      });
    } else if (exception instanceof BadRequestException) {
      client.emit('exception', {
        error: true,
        code: 400,
        message: (exception.getResponse() as { message: string[] }).message,
        data: null,
      });
    }
  }
}
