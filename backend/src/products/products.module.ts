import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ProductsController,
  ProductsPublicController,
} from './products.controller';
import { PrismaModule } from '../database/prisma.module';
import { MediasModule } from '../medias/medias.module';

@Module({
  imports: [PrismaModule, MediasModule],
  controllers: [ProductsController, ProductsPublicController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
