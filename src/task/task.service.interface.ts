import { RequestUserInterface } from 'src/user/user.interface';
import { CreateTaskCategoryDTO } from './dto/create-task-category.dto';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { categories, projects, tasks } from '@prisma/client';

export interface TaskCreateResponseInterface extends Omit<tasks, 'user_id' | 'project_id'> {
  user: {
    id: string;
    name: string;
    email: string;
  };
  project: Pick<projects, 'id' | 'name'> | null;
  task_categories: Array<{
    id: string;
    name: string;
  }>;
}

export interface TaskServiceInterface {
  create(user: RequestUserInterface['user'], data: CreateTaskDTO): Promise<TaskCreateResponseInterface>;
  findAll(): string;
  findOne(id: number): string;
  update(id: number, updateTaskDTO: UpdateTaskDTO): string;
  remove(id: number): string;
  createCategory(data: CreateTaskCategoryDTO): Promise<categories>;
}
