import { Injectable } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskCategoryDTO } from './dto/create-task-category.dto';
import { Status } from '@prisma/client';
import { RequestUserInterface } from 'src/user/user.interface';
import { TaskServiceInterface } from './task.service.interface';

@Injectable()
export class TaskService implements TaskServiceInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: RequestUserInterface['user'], data: CreateTaskDTO) {
    const task = await this.prismaService.tasks.create({
      data: {
        user_id: user.id,
        name: data.name,
        description: data.description,
        due_date: data.due_date ? new Date(data.due_date) : null,
        priority: data.priority,
        project_id: data?.project_id,
        status: Status.Pending,
        task_categories: data.category_ids
          ? {
              createMany: {
                data: data.category_ids.map((id) => ({ category_id: id })),
              },
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        description: true,
        due_date: true,
        priority: true,
        status: true,
        created_at: true,
        updated_at: true,
        project_id: true,
        task_categories: {
          select: {
            id: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
            name: true,
            id: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      id: task.id,
      name: task.name,
      description: task.description,
      due_date: task.due_date,
      priority: task.priority,
      status: task.status,
      created_at: task.created_at,
      updated_at: task.updated_at,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      project:
        task.project && task.project_id
          ? {
              id: task.project_id,
              name: task.project.name,
            }
          : null,
      task_categories: task.task_categories.map((category) => ({
        id: category.id,
        name: category.category.name,
      })),
    };
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDTO: UpdateTaskDTO) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  createCategory(data: CreateTaskCategoryDTO) {
    return this.prismaService.categories.create({
      data,
    });
  }
}
