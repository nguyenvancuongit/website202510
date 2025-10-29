import { IsEnum } from 'class-validator';
import { RecruitmentPostStatus } from '@prisma/client';

export class UpdateRecruitmentPostStatusDto {
  @IsEnum(RecruitmentPostStatus, { message: '状态值无效' })
  status: RecruitmentPostStatus;
}
