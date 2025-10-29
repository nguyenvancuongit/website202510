import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { QueryHashtagsDto } from './dto/query-hashtags.dto';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { UpdateHashtagStatusDto } from './dto/update-hashtag-status.dto';
import { HASHTAG_DEFAULTS } from '../common/config/constants';

@Injectable()
export class HashtagsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryHashtagsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      start_date,
      end_date,
      sort_by = 'createdAt',
      sort_order = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (status !== undefined) {
      where.status = status;
    }

    if (start_date || end_date) {
      where.createdAt = {};
      if (start_date) {
        where.createdAt.gte = new Date(start_date);
      }
      if (end_date) {
        where.createdAt.lte = new Date(end_date);
      }
    }

    // Build orderBy
    const orderBy: any = {};
    if (sort_by) {
      // Map snake_case to camelCase for Prisma
      const sortByMapping: Record<string, string> = {
        created_at: 'createdAt',
        updated_at: 'updatedAt',
      };

      const prismaField = sortByMapping[sort_by] || sort_by;
      orderBy[prismaField] = sort_order;
    }

    // Get total count for pagination
    const total = await this.prisma.hashtag.count({ where });

    // Get hashtags with pagination and include usage count
    const hashtags = await this.prisma.hashtag.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        _count: {
          select: {
            postHashtags: true,
          },
        },
      },
    });

    // Transform data to include usage count
    const transformedHashtags = hashtags.map((hashtag) => ({
      ...hashtag,
      usageCount: hashtag._count.postHashtags,
      _count: undefined,
    }));

    return {
      data: transformedHashtags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const hashtag = await this.prisma.hashtag.findUnique({
      where: { id: BigInt(id) },
      include: {
        _count: {
          select: {
            postHashtags: true,
          },
        },
      },
    });

    if (!hashtag) {
      throw new NotFoundException(`找不到ID为 ${id} 的标签`);
    }

    return {
      ...hashtag,
      usageCount: hashtag._count.postHashtags,
      _count: undefined,
    };
  }

  async create(createHashtagDto: CreateHashtagDto) {
    const { name, status = HASHTAG_DEFAULTS.STATUS } = createHashtagDto;

    // Check if hashtag already exists (case-sensitive)
    const existingHashtag = await this.prisma.hashtag.findUnique({
      where: { name: name },
    });

    if (existingHashtag) {
      throw new ConflictException(`标签 "${name}" 已存在`);
    }

    const hashtag = await this.prisma.hashtag.create({
      data: {
        name: name,
        status: status,
      },
    });

    return hashtag;
  }

  async update(id: number, updateHashtagDto: UpdateHashtagDto) {
    const hashtag = await this.findOne(id);
    const { name, status } = updateHashtagDto;

    // Check if new name conflicts with existing hashtag (case-sensitive)
    if (name && name !== hashtag.name) {
      const existingHashtag = await this.prisma.hashtag.findUnique({
        where: { name: name },
      });

      if (existingHashtag) {
        throw new ConflictException(`标签 "${name}" 已存在`);
      }
    }

    const updatedHashtag = await this.prisma.hashtag.update({
      where: { id: BigInt(id) },
      data: {
        ...(name && { name: name }),
        ...(status !== undefined && { status }),
      },
    });

    return updatedHashtag;
  }

  async updateStatus(
    id: number,
    updateHashtagStatusDto: UpdateHashtagStatusDto,
  ) {
    const hashtag = await this.findOne(id);
    const { status: newStatus } = updateHashtagStatusDto;

    const updatedHashtag = await this.prisma.hashtag.update({
      where: { id: BigInt(id) },
      data: { status: newStatus },
    });

    return updatedHashtag;
  }

  async remove(id: number) {
    const hashtag = await this.findOne(id);

    // Check if hashtag is being used by any posts
    const usageCount = await this.prisma.postHashtag.count({
      where: { hashtagId: BigInt(id) },
    });

    if (usageCount > 0) {
      throw new ConflictException(
        `无法删除标签 "${hashtag.name}"，因为有 ${usageCount} 篇文章正在使用`,
      );
    }

    await this.prisma.hashtag.delete({
      where: { id: BigInt(id) },
    });

    return { message: `已成功删除标签 "${hashtag.name}"` };
  }
}
