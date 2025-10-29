import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { MediaService } from './medias.service';
import { LocalStorageService } from './local-storage.service';
import { MediasController } from './medias.controller';

@Module({
  imports: [PrismaModule],
  providers: [MediaService, LocalStorageService],
  controllers: [MediasController],
  exports: [MediaService],
})
export class MediasModule {}
