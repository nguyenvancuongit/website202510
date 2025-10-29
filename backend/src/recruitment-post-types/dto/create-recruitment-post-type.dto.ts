import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { RecruitmentPostTypeStatus } from '@prisma/client';

export class CreateRecruitmentPostTypeDto {
  @IsNotEmpty({ message: '职位类型名称不能为空' })
  @IsString({ message: '职位类型名称必须是字符串' })
  @MaxLength(255, { message: '职位类型名称不能超过255个字符' })
  name: string;

  @IsOptional()
  @IsEnum(RecruitmentPostTypeStatus, { message: '状态值无效' })
  status?: RecruitmentPostTypeStatus;
}