import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UploadsController],
})
export class UploadsModule {}
