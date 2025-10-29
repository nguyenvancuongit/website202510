import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateBannerOrderDto } from './dto/update-banner-order.dto';
import { QueryBannersDto } from './dto/query-banners.dto';
import { BannerStatus } from '@prisma/client';
import { appConfig } from 'src/common/config';
import { BannerWithMedia } from './types';
import { MediaService } from 'src/medias/medias.service';
import { OperationLogService } from '../operation-logs/operation-log.service';
import {
  OPERATION_TYPE,
  MODULE_TYPE,
  TARGET_TYPE,
  OPERATION_STATUS,
} from '../common/config/constants';
import type {
  OperationType,
  ModuleType,
  TargetType,
} from '../common/config/constants';
import { RedisCacheService } from 'src/cache/redis.service';
import { BANNER_CACHE_KEYS } from './banners.constants';

@Injectable()
export class BannersService {
  constructor(
    private prisma: PrismaService,
    private mediaService: MediaService,
    private readonly operationLogService: OperationLogService,
    private readonly redisService: RedisCacheService,
  ) { }

  async create(
    createBannerDto: CreateBannerDto,
    webMediaFile: Express.Multer.File,
    mobileMediaFile: Express.Multer.File,
    userId?: string,
  ) {
    // Additional validation
    if (!webMediaFile) {
      throw new BadRequestException('Web端图片文件是必填项');
    }

    if (!mobileMediaFile) {
      throw new BadRequestException('移动端图片文件是必填项');
    }

    // Check maximum 8 active banners limit (status = ENABLED) only if creating with status = ENABLED
    const statusToCreate = createBannerDto.status ?? BannerStatus.enabled;
    if (statusToCreate === BannerStatus.enabled) {
      const activeBannerCount = await this.prisma.banner.count({
        where: { status: BannerStatus.enabled },
      });
      if (activeBannerCount >= 8) {
        throw new BadRequestException(
          '最多允许8个激活的横幅，请先禁用现有横幅',
        );
      }
    }

    try {
      // Upload web media file and create Media record
      const webMedia = await this.mediaService.create(
        webMediaFile,
        'banner',
        createBannerDto.webAltText,
        createBannerDto.webCaption,
      );

      // Upload mobile media file and create Media record
      const mobileMedia = await this.mediaService.create(
        mobileMediaFile,
        'banner',
        createBannerDto.mobileAltText,
        createBannerDto.mobileCaption,
      );

      // Find highest sortOrder to add new banner at the end
      const maxSortOrderRecord = await this.prisma.banner.findFirst({
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      });

      const nextSortOrder = maxSortOrderRecord
        ? maxSortOrderRecord.sortOrder + 1
        : 1;

      // Create banner with media relations
      const banner = await this.prisma.banner.create({
        data: {
          title: createBannerDto.title?.trim(),
          webMediaId: webMedia.id,
          mobileMediaId: mobileMedia.id,
          linkUrl: createBannerDto.link_url?.trim(),
          sortOrder: nextSortOrder,
          status: statusToCreate,
        },
        include: {
          webMedia: true,
          mobileMedia: true,
        },
      });
      await this.redisService.invalidateByPattern('banners:*');
      // Log operation if userId is provided
      if (userId) {
        const operationDesc =
          statusToCreate === BannerStatus.enabled
            ? `创建并启用横幅: ${banner.title}` // Create and enable banner: {title}
            : `创建横幅: ${banner.title}`; // Create banner: {title}

        await this.operationLogService.createLog({
          userId: BigInt(userId),
          operationType: OPERATION_TYPE.CREATE as OperationType,
          module: MODULE_TYPE.BANNERS as ModuleType,
          operationDesc,
          targetType: TARGET_TYPE.BANNER as TargetType,
          targetId: banner.id.toString(),
          status: OPERATION_STATUS.SUCCESS,
        });
      }

      return banner;
    } catch (error) {
      // If banner creation fails and media files were uploaded, we should clean them up
      // The mediaService will handle cleanup if its operations fail
      throw new BadRequestException(
        `创建横幅失败: ${error.message || '未知错误'}`,
      );
    }
  }

  async findAll(query: QueryBannersDto) {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      sort_by = 'sortOrder',
      sort_order = 'asc',
    } = query;

    const where: any = {};

    // Filter by status if provided
    if (status !== undefined) {
      where.status = status;
    }

    // Filter by search query if provided
    if (search && search.trim()) {
      where.OR = [
        {
          title: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          linkUrl: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort field and order
    const orderBy: any = {};
    orderBy[sort_by] = sort_order;

    // Get total count for pagination
    const total = await this.prisma.banner.count({ where });

    // Get paginated results
    const data = (await this.prisma.banner.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        webMedia: true,
        mobileMedia: true,
      },
    })) as BannerWithMedia[];

    const mappedData = data.map((banner) =>
      this.mappingBannerWithMedia(banner),
    );

    return {
      data: mappedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: bigint) {
    const banner = (await this.prisma.banner.findUnique({
      where: { id },
      include: {
        webMedia: true,
        mobileMedia: true,
      },
    })) as BannerWithMedia;

    if (!banner) {
      throw new NotFoundException(`ID为${id}的横幅未找到`);
    }

    return this.mappingBannerWithMedia(banner);
  }

  // Public: all enabled without pagination, remove sensitive fields
  async findPublicAll() {
    const cacheData = await this.redisService.get(
      BANNER_CACHE_KEYS.list_public,
    );
    if (cacheData) {
      return cacheData;
    }
    const data = (await this.prisma.banner.findMany({
      where: { status: BannerStatus.enabled },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        title: true,
        linkUrl: true,
        sortOrder: true,
        webMedia: true,
        mobileMedia: true,
      },
    })) as BannerWithMedia[];
    const mapped = data.map((b) => this.mappingBannerWithMedia(b));
    await this.redisService.set(BANNER_CACHE_KEYS.list_public, mapped, 300); // Cache for 5 minutes
    return mapped;
  }

  async update(
    id: bigint,
    updateBannerDto: UpdateBannerDto,
    medias: {
      webMedia?: Express.Multer.File;
      mobileMedia?: Express.Multer.File;
    },
    userId?: string,
  ) {
    const banner = await this.findOne(id); // Check if banner exists

    let newSortOrder = banner.sortOrder; // Keep current sort order by default

    // Handle status change and sort order updates
    if (
      updateBannerDto.status !== undefined &&
      updateBannerDto.status !== banner.status
    ) {
      if (
        updateBannerDto.status === BannerStatus.enabled &&
        banner.status === BannerStatus.disabled
      ) {
        // Find the highest sort_order among active banners and add 1
        const maxSortOrderRecord = await this.prisma.banner.findFirst({
          where: { status: BannerStatus.enabled },
          orderBy: { sortOrder: 'desc' },
          select: { sortOrder: true },
        });

        newSortOrder = maxSortOrderRecord
          ? maxSortOrderRecord.sortOrder + 1
          : 1;
      } else if (
        updateBannerDto.status === BannerStatus.disabled &&
        banner.status === BannerStatus.enabled
      ) {
        const activeBannerCount = await this.prisma.banner.count({
          where: { status: BannerStatus.enabled },
        });
        if (activeBannerCount === 1) {
          throw new BadRequestException(
            "至少需要一个激活的横幅，无法禁用最后一个激活的横幅"
          );
        }
        // Disabling an enabled banner
        newSortOrder = 0;
      }
    }

    let webMediaId = banner.webMediaId;
    let mobileMediaId = banner.mobileMediaId;

    // Handle web media file update
    if (medias?.webMedia) {
      try {
        // Upload new web media file
        const newWebMedia = await this.mediaService.create(
          medias.webMedia,
          'banner',
        );

        // Remove old file if it exists
        if (banner.webMedia) {
          await this.mediaService.delete(banner.webMedia.id);
        }

        webMediaId = newWebMedia.id;
      } catch (error) {
        throw new BadRequestException(`Web端图片更新失败: ${error.message}`);
      }
    }

    if (medias?.mobileMedia) {
      try {
        // Upload new mobile media file
        const newMobileMedia = await this.mediaService.create(
          medias.mobileMedia,
          'banner',
        );

        // Remove old file if it exists
        if (banner.mobileMedia) {
          await this.mediaService.delete(banner.mobileMedia.id);
        }

        mobileMediaId = newMobileMedia.id;
      } catch (error) {
        throw new BadRequestException(`移动端图片更新失败: ${error.message}`);
      }
    }
    const updatedBanner = (await this.prisma.banner.update({
      where: { id },
      data: {
        title: updateBannerDto.title?.trim(),
        linkUrl: updateBannerDto.link_url?.trim(),
        status: updateBannerDto.status,
        sortOrder: newSortOrder,
        webMediaId,
        mobileMediaId,
      },
      include: {
        webMedia: true,
        mobileMedia: true,
      },
    })) as BannerWithMedia;
    await this.redisService.invalidateByPattern('banners:*');

    // Log operation if userId is provided
    if (userId) {
      let operationDesc = `更新横幅: ${updatedBanner.title}`; // Update banner: {title}
      if (
        updateBannerDto.status === BannerStatus.enabled &&
        banner.status === BannerStatus.disabled
      ) {
        operationDesc = `更新并启用横幅: ${updatedBanner.title}`; // Update and enable banner: {title}
      } else if (
        updateBannerDto.status === BannerStatus.disabled &&
        banner.status === BannerStatus.enabled
      ) {
        operationDesc = `更新并禁用横幅: ${updatedBanner.title}`; // Update and disable banner: {title}
      }

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.BANNERS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.BANNER as TargetType,
        targetId: updatedBanner.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return this.mappingBannerWithMedia(updatedBanner);
  }

  async remove(id: bigint, userId?: string) {
    const banner = await this.findOne(id); // Check if banner exists
    const activeBannerCount = await this.prisma.banner.count({
      where: { status: BannerStatus.enabled },
    });

    if (
      banner.status === BannerStatus.enabled &&
      activeBannerCount === 1
    ) {
      throw new BadRequestException(
        "至少需要一个激活的横幅，无法删除最后一个激活的横幅"
      );
    }

    if (banner.webMedia) {
      await this.mediaService.delete(banner.webMedia.id);
    }

    if (banner.mobileMedia) {
      await this.mediaService.delete(banner.mobileMedia.id);
    }

    await this.prisma.banner.delete({
      where: { id },
    });

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.DELETE as OperationType,
        module: MODULE_TYPE.BANNERS as ModuleType,
        operationDesc: `删除横幅: ${banner.title}`, // Delete banner: {title}
        targetType: TARGET_TYPE.BANNER as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }
    // Invalidate cache if the deleted banner was enabled caused it affects public listing
    if (banner.status === BannerStatus.enabled) {
      await this.redisService.invalidateByPattern('banners:*');
    }
  }

  async updateOrder(
    updateBannerOrderDto: UpdateBannerOrderDto,
    userId?: string,
  ) {
    const { banner_orders } = updateBannerOrderDto;

    // Extract banner IDs to check if they exist
    const bannerIds = banner_orders.map((order) => BigInt(order.id));

    // Check if all banner IDs exist
    const banners = await this.prisma.banner.findMany({
      where: { id: { in: bannerIds } },
    });

    if (banners.length !== bannerIds.length) {
      throw new BadRequestException('一个或多个横幅ID未找到');
    }

    // Update sortOrder for each banner
    const updatePromises = banner_orders.map((order) =>
      this.prisma.banner.update({
        where: { id: BigInt(order.id) },
        data: { sortOrder: order.sort_order },
      }),
    );

    await Promise.all(updatePromises);
    await this.redisService.invalidateByPattern('banners:*');

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.BANNERS as ModuleType,
        operationDesc: `更新横幅排序顺序 (${banners.length}个横幅)`, // Update banner sort order ({count} banners)
        targetType: TARGET_TYPE.BANNER as TargetType,
        targetId: bannerIds.join(','),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return { message: '横幅顺序更新成功' };
  }

  async toggleStatus(id: bigint, userId?: string) {
    const banner = await this.findOne(id);

    const newStatus =
      banner.status === BannerStatus.disabled
        ? BannerStatus.enabled
        : BannerStatus.disabled;

    // Check constraints based on new status
    if (newStatus === BannerStatus.enabled) {
      // Enabling a disabled banner - check if we already have 8 active banners
      const activeBannerCount = await this.prisma.banner.count({
        where: { status: BannerStatus.enabled },
      });
      if (activeBannerCount >= 8) {
        throw new BadRequestException(
          '最多允许8个激活的横幅，请先禁用现有横幅',
        );
      }
    } else if (newStatus === BannerStatus.disabled) {
      // Disabling an enabled banner - check if it's the last active banner
      const activeBannerCount = await this.prisma.banner.count({
        where: { status: BannerStatus.enabled },
      });
      if (activeBannerCount === 1) {
        throw new BadRequestException(
          '至少需要一个激活的横幅，无法禁用最后一个激活的横幅',
        );
      }
    }

    const updatedBanner = await this.prisma.banner.update({
      where: { id },
      data: {
        status: newStatus,
      },
    });

    // Log operation if userId is provided
    if (userId) {
      const operationDesc =
        newStatus === BannerStatus.enabled
          ? `启用横幅: ${banner.title}` // Enable banner: {title}
          : `禁用横幅: ${banner.title}`; // Disable banner: {title}

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType:
          newStatus === BannerStatus.enabled
            ? (OPERATION_TYPE.ENABLE as OperationType)
            : (OPERATION_TYPE.DISABLE as OperationType),
        module: MODULE_TYPE.BANNERS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.BANNER as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }
    await this.redisService.invalidateByPattern('banners:*');

    return updatedBanner;
  }

  private mappingBannerWithMedia(banner: BannerWithMedia) {
    return {
      ...banner,
      webMedia: banner.webMedia
        ? {
          ...banner.webMedia,
          path: `${appConfig.uploadConfig.host}${banner.webMedia.path}`,
        }
        : null,
      mobileMedia: banner.mobileMedia
        ? {
          ...banner.mobileMedia,
          path: `${appConfig.uploadConfig.host}${banner.mobileMedia.path}`,
        }
        : null,
    };
  }
}
