import { IsEnum } from 'class-validator';
import { RecruitmentPostTypeStatus } from '@prisma/client';

export class UpdateRecruitmentPostTypeStatusDto {
  @IsEnum(RecruitmentPostTypeStatus, { message: '状态值无效' })
  status: RecruitmentPostTypeStatus;
}