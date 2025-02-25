import { RequestUserInterface } from 'src/user/user.interface';
import { CreateTaskCategoryDTO } from './dto/create-task-category.dto';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { categories, task_comments } from '@prisma/client';
import { TaskCreateResponseInterface, TaskDetailResponseInterface, TaskListResponseInterface } from './task.interface';
import { ListTaskDTO } from './dto/list-task.dto';
import { DatatableInterface } from 'src/datatable/datatable.interface';
import { CreateTaskCommentDTO } from './dto/create-task-comment.dto';

export interface TaskServiceInterface {
  create(user: RequestUserInterface['user'], data: CreateTaskDTO): Promise<TaskCreateResponseInterface>;
  createComment(
    user: RequestUserInterface['user'],
    task_id: string,
    data: CreateTaskCommentDTO
  ): Promise<task_comments>;
  findAll(query: ListTaskDTO): Promise<DatatableInterface<TaskListResponseInterface>>;
  findOne(id: string): Promise<TaskDetailResponseInterface>;
  update(id: string, updateTaskDTO: UpdateTaskDTO): string;
  remove(id: string): string;
  createCategory(data: CreateTaskCategoryDTO): Promise<categories>;
}
