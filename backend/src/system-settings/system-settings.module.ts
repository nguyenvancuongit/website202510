import { Module } from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { SystemSettingsController, SystemSettingsPublicController } from './system-settings.controller';
import { PrismaModule } from '../database/prisma.module';
import { RedisCacheService } from 'src/cache/redis.service';
import { OperationLogModule } from '../operation-logs/operation-log.module';

@Module({
  imports: [PrismaModule, OperationLogModule],
  controllers: [SystemSettingsController, SystemSettingsPublicController],
  providers: [SystemSettingsService, RedisCacheService],
  exports: [SystemSettingsService],
})
export class SystemSettingsModule { }
