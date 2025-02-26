import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskCategoryDTO } from './dto/create-task-category.dto';
import { Status } from '@prisma/client';
import { RequestUserInterface } from 'src/user/user.interface';
import { TaskServiceInterface } from './task.service.interface';
import { ListTaskDTO } from './dto/list-task.dto';
import { CreateTaskCommentDTO } from './dto/create-task-comment.dto';
import { ListCommentDTO } from './dto/list-comment.dto';
import { generateMetaDatatable } from 'src/datatable/datatable.util';

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

  async createComment(user: RequestUserInterface['user'], task_id: string, data: CreateTaskCommentDTO) {
    const task = await this.prismaService.tasks.findUnique({
      where: { id: task_id },
    });

    if (!task) throw new NotFoundException();

    return this.prismaService.task_comments.create({
      data: {
        comment: data.comment,
        task: {
          connect: {
            id: task_id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async findAllComment(task_id: string, query: ListCommentDTO) {
    const [data, total] = await Promise.all([
      this.prismaService.task_comments.findMany({
        where: {
          task: {
            id: task_id,
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: (query.page - 1) * query.per_page,
        take: query.per_page,
        select: {
          id: true,
          comment: true,
          created_at: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prismaService.task_comments.count(),
    ]);

    return {
      data: data.map((comment) => ({
        id: comment.id,
        comment: comment.comment,
        created_at: comment.created_at,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          email: comment.user.email,
        },
      })),
      meta: generateMetaDatatable({
        page: query.page,
        per_page: query.per_page,
        total: total,
      }),
    };
  }

  async findAll(query: ListTaskDTO) {
    const [data, total] = await Promise.all([
      this.prismaService.tasks.findMany({
        skip: (query.page - 1) * query.per_page,
        take: query.per_page,
        ...(query.sortBy
          ? {
              orderBy: {
                [query.sortBy]: query.sort,
              },
            }
          : undefined),
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
          _count: {
            select: {
              task_comments: true,
            },
          },
        },
      }),
      this.prismaService.tasks.count(),
    ]);

    return {
      data: data.map((task) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        due_date: task.due_date,
        priority: task.priority,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
        user: {
          id: task.user.id,
          name: task.user.name,
          email: task.user.email,
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
        total_comment: task._count.task_comments,
      })),
      meta: generateMetaDatatable({
        page: query.page,
        per_page: query.per_page,
        total: total,
      }),
    };
  }

  async findOne(id: string) {
    const task = await this.prismaService.tasks.findFirst({
      where: {
        id,
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
        _count: {
          select: {
            task_comments: true,
          },
        },
      },
    });

    if (!task) throw new NotFoundException('Task not found');

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
        id: task.user.id,
        name: task.user.name,
        email: task.user.email,
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
      total_comment: task._count.task_comments,
    };
  }

  update(id: string, updateTaskDTO: UpdateTaskDTO) {
    return `This action updates a #${id} task`;
  }

  remove(id: string) {
    return `This action removes a #${id} task`;
  }

  createCategory(data: CreateTaskCategoryDTO) {
    return this.prismaService.categories.create({
      data,
    });
  }
}
