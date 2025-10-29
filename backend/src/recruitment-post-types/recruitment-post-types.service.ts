import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { RecruitmentPostType, RecruitmentPostTypeStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateRecruitmentPostTypeDto } from './dto/create-recruitment-post-type.dto';
import { UpdateRecruitmentPostTypeDto } from './dto/update-recruitment-post-type.dto';
import { UpdateRecruitmentPostTypeStatusDto } from './dto/update-status.dto';
import { FindAllRecruitmentPostTypesDto } from './dto/find-all-recruitment-post-types.dto';
import { generateSlug } from '../common/helpers/slugify';

@Injectable()
export class RecruitmentPostTypesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(
    createDto: CreateRecruitmentPostTypeDto,
    userId: bigint,
  ): Promise<RecruitmentPostType> {
    const slug = generateSlug(createDto.name);
    // Check if slug already exists
    const existingTypeBySlug = await this.prisma.recruitmentPostType.findFirst({
      where: { slug: slug },
    });

    if (existingTypeBySlug) {
      throw new ConflictException('职位类型标识已存在，请使用不同的名称');
    }

    return this.prisma.recruitmentPostType.create({
      data: {
        name: createDto.name,
        slug,
        status: RecruitmentPostTypeStatus.enabled,
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            username: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async findAll(query?: FindAllRecruitmentPostTypesDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
    } = query || {};

    const skip = (page - 1) * limit;

    // Build where condition
    const where: any = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.recruitmentPostType.findMany({
        where,
        include: {
          createdByUser: {
            select: {
              id: true,
              username: true,
            },
          },
          updatedByUser: {
            select: {
              id: true,
              username: true,
            },
          },
          _count: {
            select: {
              recruitmentPosts: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.recruitmentPostType.count({ where }),
    ]);

    return {
      data: data,
      page,
      limit,
      total,
    };
  }

  async findOne(id: string): Promise<RecruitmentPostType> {
    const recruitmentPostType = await this.prisma.recruitmentPostType.findUnique({
      where: { id: BigInt(id) },
      include: {
        createdByUser: {
          select: {
            id: true,
            username: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!recruitmentPostType) {
      throw new NotFoundException('职位类型不存在');
    }

    return recruitmentPostType;
  }

  async update(
    id: string,
    updateDto: UpdateRecruitmentPostTypeDto,
    userId: bigint,
  ): Promise<RecruitmentPostType> {
    await this.findOne(id); // Check if exists

    const updateData: any = {
      updatedBy: userId,
    };

    if (updateDto.name) {
      const newSlug = generateSlug(updateDto.name);

      // Check if new slug conflicts with existing ones (excluding current record)
      const existingTypeBySlug = await this.prisma.recruitmentPostType.findFirst({
        where: {
          slug: newSlug,
          NOT: { id: BigInt(id) },
        },
      });

      if (existingTypeBySlug) {
        throw new ConflictException('职位类型标识已存在，请使用不同的名称');
      }

      updateData.name = updateDto.name;
      updateData.slug = newSlug;
    }

    if (updateDto.status !== undefined) {
      updateData.status = updateDto.status;
    }

    return this.prisma.recruitmentPostType.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        createdByUser: {
          select: {
            id: true,
            username: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            recruitmentPosts: true,
          },
        },
      },
    });
  }

  async updateStatus(
    id: string,
    statusDto: UpdateRecruitmentPostTypeStatusDto,
    userId: bigint,
  ): Promise<RecruitmentPostType> {
    await this.findOne(id); // Check if exists

    return this.prisma.recruitmentPostType.update({
      where: { id: BigInt(id) },
      data: {
        status: statusDto.status,
        updatedBy: userId,
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            username: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            recruitmentPosts: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists

    // Check if there are associated recruitment posts
    const postCount = await this.prisma.recruitmentPost.count({
      where: { recruitmentPostTypeId: BigInt(id) },
    });

    if (postCount > 0) {
      throw new BadRequestException(`无法删除该职位类型，存在 ${postCount} 个关联的招聘信息`);
    }

    await this.prisma.recruitmentPostType.delete({
      where: { id: BigInt(id) },
    });
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  async findPublicEnabled() {
    return this.prisma.recruitmentPostType.findMany({
      where: {
        status: RecruitmentPostTypeStatus.enabled,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
