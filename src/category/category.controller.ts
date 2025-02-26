import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() data: CreateCategoryDTO) {
    return this.categoryService.create(data);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCategoryDTO) {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
