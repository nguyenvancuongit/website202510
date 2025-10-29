import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { appConfig } from '../common/config';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('uploads')
export class UploadsController {
  @Post('images')
  @UseInterceptors(FileInterceptor('image', appConfig.getMulterConfig('image')))
  @UseGuards(JwtAuthGuard)
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = `${appConfig.uploadConfig.host}/uploads/images/${file.filename}`;

    return {
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
      },
    };
  }

  @Post('videos')
  @UseInterceptors(FileInterceptor('video', appConfig.getMulterConfig('video')))
  @UseGuards(JwtAuthGuard)
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No video file uploaded');
    }

    const videoUrl = `${appConfig.uploadConfig.host}/uploads/videos/${file.filename}`;

    return {
      message: 'Video uploaded successfully',
      data: {
        url: videoUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        duration: null, // Can be added later with video processing
      },
    };
  }
}
