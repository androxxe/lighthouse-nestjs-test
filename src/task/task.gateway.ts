import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { TaskService } from './task.service';
import { ListTaskDTO } from './dto/list-task.dto';
import configuration from '../../config/configuration';
import { Socket, Server } from 'socket.io';
import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { JwtAuthWsGuard } from 'src/auth/jwt-auth-ws/jwt-auth-ws.guard';
import { WebSocketExceptionFilter } from '../ws.exception.filter';

const EVENT_NAME = 'task-list';
@WebSocketGateway(configuration().websocket.port, {
  cors: {
    origin: '*',
  },
})
@UseGuards(JwtAuthWsGuard)
@UseFilters(new WebSocketExceptionFilter())
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(private readonly taskService: TaskService) {}
  @WebSocketServer() server: Server;

  afterInit() {
    Logger.debug('[Websocket] Init');
  }

  handleDisconnect(client: Socket) {
    Logger.debug('[Websocket] User disconnected', client.id);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    Logger.debug('[Websocket] Connected', client.id);

    return client.emit(EVENT_NAME, {
      error: false,
      message: 'Connected',
      data: [],
    });
  }

  @SubscribeMessage('task')
  @UsePipes(new ValidationPipe())
  async findAll(@MessageBody() data: ListTaskDTO) {
    try {
      const tasks = await this.taskService.findAll(data);
      this.server.emit(EVENT_NAME, {
        error: false,
        message: 'Success',
        data: tasks,
      });
    } catch (error) {
      throw new WsException('Failed to fetch tasks: ' + error.message);
    }
  }

  async broadcastTasksUpdate() {
    const tasks = await this.taskService.findAll({ per_page: 1000, page: 1 } as ListTaskDTO);

    this.server.emit(EVENT_NAME, {
      error: false,
      message: 'Success',
      data: tasks,
    });
  }
}
