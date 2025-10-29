import { Module } from '@nestjs/common';
import { OperationLogService } from './operation-log.service';
import { OperationLogController } from './operation-log.controller';
import { OperationLogBackupService } from './operation-log.cron.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OperationLogController],
  providers: [OperationLogService, OperationLogBackupService],
  exports: [OperationLogService, OperationLogBackupService],
})
export class OperationLogModule {}
