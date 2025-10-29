import { Module } from '@nestjs/common';
import { RecruitmentPostTypesService } from './recruitment-post-types.service';
import { RecruitmentPostTypesController, RecruitmentPostTypesPublicController } from './recruitment-post-types.controller';

@Module({
  controllers: [RecruitmentPostTypesController, RecruitmentPostTypesPublicController],
  providers: [RecruitmentPostTypesService],
  exports: [RecruitmentPostTypesService],
})
export class RecruitmentPostTypesModule {}