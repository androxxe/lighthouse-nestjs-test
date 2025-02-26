import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseDataTableDTO } from 'src/datatable/dto/base-datatable.dto';
import { FilterEnum } from '../filter.enum';
import { IsForeignKeyExists } from 'src/validator/is-foreign-key-exist.validator';

export class ListTaskDTO extends BaseDataTableDTO {
  @IsEnum(FilterEnum)
  @IsOptional()
  filter: FilterEnum;

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
