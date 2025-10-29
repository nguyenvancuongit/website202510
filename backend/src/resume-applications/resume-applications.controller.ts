import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ResumeApplicationsService } from './resume-applications.service';
import { CreateResumeApplicationDto } from './dto/create-resume-application.dto';
import { FindAllResumeApplicationsDto } from './dto/find-all-resume-applications.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { appConfig } from '../common/config';

@Controller('resume-applications')
@UseGuards(JwtAuthGuard)
export class ResumeApplicationsController {
  constructor(private readonly resumeApplicationsService: ResumeApplicationsService) { }

  @Get()
  async findAll(@Query() query: FindAllResumeApplicationsDto) {
    return this.resumeApplicationsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.resumeApplicationsService.findOne(id);
  }

  @Get(':id/download')
  async downloadResume(@Param('id') id: string, @Res() res: Response) {
    return this.resumeApplicationsService.downloadResume(id, res);
  }

  @Post('export')
  async exportApplications(@Body() body: { ids?: string[] }, @Res() res: Response) {
    return this.resumeApplicationsService.exportApplications(body.ids, res);
  }
}

@Controller('public/resume-applications')
export class ResumeApplicationsPublicController {
  constructor(private readonly resumeApplicationsService: ResumeApplicationsService) { }

  @Post()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 300000, limit: 5 } }) // 5 submissions per 5 minutes
  @UseInterceptors(FileInterceptor('resume', appConfig.getResumeMulterConfig()))
  @UsePipes(new ValidationPipe({ transform: true }))
  async submitApplication(
    @Body() createDto: CreateResumeApplicationDto,
    @UploadedFile() resumeFile?: Express.Multer.File,
  ) {
    if (!resumeFile) {
      throw new BadRequestException('请上传简历文件');
    }

    return await this.resumeApplicationsService.submitApplication(createDto, resumeFile);
  }
}
