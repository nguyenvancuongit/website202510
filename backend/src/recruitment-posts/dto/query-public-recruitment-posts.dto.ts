import { IsOptional, IsString, IsEnum, IsNumberString, IsArray, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { JobType } from '@prisma/client';

export class QueryPublicRecruitmentPostsDto {
  @IsOptional()
  @IsString()
  job_title?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return value.split(',').map((type: string) => type.trim());
  })
  @IsEnum(JobType, { each: true })
  job_type?: JobType[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return value.split(',').map((id: any) => parseInt(id.trim())).filter((id: any) => !isNaN(id));
  })
  recruitment_post_type_ids?: number[];

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value || '1')
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value || '10')
  limit?: string = '10';
}

export class QueryRelatedPostsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value) || 4)
  limit?: number = 4;
}
