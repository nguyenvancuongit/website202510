import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CaseStudiesService } from './case-studies.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
import { QueryCaseStudyDto } from './dto/query-case-study.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CaseStudyStatus } from '@prisma/client';
import { appConfig } from '../common/config';
import { CASE_STUDY_STATUS } from '../common/config/constants';
import { publicApiThrottler } from '../common/config/throttler.config';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permission } from 'src/users/constants';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { type AuthUser, CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('case-studies')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.MANAGE_CASE_STUDIES)
export class CaseStudiesController {
  constructor(private readonly caseStudiesService: CaseStudiesService) { }

  // ============================================================================
  // ADMIN (Protected)
  // ============================================================================

  @Get()
  async findAll(@Query() query: QueryCaseStudyDto) {
    return await this.caseStudiesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.caseStudiesService.findOne(id);
  }

  // ============================================================================
  // PRIVATE ENDPOINTS (Authentication Required)
  // ============================================================================

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'webThumbnail', maxCount: 1 },
        { name: 'mobileThumbnail', maxCount: 1 },
        { name: 'customerLogo', maxCount: 1 },
      ],
      appConfig.getMulterConfig('case-studies'),
    ),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCaseStudyDto: CreateCaseStudyDto,
    @UploadedFiles()
    files: {
      webThumbnail: Express.Multer.File[];
      mobileThumbnail: Express.Multer.File[];
      customerLogo?: Express.Multer.File[];
    },
    @CurrentUser() user: AuthUser,
  ) {
    // Only require files if status is not draft
    if (
      createCaseStudyDto.status &&
      createCaseStudyDto.status !== CASE_STUDY_STATUS.DRAFT
    ) {
      if (!files?.webThumbnail?.[0]) {
        throw new BadRequestException('Web端缩略图文件是必填项');
      }

      if (!files?.mobileThumbnail?.[0]) {
        throw new BadRequestException('移动端缩略图文件是必填项');
      }
    }

    return await this.caseStudiesService.create(
      createCaseStudyDto,
      {
        webThumbnail: files?.webThumbnail?.[0],
        mobileThumbnail: files?.mobileThumbnail?.[0],
        customerLogo: files?.customerLogo?.[0],
      },
      user.id,
    );
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'webThumbnail', maxCount: 1 },
        { name: 'mobileThumbnail', maxCount: 1 },
        { name: 'customerLogo', maxCount: 1 },
      ],
      appConfig.getMulterConfig('case-studies'),
    ),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCaseStudyDto: UpdateCaseStudyDto,
    @CurrentUser() user: AuthUser,
    @UploadedFiles()
    files?: {
      webThumbnail?: Express.Multer.File[];
      mobileThumbnail?: Express.Multer.File[];
      customerLogo?: Express.Multer.File[];
    },
  ) {
    return await this.caseStudiesService.update(
      id,
      updateCaseStudyDto,
      {
        webThumbnail: files?.webThumbnail?.[0],
        mobileThumbnail: files?.mobileThumbnail?.[0],
        customerLogo: files?.customerLogo?.[0],
      },
      user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    await this.caseStudiesService.remove(id, user.id);
  }

  @Patch(':id/toggle-featured')
  async toggleFeatured(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return await this.caseStudiesService.toggleFeatured(id, user.id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: CaseStudyStatus,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.caseStudiesService.updateStatus(id, status, user.id);
  }
}

// Public controller for landing page
@Controller('public/case-studies')
export class CaseStudiesPublicController {
  constructor(private readonly caseStudiesService: CaseStudiesService) { }

  // 1) Get detail by slug
  @Get('slug/:slug')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async getDetailBySlug(@Param('slug') slug: string) {
    const data = await this.caseStudiesService.findBySlug(slug);
    return data;
  }

  // 2) List published with optional category, sorted by featured desc, createdAt desc, with pagination
  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async listPublic(@Query() query: QueryCaseStudyDto) {
    const data = await this.caseStudiesService.findPublicAll(query);
    return data; // { data, pagination }
  }
}
