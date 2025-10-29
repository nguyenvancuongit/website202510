import { Module } from '@nestjs/common';
import { FriendLinksService } from './friend-links.service';
import {
  FriendLinksController,
  FriendLinksPublicController,
} from './friend-links.controller';
import { RedisCacheService } from '../cache/redis.service';
import { OperationLogModule } from '../operation-logs/operation-log.module';

@Module({
  imports: [OperationLogModule],
  controllers: [FriendLinksController, FriendLinksPublicController],
  providers: [FriendLinksService, RedisCacheService],
  exports: [FriendLinksService],
})
export class FriendLinksModule {}
