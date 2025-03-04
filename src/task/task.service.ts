import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskCategoryDTO } from './dto/create-task-category.dto';
import { Prisma, Status } from '@prisma/client';
import { RequestUserInterface } from 'src/user/user.interface';
import { TaskServiceInterface } from './task.service.interface';
import { ListTaskDTO } from './dto/list-task.dto';
import { CreateTaskCommentDTO } from './dto/create-task-comment.dto';
import { ListCommentDTO } from './dto/list-comment.dto';
import { generateMetaDatatable } from 'src/datatable/datatable.util';
import { FilterEnum } from './filter.enum';
import dayjs from 'dayjs';

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
        status: Status.Created,
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
                id: true,
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
        id: category.category.id,
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
      meta: generateMetaDatatable<ListCommentDTO>({
        page: query.page,
        per_page: query.per_page,
        total: total,
        query,
      }),
    };
  }

  async deleteComment(task_id: string, comment_id: string) {
    const check = await this.prismaService.task_comments.findUnique({
      where: {
        id: comment_id,
        task: {
          id: task_id,
        },
      },
    });

    if (!check) {
      throw new NotFoundException('Comment not found');
    }

    const task_comments = await this.prismaService.task_comments.delete({
      where: {
        id: comment_id,
        task: {
          id: task_id,
        },
      },
    });

    return !!task_comments;
  }

  async findAll(query: ListTaskDTO) {
    const queryFilter: Prisma.tasksWhereInput = {
      ...(query.filter && {
        due_date:
          query.filter === FilterEnum.today
            ? { gte: dayjs().startOf('day').toDate(), lte: dayjs().endOf('day').toDate() }
            : {
                gte: dayjs().add(1, 'day').startOf('day').toDate(),
              },
      }),
    };

    const queryProject: Prisma.tasksWhereInput = {
      ...(query.project_id && { project_id: query.project_id }),
    };

    const queryCategory: Prisma.tasksWhereInput = {
      ...(query.category_ids && {
        task_categories: {
          some: {
            category_id: {
              in: query.category_ids,
            },
          },
        },
      }),
    };

    const queryStatus: Prisma.tasksWhereInput = {
      ...(query.status && { status: query.status }),
    };

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
        where: { ...queryFilter, ...queryProject, ...queryCategory, ...queryStatus },
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
                  id: true,
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
          id: category.category.id,
          name: category.category.name,
        })),
        total_comment: task._count.task_comments,
      })),
      meta: generateMetaDatatable<ListTaskDTO>({
        page: query.page,
        per_page: query.per_page,
        total: total,
        query,
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
                id: true,
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
        id: category.category.id,
        name: category.category.name,
      })),
      total_comment: task._count.task_comments,
    };
  }

  async update(id: string, user: RequestUserInterface['user'], data: UpdateTaskDTO) {
    const old_task = await this.prismaService.tasks.findFirst({
      where: {
        id,
      },
    });

    if (!old_task) throw new NotFoundException('Task not found');

    const updated_task = await this.prismaService.tasks.update({
      where: {
        id,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.due_date && { due_date: data.due_date ? new Date(data.due_date) : null }),
        ...(data.priority && { priority: data.priority }),
        ...(data.project_id && { project_id: data.project_id }),
        ...(data.category_ids
          ? {
              task_categories: {
                deleteMany: {},
                createMany: {
                  data: data.category_ids.map((id) => ({ category_id: id })),
                },
              },
            }
          : undefined),
        ...(data.status && { status: data.status }),
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
                id: true,
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
      id: updated_task.id,
      name: updated_task.name,
      description: updated_task.description,
      due_date: updated_task.due_date,
      priority: updated_task.priority,
      status: updated_task.status,
      created_at: updated_task.created_at,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      project:
        updated_task.project && updated_task.project_id
          ? {
              id: updated_task.project_id,
              name: updated_task.project.name,
            }
          : null,
      task_categories: updated_task.task_categories.map((category) => ({
        id: category.category.id,
        name: category.category.name,
      })),
    };
  }

  async remove(id: string) {
    const check = await this.prismaService.tasks.findFirst({
      where: {
        id,
      },
    });

    if (!check) throw new NotFoundException('Task not found');

    const tasks = await this.prismaService.tasks.delete({
      where: {
        id,
      },
    });

    return !!tasks;
  }

  createCategory(data: CreateTaskCategoryDTO) {
    return this.prismaService.categories.create({
      data,
    });
  }
}
