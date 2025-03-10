import { RequestUserInterface } from 'src/user/user.interface';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { task_comments } from '@prisma/client';
import {
  TaskCommentListResponseInterface,
  TaskCreateResponseInterface,
  TaskDeleteResponseInterface,
  TaskDetailResponseInterface,
  TaskListResponseInterface,
  TaskUpdateResponseInterface,
} from './task.interface';
import { ListTaskDTO } from './dto/list-task.dto';
import { DatatableInterface } from 'src/datatable/datatable.interface';
import { CreateTaskCommentDTO } from './dto/create-task-comment.dto';
import { ListCommentDTO } from './dto/list-comment.dto';

export interface TaskServiceInterface {
  create(user: RequestUserInterface['user'], data: CreateTaskDTO): Promise<TaskCreateResponseInterface>;
  createComment(
    user: RequestUserInterface['user'],
    task_id: string,
    data: CreateTaskCommentDTO
  ): Promise<task_comments>;
  findAllComment: (
    task_id: string,
    query: ListCommentDTO
  ) => Promise<DatatableInterface<TaskCommentListResponseInterface, ListCommentDTO>>;
  removeComment(task_id: string, comment_id: string): Promise<boolean>;
  findAll(query: ListTaskDTO): Promise<DatatableInterface<TaskListResponseInterface, ListTaskDTO>>;
  findOne(id: string): Promise<TaskDetailResponseInterface>;
  update(id: string, user: RequestUserInterface['user'], data: UpdateTaskDTO): Promise<TaskUpdateResponseInterface>;
  remove(id: string): Promise<TaskDeleteResponseInterface>;
}
