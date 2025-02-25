import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { CreateTaskCategoryDTO } from './dto/create-task-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestUserInterface } from 'src/user/user.interface';
import { ListTaskDTO } from './dto/list-task.dto';
import { CreateTaskCommentDTO } from './dto/create-task-comment.dto';
import { ListCommentDTO } from './dto/list-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('v1/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Request() req: RequestUserInterface, @Body() data: CreateTaskDTO) {
    return this.taskService.create(req.user, data);
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
    return this.taskService.getComment(task_id, query);
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
  update(@Param('task_id') task_id: string, @Body() updateTaskDTO: UpdateTaskDTO) {
    return this.taskService.update(task_id, updateTaskDTO);
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
