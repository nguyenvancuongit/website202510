import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CategoriesController,
  PublicCategoriesController,
} from './categories.controller';
import { OperationLogModule } from '../operation-logs/operation-log.module';

@Module({
  imports: [OperationLogModule],
  controllers: [CategoriesController, PublicCategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
