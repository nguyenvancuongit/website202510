import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { CategoryStatus } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsEnum(CategoryStatus)
  @IsOptional()
  status?: CategoryStatus;
}
