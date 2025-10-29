import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './medias.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { appConfig } from '../common/config';

@Controller('admin/medias')
@UseGuards(JwtAuthGuard)
export class MediasController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.mediaService.findAll(BigInt(user.id));
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, appConfig.getMulterConfig('medias')),
  )
  async uploadMultiple(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return this.mediaService.uploadMultiple(files, BigInt(user.id));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mediaService.delete(BigInt(id));
  }
}
