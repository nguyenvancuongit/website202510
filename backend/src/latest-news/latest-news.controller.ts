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
  Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { LatestNewsService } from './latest-news.service';
import { CreateLatestNewsDto } from './dto/create-latest-news.dto';
import { UpdateLatestNewsDto } from './dto/update-latest-news.dto';
import { QueryLatestNewsDto } from './dto/query-latest-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LatestNewStatus } from '@prisma/client';
import { appConfig } from '../common/config';
import { publicApiThrottler } from '../common/config/throttler.config';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Permission } from 'src/users/constants';
import { type AuthUser, CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('latest-news')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.MANAGE_LATEST_NEWS)
export class LatestNewsController {
  constructor(private readonly latestNewsService: LatestNewsService) {}

  // ============================================================================
  // ADMIN (Protected)
  // ============================================================================

  @Get()
  async findAll(@Query() query: QueryLatestNewsDto) {
    return await this.latestNewsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.latestNewsService.findOne(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.latestNewsService.findBySlug(slug);
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
      ],
      appConfig.getMulterConfig('latest-news'),
    ),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createLatestNewsDto: CreateLatestNewsDto,
    @UploadedFiles()
    files: {
      webThumbnail: Express.Multer.File[];
      mobileThumbnail: Express.Multer.File[];
    },
    @CurrentUser() user: AuthUser,
  ) {
    if (!files?.webThumbnail?.[0]) {
      throw new BadRequestException('Web端缩略图文件是必填项');
    }

    if (!files?.mobileThumbnail?.[0]) {
      throw new BadRequestException('移动端缩略图文件是必填项');
    }

    return await this.latestNewsService.create(
      createLatestNewsDto,
      {
        webThumbnail: files.webThumbnail[0],
        mobileThumbnail: files.mobileThumbnail[0],
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
      ],
      appConfig.getMulterConfig('latest-news'),
    ),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLatestNewsDto: UpdateLatestNewsDto,
    @CurrentUser() user: AuthUser,
    @UploadedFiles()
    files?: {
      webThumbnail?: Express.Multer.File[];
      mobileThumbnail?: Express.Multer.File[];
    },
  ) {
    return await this.latestNewsService.update(
      id,
      updateLatestNewsDto,
      {
        webThumbnail: files?.webThumbnail?.[0],
        mobileThumbnail: files?.mobileThumbnail?.[0],
      },
      user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    await this.latestNewsService.remove(id, user.id);
  }

  @Patch(':id/toggle-featured')
  async toggleFeatured(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return await this.latestNewsService.toggleFeatured(id, user.id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: LatestNewStatus,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.latestNewsService.updateStatus(id, status, user.id);
  }
}

// Public endpoints for landing page
@Controller('public/latest-news')
export class LatestNewsPublicController {
  constructor(private readonly latestNewsService: LatestNewsService) {}

  // 1) Get detail by slug
  @Get('slug/:slug')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async getDetailBySlug(@Param('slug') slug: string) {
    return await this.latestNewsService.findBySlug(slug);
  }

  // 2) List published with optional category, sorted by featured desc then createdAt desc, with pagination
  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async listPublic(@Query() query: QueryLatestNewsDto) {
    return await this.latestNewsService.findPublicAll(query);
  }

  @Get('latest-news-per-category')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async groupByCategory() {
    return await this.latestNewsService.groupByCategory();
  }

  @Get('seo/:slug')
  async getSeoData(@Param('slug') slug: string) {
    return await this.latestNewsService.getSeoData(slug);
  }
}
