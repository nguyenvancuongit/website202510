import { Module } from '@nestjs/common';
import { CorporateHonorsService } from './corporate-honors.service';
import {
  CorporateHonorsController,
  PublicCorporateHonorsController,
} from './corporate-honors.controller';
import { PrismaModule } from '../database/prisma.module';
import { MediasModule } from '../medias/medias.module';
import { OperationLogModule } from '../operation-logs/operation-log.module';

@Module({
  imports: [PrismaModule, MediasModule, OperationLogModule],
  controllers: [CorporateHonorsController, PublicCorporateHonorsController],
  providers: [CorporateHonorsService],
})
export class CorporateHonorsModule {}
