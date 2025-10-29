import { Module } from '@nestjs/common';
import { RecruitmentPostsService } from './recruitment-posts.service';
import { RecruitmentPostsController, RecruitmentPostsPublicController } from './recruitment-posts.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecruitmentPostsController, RecruitmentPostsPublicController],
  providers: [RecruitmentPostsService],
  exports: [RecruitmentPostsService],
})
export class RecruitmentPostsModule {}
