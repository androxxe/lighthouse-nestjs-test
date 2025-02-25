import { Priority } from '@prisma/client';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { IsForeignKeyExists } from '../../validator/is-foreign-key-exist.validator';

export class CreateTaskDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  due_date?: Date;

  @IsEnum(Priority)
  priority: Priority;

  @IsString()
  @IsOptional()
  @IsForeignKeyExists('projects', 'id')
  project_id?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @IsForeignKeyExists('categories', 'id', { each: true })
  category_ids?: string[];
}
