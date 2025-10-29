import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RecruitmentPost, RecruitmentPostStatus, JobType, RecruitmentPostTypeStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateRecruitmentPostDto } from './dto/create-recruitment-post.dto';
import { UpdateRecruitmentPostDto } from './dto/update-recruitment-post.dto';
import { FindAllRecruitmentPostsDto } from './dto/find-all-recruitment-posts.dto';
import { QueryPublicRecruitmentPostsDto } from './dto/query-public-recruitment-posts.dto';
import { generateSlug } from '../common/helpers/slugify';

@Injectable()
export class RecruitmentPostsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDto: CreateRecruitmentPostDto, userId: bigint): Promise<RecruitmentPost> {
    // Check if recruitment post type exists
    const recruitmentPostType = await this.prisma.recruitmentPostType.findUnique({
      where: { id: BigInt(createDto.recruitment_post_type_id) },
    });

    if (!recruitmentPostType) {
      throw new NotFoundException('职位类型不存在');
    }

    const slug = generateSlug(createDto.job_title);
    // Check if slug already exists
    const existingPostBySlug = await this.prisma.recruitmentPost.findFirst({
      where: { slug: slug },
    });

    if (existingPostBySlug) {
      throw new ConflictException('职位标识已存在，请使用不同的职位标题');
    }

    return this.prisma.recruitmentPost.create({
      data: {
        jobTitle: createDto.job_title,
        slug,
        jobDescription: createDto.job_description,
        recruitmentPostTypeId: BigInt(createDto.recruitment_post_type_id),
        jobType: createDto.job_type || JobType.full_time,
        status: createDto.status || RecruitmentPostStatus.draft,
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        recruitmentPostType: true,
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
            resumeApplications: true,
          },
        },
      },
    });
  }

  // Get all recruitment posts with filters
  async findAll(query: FindAllRecruitmentPostsDto): Promise<{ data: RecruitmentPost[]; total: number; page: number; limit: number }> {
    // Process query parameters
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 10;

    const where: any = {};

    if (query.job_title) {
      where.jobTitle = {
        contains: query.job_title,
        mode: 'insensitive',
      };
    }

    if ((query as any).job_type) {
      where.jobType = (query as any).job_type;
    }

    if (query.recruitment_post_type_id) {
      where.recruitmentPostTypeId = BigInt(query.recruitment_post_type_id);
    }

    if (query.job_type) {
      where.jobType = query.job_type;
    }

    if (query.status) {
      where.status = query.status;
    }

    const total = await this.prisma.recruitmentPost.count({ where });

    const data = await this.prisma.recruitmentPost.findMany({
      where,
      include: {
        recruitmentPostType: true,
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
            resumeApplications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  // Get single recruitment post
  async findOne(id: string): Promise<RecruitmentPost> {
    const recruitmentPost = await this.prisma.recruitmentPost.findUnique({
      where: { id: BigInt(id) },
      include: {
        recruitmentPostType: true,
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
            resumeApplications: true,
          },
        },
      },
    });

    if (!recruitmentPost) {
      throw new NotFoundException('招聘信息不存在');
    }

    return recruitmentPost;
  }

  // Update recruitment post
  async update(id: string, updateDto: UpdateRecruitmentPostDto, userId: bigint): Promise<RecruitmentPost> {
    // Check if exists
    await this.findOne(id);

    const updateData: any = {
      updatedBy: userId,
    };

    if (updateDto.job_title) {
      const newSlug = generateSlug(updateDto.job_title);

      // Check if new slug conflicts with existing ones (excluding current record)
      const existingPostBySlug = await this.prisma.recruitmentPost.findFirst({
        where: {
          slug: newSlug,
          NOT: { id: BigInt(id) },
        },
      });

      if (existingPostBySlug) {
        throw new ConflictException('职位标识已存在，请使用不同的职位标题');
      }

      updateData.jobTitle = updateDto.job_title;
      updateData.slug = newSlug;
    }

    if (updateDto.job_description) {
      updateData.jobDescription = updateDto.job_description;
    }

    if (updateDto.recruitment_post_type_id) {
      // Check if recruitment post type exists
      const recruitmentPostType = await this.prisma.recruitmentPostType.findUnique({
        where: { id: BigInt(updateDto.recruitment_post_type_id) },
      });

      if (!recruitmentPostType) {
        throw new NotFoundException('职位类型不存在');
      }

      updateData.recruitmentPostTypeId = BigInt(updateDto.recruitment_post_type_id);
    }

    if (updateDto.job_type !== undefined) {
      updateData.jobType = updateDto.job_type;
    }

    if (updateDto.status !== undefined) {
      updateData.status = updateDto.status;
    }

    return this.prisma.recruitmentPost.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        recruitmentPostType: true,
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
            resumeApplications: true,
          },
        },
      },
    });
  }

  // Update status only
  async updateStatus(id: string, status: RecruitmentPostStatus, userId: bigint): Promise<RecruitmentPost> {
    // Check if exists
    await this.findOne(id);

    return this.prisma.recruitmentPost.update({
      where: { id: BigInt(id) },
      data: {
        status,
        updatedBy: userId,
      },
      include: {
        recruitmentPostType: true,
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
            resumeApplications: true,
          },
        },
      },
    });
  }

  // Delete recruitment post
  async remove(id: string): Promise<void> {
    // Check if exists
    await this.findOne(id);

    await this.prisma.recruitmentPost.delete({
      where: { id: BigInt(id) },
    });
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  async findPublicPosts(query: QueryPublicRecruitmentPostsDto) {
    // Process query parameters
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 10;

    const where: any = {
      status: RecruitmentPostStatus.published, // Only published posts
    };

    if (query.job_title) {
      where.jobTitle = {
        contains: query.job_title,
        mode: 'insensitive',
      };
    }

    if (query.job_type) {
      where.jobType = {
        in: query.job_type,
      }
    }

    if (query.recruitment_post_type_ids && query.recruitment_post_type_ids.length > 0) {
      where.recruitmentPostTypeId = {
        in: query.recruitment_post_type_ids.map((id) => BigInt(id)),
      };
    }

    // Also filter by recruitment post type status
    where.recruitmentPostType = {
      status: RecruitmentPostTypeStatus.enabled,
    };

    const total = await this.prisma.recruitmentPost.count({ where });

    const data = await this.prisma.recruitmentPost.findMany({
      where,
      include: {
        recruitmentPostType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            resumeApplications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      pagination: {
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findPublicPostBySlug(slug: string) {
    const recruitmentPost = await this.prisma.recruitmentPost.findFirst({
      where: {
        slug: slug,
        status: RecruitmentPostStatus.published,
        recruitmentPostType: {
          status: RecruitmentPostTypeStatus.enabled,
        },
      },
      include: {
        recruitmentPostType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            resumeApplications: true,
          },
        },
      },
    });

    if (!recruitmentPost) {
      throw new NotFoundException('招聘信息不存在');
    }

    return recruitmentPost;
  }

  async getRelatedPosts(recruitmentPostId: string, limit: number = 4) {
    // First, get the recruitment post to find its type
    const recruitmentPost = await this.prisma.recruitmentPost.findUnique({
      where: { id: BigInt(recruitmentPostId) },
    });

    if (!recruitmentPost) {
      throw new NotFoundException('招聘信息不存在');
    }

    // Then, find other posts with the same type, excluding the current one
    const relatedPosts = await this.prisma.recruitmentPost.findMany({
      where: {
        id: { not: BigInt(recruitmentPostId) },
        recruitmentPostTypeId: recruitmentPost.recruitmentPostTypeId,
        status: RecruitmentPostStatus.published,
        recruitmentPostType: {
          status: RecruitmentPostTypeStatus.enabled,
        },
      },
      include: {
        recruitmentPostType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return relatedPosts;
  }
}
