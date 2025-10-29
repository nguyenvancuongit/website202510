import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
  HttpCode,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateBannerOrderDto } from './dto/update-banner-order.dto';
import { QueryBannersDto } from './dto/query-banners.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { appConfig } from '../common/config';
import { publicApiThrottler } from '../common/config/throttler.config';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Permission } from 'src/users/constants';
import { type AuthUser, CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('banners')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.MANAGE_BANNERS)
export class BannersController {
  constructor(private readonly bannersService: BannersService) { }

  @Get()
  async findAll(@Query() query: QueryBannersDto) {
    const result = await this.bannersService.findAll(query);
    return {
      message: 'Banner列表获取成功',
      ...result, // This will include both data and pagination
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const result = await this.bannersService.findOne(BigInt(id));
    return {
      message: 'Banner详情获取成功',
      data: result,
    };
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'webMedia', maxCount: 1 },
        { name: 'mobileMedia', maxCount: 1 },
      ],
      appConfig.getMulterConfig('banner'),
    ),
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFiles()
    files: {
      webMedia?: Express.Multer.File[];
      mobileMedia?: Express.Multer.File[];
    },
    @Body() createBannerDto: CreateBannerDto,
    @CurrentUser() user: AuthUser,
  ) {
    if (!files?.webMedia?.[0]) {
      throw new BadRequestException('Web端图片文件是必填项');
    }

    if (!files?.mobileMedia?.[0]) {
      throw new BadRequestException('移动端图片文件是必填项');
    }

    const result = await this.bannersService.create(
      createBannerDto,
      files.webMedia[0],
      files.mobileMedia[0],
      user.id,
    );
    return {
      message: 'Banner创建成功',
      data: result,
    };
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'webMedia', maxCount: 1 },
        { name: 'mobileMedia', maxCount: 1 },
      ],
      appConfig.getMulterConfig('banner'),
    ),
  )
  async update(
    @Param('id', ParseIntPipe) id: string,
    @UploadedFiles()
    files: {
      webMedia?: Express.Multer.File[];
      mobileMedia?: Express.Multer.File[];
    },
    @Body() updateBannerDto: UpdateBannerDto,
    @CurrentUser() user: AuthUser,
  ) {
    const result = await this.bannersService.update(
      BigInt(id),
      updateBannerDto,
      {
        webMedia: files?.webMedia?.[0],
        mobileMedia: files?.mobileMedia?.[0],
      },
      user.id,
    );
    return {
      message: 'Banner更新成功',
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: string, @CurrentUser() user: AuthUser) {
    await this.bannersService.remove(BigInt(id), user.id);
    return {
      message: 'Banner删除成功',
    };
  }

  @Put('reorder')
  async updateOrder(
    @Body() updateBannerOrderDto: UpdateBannerOrderDto,
    @CurrentUser() user: AuthUser,
  ) {
    const result = await this.bannersService.updateOrder(
      updateBannerOrderDto,
      user.id,
    );
    return {
      message: 'Banner排序更新成功',
      data: result,
    };
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id', ParseIntPipe) id: string, @CurrentUser() user: AuthUser) {
    const result = await this.bannersService.toggleStatus(
      BigInt(id),
      user.id,
    );
    return {
      message: 'Banner状态切换成功',
      data: result,
    };
  }
}

// ============================================================================
// PUBLIC ENDPOINTS
// ============================================================================
@Controller('public/banners')
export class BannersPublicController {
  constructor(private readonly bannersService: BannersService) { }

  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async getAllEnabled() {
    return await this.bannersService.findPublicAll();
  }
}
