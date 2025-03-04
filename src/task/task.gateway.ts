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
import { TaskCreateResponseInterface, TaskUpdateResponseInterface } from './task.interface';

const EVENT_NAME_INFO = 'task-info';
const EVENT_NAME_LIST = 'task-list';
const EVENT_NAME_CREATE = 'task-list-create';
const EVENT_NAME_UPDATE = 'task-list-update';
const EVENT_NAME_DELETE = 'task-list-delete';
@WebSocketGateway(configuration().websocket.port, {
  cors: {
    origin: '*',
  },
})
@UseGuards(JwtAuthWsGuard)
@UseFilters(new WebSocketExceptionFilter())
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  // TODO: Improve: also save each user query, so can broadcast specific user query

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

    return client.emit(EVENT_NAME_INFO, {
      error: false,
      message: 'Connected',
      data: [],
    });
  }

  @SubscribeMessage('task')
  @UsePipes(new ValidationPipe())
  async findAll(@ConnectedSocket() client: Socket, @MessageBody() data: ListTaskDTO) {
    try {
      const tasks = await this.taskService.findAll(data);
      client.emit(EVENT_NAME_LIST, {
        error: false,
        message: 'Success',
        data: tasks,
      });
    } catch (error) {
      throw new WsException('Failed to fetch tasks: ' + error.message);
    }
  }

  async broadcastTasksList() {
    const tasks = await this.taskService.findAll({ per_page: 1000, page: 1 } as ListTaskDTO);

    this.server.emit(EVENT_NAME_LIST, {
      error: false,
      message: 'Success',
      data: tasks,
    });
  }

  async broadcastTaskCreated(task: TaskCreateResponseInterface) {
    this.server.emit(EVENT_NAME_CREATE, {
      error: false,
      message: 'Success',
      data: task,
    });
  }

  async broadcastTaskUpdate(task: TaskUpdateResponseInterface) {
    this.server.emit(EVENT_NAME_UPDATE, {
      error: false,
      message: 'Success',
      data: task,
    });
  }

  async broadcastTaskDelete({ id }: { id: string }) {
    this.server.emit(EVENT_NAME_DELETE, {
      error: false,
      message: 'Success',
      data: {
        id,
      },
    });
  }
}
