import { IsOptional, IsString, IsEnum, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';
import { RecruitmentPostStatus, JobType } from '@prisma/client';

export class FindAllRecruitmentPostsDto {
  @IsOptional()
  @IsString()
  job_title?: string;

  @IsOptional()
  @IsNumberString()
  recruitment_post_type_id?: string;

  @IsOptional()
  @IsEnum(JobType)
  job_type?: JobType;

  @IsOptional()
  @IsEnum(RecruitmentPostStatus)
  status?: RecruitmentPostStatus;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value || '1')
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value || '10')
  limit?: string = '10';
}
