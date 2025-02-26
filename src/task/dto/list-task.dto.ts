import { IsEnum, IsOptional } from 'class-validator';
import { BaseDataTableDTO } from 'src/datatable/dto/base-datatable.dto';
import { FilterEnum } from '../filter.enum';

export class ListTaskDTO extends BaseDataTableDTO {
  @IsEnum(FilterEnum)
  @IsOptional()
  filter: FilterEnum;
}
