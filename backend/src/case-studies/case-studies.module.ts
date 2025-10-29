import { Module } from '@nestjs/common';
import { CaseStudiesService } from './case-studies.service';
import {
  CaseStudiesController,
  CaseStudiesPublicController,
} from './case-studies.controller';
import { PrismaModule } from '../database/prisma.module';
import { MediasModule } from '../medias/medias.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { OperationLogModule } from '../operation-logs/operation-log.module';

@Module({
  imports: [PrismaModule, MediasModule, CategoriesModule, OperationLogModule],
  controllers: [CaseStudiesController, CaseStudiesPublicController],
  providers: [CaseStudiesService],
  exports: [CaseStudiesService],
})
export class CaseStudiesModule {}
