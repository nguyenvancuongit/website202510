import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateCaseStudyDto } from './create-case-study.dto';

export class UpdateCaseStudyDto extends PartialType(CreateCaseStudyDto) {
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  removeWebThumbnail?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  removeMobileThumbnail?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  removeCustomerLogo?: boolean;
}
