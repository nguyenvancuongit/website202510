import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisCacheService } from '../cache/redis.service';
import { CreateFriendLinkDto } from './dto/create-friend-link.dto';
import { UpdateFriendLinkDto } from './dto/update-friend-link.dto';
import { UpdateFriendLinkOrderDto } from './dto/update-friend-link-order.dto';
import { QueryFriendLinksDto } from './dto/query-friend-links.dto';
import { FRIEND_LINK_STATUS } from '../common/config';
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
import { FriendLink } from '@prisma/client';

@Injectable()
export class FriendLinksService {
  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private readonly operationLogService: OperationLogService,
  ) {}

  async create(createFriendLinkDto: CreateFriendLinkDto, userId?: string) {
    let sortOrder = createFriendLinkDto.sortOrder;

    // If sortOrder is not provided, find the next available sort order
    if (sortOrder == null) {
      const maxSortOrderRecord = await this.prisma.friendLink.findFirst({
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      });

      sortOrder = maxSortOrderRecord ? maxSortOrderRecord.sortOrder + 1 : 1;
    } else {
      // Check if sortOrder is unique
      const existingFriendLink = await this.prisma.friendLink.findFirst({
        where: { sortOrder },
      });

      if (existingFriendLink) {
        throw new BadRequestException(
          `排序值 ${sortOrder} 已存在，请选择其他值`,
        );
      }
    }

    const friendLink = await this.prisma.friendLink.create({
      data: {
        name: createFriendLinkDto.name.trim(),
        url: createFriendLinkDto.url.trim(),
        sortOrder,
        status: createFriendLinkDto.status ?? FRIEND_LINK_STATUS.ENABLED,
      },
    });

    // Invalidate caches
    await this.cache.invalidateByPattern('friend-links:*');

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.CREATE as OperationType,
        module: MODULE_TYPE.FRIEND_LINKS as ModuleType,
        operationDesc: `创建友情链接: ${friendLink.name}`,
        targetType: TARGET_TYPE.FRIEND_LINK as TargetType,
        targetId: friendLink.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return {
      message: '友链创建成功',
      data: friendLink,
    };
  }

  async findAll(query: QueryFriendLinksDto) {
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
          name: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          url: {
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
    const total = await this.prisma.friendLink.count({ where });

    // Get paginated results
    const data = await this.prisma.friendLink.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private mapPublic(item: any) {
    return {
      id: item.id,
      name: item.name,
      url: item.url,
      sort_order: item.sortOrder,
    };
  }

  async findAllPublic() {
    const cacheKey = 'friend-links:public:list';
    const cached = await this.cache.get<FriendLink[]>(cacheKey);
    if (cached) return cached;

    const friendLinks = await this.prisma.friendLink.findMany({
      where: { status: FRIEND_LINK_STATUS.ENABLED },
      orderBy: { sortOrder: 'asc' },
    });
    const result = friendLinks.map((f) => this.mapPublic(f));
    await this.cache.set(cacheKey, result, 300); // Cache for 5 minutes
    return result;
  }

  async findOne(id: bigint) {
    const friendLink = await this.prisma.friendLink.findUnique({
      where: { id },
    });

    if (!friendLink) {
      throw new NotFoundException('友链未找到');
    }

    return {
      data: friendLink,
    };
  }

  async update(
    id: bigint,
    updateFriendLinkDto: UpdateFriendLinkDto,
    userId?: string,
  ) {
    const existingFriendLink = await this.prisma.friendLink.findUnique({
      where: { id },
    });

    if (!existingFriendLink) {
      throw new NotFoundException('友链未找到');
    }

    const updateData: any = {};

    if (updateFriendLinkDto.name != null) {
      updateData.name = updateFriendLinkDto.name;
    }

    if (updateFriendLinkDto.url != null) {
      updateData.url = updateFriendLinkDto.url;
    }

    if (updateFriendLinkDto.status != null) {
      updateData.status = updateFriendLinkDto.status;
    }

    if (updateFriendLinkDto.sortOrder != null) {
      // Check if sortOrder is unique (exclude current record)
      const existingWithSortOrder = await this.prisma.friendLink.findFirst({
        where: {
          sortOrder: updateFriendLinkDto.sortOrder,
          id: { not: id },
        },
      });

      if (existingWithSortOrder) {
        throw new BadRequestException(
          `排序值 ${updateFriendLinkDto.sortOrder} 已存在，请选择其他值`,
        );
      }
      updateData.sortOrder = updateFriendLinkDto.sortOrder;
    }

    const friendLink = await this.prisma.friendLink.update({
      where: { id },
      data: updateData,
    });

    await this.cache.invalidateByPattern('friend-links:*');

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.FRIEND_LINKS as ModuleType,
        operationDesc: `更新友情链接: ${friendLink.name}`,
        targetType: TARGET_TYPE.FRIEND_LINK as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return {
      message: '友链更新成功',
      data: friendLink,
    };
  }

  async remove(id: bigint, userId?: string) {
    const existingFriendLink = await this.prisma.friendLink.findUnique({
      where: { id },
    });

    if (!existingFriendLink) {
      throw new NotFoundException('友链未找到');
    }

    await this.prisma.friendLink.delete({
      where: { id },
    });

    await this.cache.invalidateByPattern('friend-links:*');

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.DELETE as OperationType,
        module: MODULE_TYPE.FRIEND_LINKS as ModuleType,
        operationDesc: `删除友情链接: ${existingFriendLink.name}`,
        targetType: TARGET_TYPE.FRIEND_LINK as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return {
      message: '友链删除成功',
    };
  }

  async updateOrder(
    updateFriendLinkOrderDto: UpdateFriendLinkOrderDto,
    userId?: string,
  ) {
    const { orders } = updateFriendLinkOrderDto;

    // Check for duplicate sort orders in the request
    const sortOrders = orders.map((order) => order.sort_order);
    const uniqueSortOrders = new Set(sortOrders);

    if (sortOrders.length !== uniqueSortOrders.size) {
      throw new BadRequestException('排序值不能重复');
    }

    try {
      // Use a transaction to update all sort orders
      await this.prisma.$transaction(
        orders.map(({ id, sort_order }) =>
          this.prisma.friendLink.update({
            where: { id: BigInt(id) },
            data: { sortOrder: sort_order },
          }),
        ),
      );

      await this.cache.invalidateByPattern('friend-links:*');

      // Log operation if userId is provided
      if (userId) {
        await this.operationLogService.createLog({
          userId: BigInt(userId),
          operationType: OPERATION_TYPE.UPDATE as OperationType,
          module: MODULE_TYPE.FRIEND_LINKS as ModuleType,
          operationDesc: `批量更新友情链接排序 (${orders.length}个链接)`,
          targetType: TARGET_TYPE.FRIEND_LINK as TargetType,
          targetId: 'batch_update',
          status: OPERATION_STATUS.SUCCESS,
        });
      }

      return {
        message: '友链排序更新成功',
      };
    } catch {
      throw new BadRequestException('友链排序更新失败，请检查数据');
    }
  }

  async toggleStatus(id: bigint, userId?: string) {
    const existingFriendLink = await this.prisma.friendLink.findUnique({
      where: { id },
    });

    if (!existingFriendLink) {
      throw new NotFoundException('友链未找到');
    }

    const newStatus =
      existingFriendLink.status === FRIEND_LINK_STATUS.ENABLED
        ? FRIEND_LINK_STATUS.DISABLED
        : FRIEND_LINK_STATUS.ENABLED;

    const friendLink = await this.prisma.friendLink.update({
      where: { id },
      data: { status: newStatus },
    });

    await this.cache.invalidateByPattern('friend-links:*');

    // Log operation if userId is provided
    if (userId) {
      const operationDesc =
        newStatus === FRIEND_LINK_STATUS.ENABLED
          ? `启用友情链接: ${friendLink.name}`
          : `禁用友情链接: ${friendLink.name}`;

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.FRIEND_LINKS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.FRIEND_LINK as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return {
      message: `友链已${newStatus === FRIEND_LINK_STATUS.ENABLED ? '启用' : '禁用'}`,
      data: friendLink,
    };
  }
}
