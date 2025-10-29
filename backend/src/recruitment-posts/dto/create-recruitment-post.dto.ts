import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, IsInt } from 'class-validator';
import { RecruitmentPostStatus, JobType } from '@prisma/client';

export class CreateRecruitmentPostDto {
  @IsNotEmpty({ message: '职位名称不能为空' })
  @IsString({ message: '职位名称必须是字符串' })
  @MaxLength(255, { message: '职位名称不能超过255个字符' })
  job_title: string;

  @IsNotEmpty({ message: '职位详情不能为空' })
  @IsString({ message: '职位详情必须是字符串' })
  job_description: string;

  @IsNotEmpty({ message: '职位类型不能为空' })
  @IsInt({ message: '职位类型必须是数字' })
  recruitment_post_type_id: number;

  @IsOptional()
  @IsEnum(JobType, { message: '职位性质值无效' })
  job_type?: JobType;

  @IsOptional()
  @IsEnum(RecruitmentPostStatus, { message: '状态值无效' })
  status?: RecruitmentPostStatus;
}
