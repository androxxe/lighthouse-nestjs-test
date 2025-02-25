import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { CreateTaskCategoryDTO } from './dto/create-task-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestUserInterface } from 'src/user/user.interface';

@UseGuards(JwtAuthGuard)
@Controller('v1/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Request() req: RequestUserInterface, @Body() createTaskDTO: CreateTaskDTO) {
    return this.taskService.create(req.user, createTaskDTO);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDTO: UpdateTaskDTO) {
    return this.taskService.update(+id, updateTaskDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }

  @Post('category')
  createCategory(@Body() createTaskCategoryDTO: CreateTaskCategoryDTO) {
    return this.taskService.createCategory(createTaskCategoryDTO);
  }
}
