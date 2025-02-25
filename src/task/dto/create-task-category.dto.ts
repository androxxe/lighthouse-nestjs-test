import { IsString } from 'class-validator';

export class CreateTaskCategoryDTO {
  @IsString()
  name: string;
}
