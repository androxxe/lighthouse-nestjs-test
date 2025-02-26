import { projects } from '@prisma/client';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';

export interface ProjectServiceInterface {
  create(data: CreateProjectDTO): Promise<Pick<projects, 'id' | 'name'>>;
  findAll(): Promise<Pick<projects, 'id' | 'name'>[]>;
  update(id: string, data: UpdateProjectDTO): Promise<Pick<projects, 'id' | 'name'>>;
  remove(id: string): Promise<Pick<projects, 'id' | 'name'>>;
}
