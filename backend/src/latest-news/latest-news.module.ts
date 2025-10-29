import { Module } from '@nestjs/common';
import { LatestNewsService } from './latest-news.service';
import {
  LatestNewsController,
  LatestNewsPublicController,
} from './latest-news.controller';
import { PrismaModule } from '../database/prisma.module';
import { MediasModule } from '../medias/medias.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { OperationLogModule } from '../operation-logs/operation-log.module';

@Module({
  imports: [PrismaModule, MediasModule, CategoriesModule, OperationLogModule],
  controllers: [LatestNewsController, LatestNewsPublicController],
  providers: [LatestNewsService],
  exports: [LatestNewsService],
})
export class LatestNewsModule {}
