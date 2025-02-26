import { categories } from '@prisma/client';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

export interface CategoryServiceInterface {
  create(data: CreateCategoryDTO): Promise<Pick<categories, 'id' | 'name'>>;
  findAll(): Promise<Pick<categories, 'id' | 'name'>[]>;
  update(id: string, data: UpdateCategoryDTO): Promise<Pick<categories, 'id' | 'name'>>;
  remove(id: string): Promise<Pick<categories, 'id' | 'name'>>;
}
