import { IsString } from 'class-validator';

export class CreateTaskCommentDTO {
  @IsString()
  comment: string;
}
