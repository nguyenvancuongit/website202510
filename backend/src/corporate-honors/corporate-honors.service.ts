import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MediaService } from 'src/medias/medias.service';
import { CreateCorporateHonorDto } from './dto/create-corporate-honor.dto';
import { UpdateCorporateHonorDto } from './dto/update-corporate-honor.dto';
import { UpdateCorporateHonorOrderDto } from './dto/update-corporate-honor-order.dto';
import { QueryCorporateHonorDto } from './dto/query-corporate-honor.dto';
import { appConfig } from 'src/common/config/app.config';
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

@Injectable()
export class CorporateHonorsService {
  constructor(
    private prisma: PrismaService,
    private mediaService: MediaService,
    private readonly operationLogService: OperationLogService,
  ) {}

  private mappingHonorWithMedia(item: any) {
    if (!item) return item;
    return {
      ...item,
      image: item.image
        ? {
            ...item.image,
            path: `${appConfig.uploadConfig.host}${item.image.path}`,
          }
        : null,
    };
  }

  async create(
    dto: CreateCorporateHonorDto,
    file?: Express.Multer.File,
    authorId?: string,
  ) {
    // Use provided authorId or fallback to dto.author_id
    const finalAuthorId = authorId || dto.author_id?.toString();
    if (!finalAuthorId) {
      throw new BadRequestException('作者ID不能为空');
    }

    // validate author exists
    const author = await this.prisma.user.findUnique({
      where: { id: BigInt(finalAuthorId) },
    });
    if (!author) {
      throw new BadRequestException('作者不存在');
    }

    // Handle image upload and create Media record
    let imageId: bigint | null = null;
    if (file) {
      const media = await this.mediaService.create(file, 'honor', dto.name);
      imageId = media.id;
    }

    // Handle sort order - if not provided, set to the highest existing sortOrder + 1
    let sortOrder = dto.sort_order;
    if (sortOrder === undefined) {
      const maxSortOrderRecord = await this.prisma.corporateHonor.findFirst({
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      });
      sortOrder = maxSortOrderRecord ? maxSortOrderRecord.sortOrder + 1 : 1;
    }

    const honorData: any = {
      name: dto.name,
      obtainedDate: new Date(dto.obtained_date),
      authorId: BigInt(finalAuthorId),
      imageId: imageId ?? null,
      sortOrder,
    };

    const created = await this.prisma.corporateHonor.create({
      data: honorData,
      include: {
        author: { select: { id: true, username: true, email: true } },
        image: { select: { id: true, name: true, path: true, altText: true } },
      } as any,
    });

    // Log operation if authorId is provided
    if (authorId) {
      await this.operationLogService.createLog({
        userId: BigInt(authorId),
        operationType: OPERATION_TYPE.CREATE as OperationType,
        module: MODULE_TYPE.CORPORATE_HONORS as ModuleType,
        operationDesc: `创建企业荣誉: ${created.name}`, // Create corporate honor: {name}
        targetType: TARGET_TYPE.CORPORATE_HONOR as TargetType,
        targetId: created.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return this.mappingHonorWithMedia(created);
  }

  async findAll(query: QueryCorporateHonorDto) {
    const {
      page = 1,
      limit = 10,
      search,
      start_date,
      end_date,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (start_date || end_date) {
      where.createdAt = {};
      if (start_date) where.createdAt.gte = new Date(start_date);
      if (end_date) where.createdAt.lte = new Date(end_date);
    }

    const orderBy: any = [];
    if (sort_by === 'created_at') orderBy.push({ createdAt: sort_order });
    else if (sort_by === 'updated_at') orderBy.push({ updatedAt: sort_order });
    else if (sort_by === 'obtained_date')
      orderBy.push({ obtainedDate: sort_order });
    else if (sort_by === 'sort_order') orderBy.push({ sortOrder: sort_order });
    else orderBy.push({ createdAt: 'desc' });

    const [data, total] = await Promise.all([
      this.prisma.corporateHonor.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: { select: { id: true, username: true, email: true } },
          image: {
            select: { id: true, name: true, path: true, altText: true },
          },
        } as any,
      }),
      this.prisma.corporateHonor.count({ where }),
    ]);

    return {
      data: data.map((item) => this.mappingHonorWithMedia(item)),
      pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
    };
  }

  private mapPublic(item: any) {
    return {
      id: item.id,
      name: item.name,
      obtained_date: item.obtainedDate,
      sort_order: item.sortOrder,
      image: item.image,
    };
  }

  async findAllPublic(query: QueryCorporateHonorDto) {
    const result = await this.findAll(query);
    return result.data.map((item) => this.mapPublic(item));
  }

  async findOne(id: number) {
    const item = await this.prisma.corporateHonor.findUnique({
      where: { id: BigInt(id) },
      include: {
        author: { select: { id: true, username: true, email: true } },
        image: {
          select: { id: true, name: true, path: true, altText: true },
        },
      } as any,
    });
    if (!item) throw new NotFoundException('荣誉不存在');
    return this.mappingHonorWithMedia(item);
  }

  async update(
    id: number,
    dto: UpdateCorporateHonorDto,
    file?: Express.Multer.File,
    userId?: string,
  ) {
    await this.ensureExists(id);
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.obtained_date !== undefined)
      data.obtainedDate = new Date(dto.obtained_date);
    if (dto.sort_order !== undefined) data.sortOrder = dto.sort_order;
    if (dto.author_id !== undefined) {
      const author = await this.prisma.user.findUnique({
        where: { id: BigInt(dto.author_id) },
      });
      if (!author) throw new BadRequestException('作者不存在');
      data.authorId = BigInt(dto.author_id);
    }

    // Handle image update
    if (file) {
      const media = await this.mediaService.create(
        file,
        'honor',
        dto.name || 'Corporate Honor Image',
      );
      data.imageId = media.id;
    }

    const updated = await this.prisma.corporateHonor.update({
      where: { id: BigInt(id) },
      data,
      include: {
        author: { select: { id: true, username: true, email: true } },
        image: {
          select: { id: true, name: true, path: true, altText: true },
        },
      } as any,
    });

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.CORPORATE_HONORS as ModuleType,
        operationDesc: `更新企业荣誉: ${updated.name}`, // Update corporate honor: {name}
        targetType: TARGET_TYPE.CORPORATE_HONOR as TargetType,
        targetId: updated.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return this.mappingHonorWithMedia(updated);
  }

  async remove(id: number, userId?: string) {
    const existingHonor = await this.findOne(id);
    await this.prisma.corporateHonor.delete({ where: { id: BigInt(id) } });

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.DELETE as OperationType,
        module: MODULE_TYPE.CORPORATE_HONORS as ModuleType,
        operationDesc: `删除企业荣誉: ${existingHonor.name}`, // Delete corporate honor: {name}
        targetType: TARGET_TYPE.CORPORATE_HONOR as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }
  }

  async updateOrder(
    updateOrderDto: UpdateCorporateHonorOrderDto,
    userId?: string,
  ) {
    const { honor_orders } = updateOrderDto;

    // Extract honor IDs to check if they exist
    const honorIds = honor_orders.map((order) => BigInt(order.id));

    // Check if all honor IDs exist
    const honors = await this.prisma.corporateHonor.findMany({
      where: { id: { in: honorIds } },
    });

    if (honors.length !== honorIds.length) {
      throw new BadRequestException('一个或多个企业荣誉ID未找到');
    }

    // Update sortOrder for each honor
    const updatePromises = honor_orders.map((order) =>
      this.prisma.corporateHonor.update({
        where: { id: BigInt(order.id) },
        data: { sortOrder: order.sort_order },
      }),
    );

    await Promise.all(updatePromises);

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.CORPORATE_HONORS as ModuleType,
        operationDesc: `更新企业荣誉排序顺序 (${honors.length}个荣誉)`, // Update corporate honor sort order ({count} honors)
        targetType: TARGET_TYPE.CORPORATE_HONOR as TargetType,
        targetId: honorIds.join(','),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return { message: '企业荣誉顺序更新成功' };
  }

  private async ensureExists(id: number) {
    const exist = await this.prisma.corporateHonor.findUnique({
      where: { id: BigInt(id) },
      select: { id: true },
    });
    if (!exist) throw new NotFoundException('荣誉不存在');
  }
}
