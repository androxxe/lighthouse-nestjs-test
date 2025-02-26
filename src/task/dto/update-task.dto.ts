import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDTO } from './create-task.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {
  @IsEnum(Status)
  @IsOptional()
  status: Status;
}
