import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import {
  BannersController,
  BannersPublicController,
} from './banners.controller';
import { UploadsModule } from 'src/uploads/uploads.module';
import { MediasModule } from 'src/medias/medias.module';
import { OperationLogModule } from '../operation-logs/operation-log.module';
import { RedisCacheService } from 'src/cache/redis.service';

@Module({
  controllers: [BannersController, BannersPublicController],
  providers: [BannersService, RedisCacheService],
  exports: [BannersService],
  imports: [UploadsModule, MediasModule, OperationLogModule],
})
export class BannersModule {}
