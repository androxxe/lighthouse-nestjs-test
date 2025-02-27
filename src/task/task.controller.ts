import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { CreateTaskCategoryDTO } from './dto/create-task-category.dto';
import { RequestUserInterface } from 'src/user/user.interface';
import { ListTaskDTO } from './dto/list-task.dto';
import { CreateTaskCommentDTO } from './dto/create-task-comment.dto';
import { ListCommentDTO } from './dto/list-comment.dto';
import { TaskGateway } from './task.gateway';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('v1/task')
export class TaskController {
  constructor(private readonly taskService: TaskService, private readonly taskGateway: TaskGateway) {}

  @Post()
  async create(@Request() req: RequestUserInterface, @Body() data: CreateTaskDTO) {
    const task = await this.taskService.create(req.user, data);
    this.taskGateway.broadcastTasksUpdate();

    return task;
  }

  @Post(':task_id/comment')
  async createComment(
    @Param('task_id') task_id: string,
    @Request() req: RequestUserInterface,
    @Body() data: CreateTaskCommentDTO
  ) {
    await this.taskService.createComment(req.user, task_id, data);

    return {
      message: 'Comment created successfully',
    };
  }

  @Get(':task_id/comment')
  comment(@Param('task_id') task_id: string, @Query() query: ListCommentDTO) {
    return this.taskService.findAllComment(task_id, query);
  }

  @Delete(':task_id/comment/:comment_id')
  async deleteComment(@Param('task_id') task_id: string, @Param('comment_id') comment_id: string) {
    await this.taskService.deleteComment(task_id, comment_id);

    return {
      message: 'Comment deleted successfully',
    };
  }

  @Get()
  findAll(@Query() query: ListTaskDTO) {
    return this.taskService.findAll(query);
  }

  @Get(':task_id')
  findOne(@Param('task_id') task_id: string) {
    return this.taskService.findOne(task_id);
  }

  @Patch(':task_id')
  update(@Param('task_id') task_id: string, @Body() data: UpdateTaskDTO, @Request() req: RequestUserInterface) {
    return this.taskService.update(task_id, req.user, data);
  }

  @Delete(':task_id')
  remove(@Param('task_id') task_id: string) {
    return this.taskService.remove(task_id);
  }

  @Post('category')
  createCategory(@Body() createTaskCategoryDTO: CreateTaskCategoryDTO) {
    return this.taskService.createCategory(createTaskCategoryDTO);
  }
}
