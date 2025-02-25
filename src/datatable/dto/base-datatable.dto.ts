import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseDataTableDTO {
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'page must be number' }
  )
  @Type(() => Number)
  page: number;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'per_page must be number' }
  )
  @Type(() => Number)
  per_page: number;

  @IsString()
  @IsOptional()
  sortBy: string;

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sort: string;

  @IsString()
  @IsOptional()
  search: string;
}
