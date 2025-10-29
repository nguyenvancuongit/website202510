import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLatestNewsDto } from './dto/create-latest-news.dto';
import { UpdateLatestNewsDto } from './dto/update-latest-news.dto';
import { QueryLatestNewsDto } from './dto/query-latest-news.dto';
import { LatestNew, LatestNewStatus } from '@prisma/client';
import { MediaService } from '../medias/medias.service';
import { generateSlug } from '../common/helpers/slugify';
import { CategoriesService } from 'src/categories/categories.service';
import { OperationLogService } from '../operation-logs/operation-log.service';
import {
  OPERATION_TYPE,
  MODULE_TYPE,
  TARGET_TYPE,
  LATEST_NEWS_STATUS,
  OPERATION_STATUS,
} from '../common/config/constants';
import type {
  OperationType,
  ModuleType,
  TargetType,
} from '../common/config/constants';
import { htmlToText } from 'src/utils';

@Injectable()
export class LatestNewsService {
  constructor(
    private prisma: PrismaService,
    private mediaService: MediaService,
    private readonly categoryService: CategoriesService,
    private readonly operationLogService: OperationLogService,
  ) {}

  async create(
    createLatestNewsDto: CreateLatestNewsDto,
    files: {
      webThumbnail: Express.Multer.File;
      mobileThumbnail: Express.Multer.File;
    },
    userId: string,
  ): Promise<any> {
    let webThumbnailMediaId: bigint | null = null;
    let mobileThumbnailMediaId: bigint | null = null;

    // check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: BigInt(createLatestNewsDto.category_id) },
    });

    if (!category) {
      throw new BadRequestException('分类不存在');
    }

    const existingTitle = await this.prisma.latestNew.findFirst({
      where: { title: createLatestNewsDto.title },
    });

    if (existingTitle) {
      throw new BadRequestException('此标题已存在');
    }

    // Generate slug from title
    const slug = generateSlug(createLatestNewsDto.title);

    // Upload thumbnails to media library
    if (files.webThumbnail) {
      const webMedia = await this.mediaService.create(
        files.webThumbnail,
        'latest-news',
      );
      webThumbnailMediaId = webMedia.id;
    }

    if (files?.mobileThumbnail) {
      const mobileMedia = await this.mediaService.create(
        files.mobileThumbnail,
        'latest-news',
      );
      mobileThumbnailMediaId = mobileMedia.id;
    }

    if (!webThumbnailMediaId || !mobileThumbnailMediaId) {
      throw new BadRequestException('Web和移动端缩略图都是必需的');
    }

    // Create news
    const latestNews = await this.prisma.latestNew.create({
      data: {
        title: createLatestNewsDto.title,
        slug: slug,
        status: createLatestNewsDto.status,
        content: createLatestNewsDto.content,
        description: createLatestNewsDto.description,
        featured: createLatestNewsDto.featured || false,
        publishedDate: createLatestNewsDto.published_date
          ? new Date(createLatestNewsDto.published_date)
          : createLatestNewsDto.status === LatestNewStatus.published
            ? new Date()
            : null,
        categoryId: BigInt(createLatestNewsDto.category_id),
        webThumbnailMediaId,
        mobileThumbnailMediaId,
        createdBy: BigInt(userId),
        updatedBy: BigInt(userId),
      },
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
      },
    });

    if (latestNews.status === LatestNewStatus.published) {
      await this.categoryService.incrementPublishedPostCount(
        Number(category.id),
      );
    }

    // Log operation - differentiate draft vs publish
    const operationDesc =
      createLatestNewsDto.status === LATEST_NEWS_STATUS.PUBLISHED
        ? `创建并发布最新资讯: ${latestNews.title}`
        : `创建最新资讯草稿: ${latestNews.title}`;

    await this.operationLogService.createLog({
      userId: BigInt(userId),
      operationType: OPERATION_TYPE.CREATE as OperationType,
      module: MODULE_TYPE.LATEST_NEWS_POSTS as ModuleType,
      operationDesc,
      targetType: TARGET_TYPE.LATEST_NEW as TargetType,
      targetId: latestNews.id.toString(),
      status: OPERATION_STATUS.SUCCESS,
    });

    return latestNews;
  }

  async findAll(queryDto: QueryLatestNewsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      category_id,
      status,
      featured,
      start_date,
      end_date,
      sort_by = 'publishedDate',
      sort_order = 'desc',
    } = queryDto;

    const skip = (page - 1) * limit;

    // Build where conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        {
          updatedByUser: {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (category_id) {
      where.categoryId = BigInt(category_id);
    }

    if (status) {
      where.status = status;
    }

    if (typeof featured === 'boolean') {
      where.featured = featured;
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

    // Execute query
    const [latestNews, total] = await Promise.all([
      this.prisma.latestNew.findMany({
        where: where,
        skip,
        take: limit,
        orderBy: {
          [sort_by]:
            sort_by === 'publishedDate'
              ? { sort: sort_order, nulls: 'last' }
              : sort_order,
        },
        include: {
          category: true,
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
        omit: { content: true },
      }),
      this.prisma.latestNew.count({ where }),
    ]);

    return {
      data: latestNews,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // Public: list published (optional category), sorted by featured desc then createdAt desc, with pagination
  async findPublicAll(query: QueryLatestNewsDto) {
    const { page = 1, limit = 10, category_id } = query as any;
    const skip = (page - 1) * limit;
    const where: any = { status: LatestNewStatus.published };
    if (category_id) where.categoryId = BigInt(category_id);

    const [rows, total] = await Promise.all([
      this.prisma.latestNew.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          {
            publishedDate: {
              sort: 'desc',
              nulls: 'last',
            },
          },
        ],
        skip,
        take: limit,
        include: {
          category: true,
          webThumbnail: true,
          mobileThumbnail: true,
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
        omit: { content: true },
      }),
      this.prisma.latestNew.count({ where }),
    ]);

    const data = rows.map((n: any) => this.mapPublic(n));
    return {
      data,
      pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
    };
  }

  private mapPublic(item: any) {
    // strip sensitive fields if any; map media paths if needed
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      content: item.content,
      created_at: item.createdAt,
      published_date: item.publishedDate,
      featured: item.featured,
      category: {
        id: item.category.id,
        name: item.category.name,
        slug: item.category.slug,
      },
      web_thumbnail: item.webThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(item.webThumbnail)
        : null,
      mobile_thumbnail: item.mobileThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(item.mobileThumbnail)
        : null,
    };
  }

  async findOne(id: number) {
    const latestNews = await this.prisma.latestNew.findUnique({
      where: { id: BigInt(id) },
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
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

    if (!latestNews) {
      throw new NotFoundException('新闻未找到');
    }

    return {
      ...latestNews,
      webThumbnail: latestNews.webThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(latestNews.webThumbnail)
        : null,
      mobileThumbnail: latestNews.mobileThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(
            latestNews.mobileThumbnail,
          )
        : null,
    };
  }

  async findBySlug(slug: string) {
    const latestNews = await this.prisma.latestNew.findUnique({
      where: { slug },
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
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

    if (!latestNews || latestNews.status !== LatestNewStatus.published) {
      throw new NotFoundException('新闻未找到');
    }

    // Get previous post (older, published)
    const previousPost = await this.prisma.latestNew.findFirst({
      where: {
        id: { lt: latestNews.id },
        status: LatestNewStatus.published,
      },
      orderBy: { id: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    // Get next post (newer, published)
    const nextPost = await this.prisma.latestNew.findFirst({
      where: {
        id: { gt: latestNews.id },
        status: LatestNewStatus.published,
      },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    return {
      ...latestNews,
      webThumbnail: latestNews.webThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(latestNews.webThumbnail)
        : null,
      mobileThumbnail: latestNews.mobileThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(
            latestNews.mobileThumbnail,
          )
        : null,
      previousPost: previousPost || null,
      nextPost: nextPost || null,
    };
  }

  async update(
    id: number,
    updateLatestNewsDto: UpdateLatestNewsDto,
    files?: {
      webThumbnail?: Express.Multer.File;
      mobileThumbnail?: Express.Multer.File;
    },
    userId?: string,
  ): Promise<LatestNew> {
    // Check if news exists and not published, if published, disallow edit
    const existingNews = await this.findOne(id);
    if (existingNews.status === LatestNewStatus.published) {
      throw new BadRequestException('已发布的资讯不允许编辑');
    }
    const updateData: any = {};
    // Validate category (if provided)
    if (updateLatestNewsDto.category_id) {
      const category = await this.prisma.category.findUnique({
        where: { id: BigInt(updateLatestNewsDto.category_id) },
      });

      if (!category) {
        throw new BadRequestException('分类不存在');
      }
      updateData.categoryId = BigInt(updateLatestNewsDto.category_id);
    }

    if (updateLatestNewsDto.title) {
      // Check for title uniqueness
      const existingTitle = await this.prisma.latestNew.findFirst({
        where: {
          title: updateLatestNewsDto.title,
          id: { not: BigInt(id) },
        },
      });

      if (existingTitle) {
        throw new BadRequestException('此标题已存在');
      }

      updateData.title = updateLatestNewsDto.title;
      updateData.slug = generateSlug(updateLatestNewsDto.title);
    }

    if (updateLatestNewsDto.content != null) {
      updateData.content = updateLatestNewsDto.content;
    }
    if (updateLatestNewsDto.description != null) {
      updateData.description = updateLatestNewsDto.description;
    }
    if (updateLatestNewsDto.status) {
      updateData.status = updateLatestNewsDto.status;
      // Set published_date when status changes to published
      if (
        updateLatestNewsDto.status === LatestNewStatus.published &&
        !existingNews.publishedDate
      ) {
        updateData.publishedDate = new Date();
      }
    }
    if (updateLatestNewsDto.published_date != null) {
      updateData.publishedDate = updateLatestNewsDto.published_date
        ? new Date(updateLatestNewsDto.published_date)
        : null;
    }

    // Always update updatedBy when any update is made
    if (userId) {
      updateData.updatedBy = BigInt(userId);
    }

    let webThumbnailMediaId = existingNews.webThumbnailMediaId;
    let mobileThumbnailMediaId = existingNews.mobileThumbnailMediaId;

    // Handle Web thumbnail update
    if (files?.webThumbnail) {
      const webMedia = await this.mediaService.create(
        files.webThumbnail,
        'latest-news',
      );
      // Delete old media file
      if (existingNews.webThumbnailMediaId) {
        await this.mediaService.delete(existingNews.webThumbnailMediaId);
      }
      webThumbnailMediaId = webMedia.id;
      updateData.webThumbnailMediaId = webThumbnailMediaId;
    }

    // Handle mobile thumbnail update
    if (files?.mobileThumbnail) {
      const mobileMedia = await this.mediaService.create(
        files.mobileThumbnail,
        'latest-news',
      );
      // Delete old media file
      if (existingNews.mobileThumbnailMediaId) {
        await this.mediaService.delete(existingNews.mobileThumbnailMediaId);
      }
      mobileThumbnailMediaId = mobileMedia.id;
      updateData.mobileThumbnailMediaId = mobileThumbnailMediaId;
    }

    const updatedNews = await this.prisma.latestNew.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
      },
    });

    // Log operation if userId is provided
    if (userId) {
      // Log operation - differentiate draft vs publish changes
      let operationDesc = `更新最新资讯: ${updatedNews.title}`;
      if (updateLatestNewsDto.status === LATEST_NEWS_STATUS.PUBLISHED) {
        operationDesc = `更新并发布最新资讯: ${updatedNews.title}`;
      } else if (updateLatestNewsDto.status === LATEST_NEWS_STATUS.DRAFT) {
        operationDesc = `更新最新资讯草稿: ${updatedNews.title}`;
      }

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.LATEST_NEWS_POSTS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.LATEST_NEW as TargetType,
        targetId: updatedNews.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return updatedNews;
  }

  async remove(id: number, userId?: string): Promise<void> {
    const existingNews = await this.findOne(id);

    // Delete associated media files
    if (existingNews.webThumbnailMediaId) {
      await this.mediaService.delete(existingNews.webThumbnailMediaId);
    }
    if (existingNews.mobileThumbnailMediaId) {
      await this.mediaService.delete(existingNews.mobileThumbnailMediaId);
    }

    await this.prisma.latestNew.delete({
      where: { id: BigInt(id) },
    });

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.DELETE as OperationType,
        module: MODULE_TYPE.LATEST_NEWS_POSTS as ModuleType,
        operationDesc: `删除最新资讯: ${existingNews.title}`,
        targetType: TARGET_TYPE.LATEST_NEW as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }
  }

  async toggleFeatured(id: number, userId?: string): Promise<LatestNew> {
    const existingNews = await this.findOne(id);

    const result = await this.prisma.latestNew.update({
      where: { id: BigInt(id) },
      data: {
        featured: !existingNews.featured,
        ...(userId && { updatedBy: BigInt(userId) }),
      },
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
      },
    });

    // Log operation if userId is provided
    if (userId) {
      const operationDesc = result.featured
        ? `设置最新资讯为推荐: ${result.title}`
        : `取消最新资讯推荐: ${result.title}`;

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.LATEST_NEWS_POSTS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.LATEST_NEW as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return result;
  }

  async updateStatus(id: number, status: LatestNewStatus, userId?: string) {
    const existingNews = await this.findOne(id);

    const result = await this.prisma.latestNew.update({
      where: { id: BigInt(id) },
      data: {
        status,
        // Set published_date when status changes to published for the first time
        publishedDate:
          status === LatestNewStatus.published && !existingNews.publishedDate
            ? new Date()
            : existingNews.publishedDate,
        ...(userId && { updatedBy: BigInt(userId) }),
      },
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
      },
    });

    // Log operation if userId is provided
    if (userId) {
      // Log operation - differentiate publish/unpublish/draft
      let operationDesc = `更新最新资讯状态: ${result.title}`;
      if (status === LATEST_NEWS_STATUS.PUBLISHED) {
        operationDesc = `发布最新资讯: ${result.title}`;
      } else if (status === LATEST_NEWS_STATUS.UNPUBLISHED) {
        operationDesc = `取消发布最新资讯: ${result.title}`;
      } else if (status === LATEST_NEWS_STATUS.DRAFT) {
        operationDesc = `设置最新资讯为草稿: ${result.title}`;
      }

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.LATEST_NEWS_POSTS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.LATEST_NEW as TargetType,
        targetId: result.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return result;
  }

  async groupByCategory() {
    const categories = await this.prisma.category.findMany({
      where: {
        status: 'enabled',
        type: 'latestNew',
      },
      orderBy: {
        order: 'asc',
      },
    });

    const result: Array<{
      category: {
        id: bigint;
        name: string;
        slug: string;
      };
      news: any[];
    }> = [];

    for (const category of categories) {
      const latestNews = await this.prisma.latestNew.findMany({
        where: {
          categoryId: category.id,
          status: LatestNewStatus.published,
        },
        orderBy: [
          { featured: 'desc' },
          {
            publishedDate: {
              sort: 'desc',
              nulls: 'last',
            },
          },
        ],
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          publishedDate: true,
          featured: true,
          webThumbnail: true,
          mobileThumbnail: true,
          category: true,
          createdAt: true,
        },
        take: 3,
      });

      result.push({
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
        news: latestNews.map((n) => this.mapPublic(n)),
      });
    }

    return result;
  }

  async getSeoData(slug: string) {
    const article = await this.prisma.latestNew.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true,
        publishedDate: true,
        webThumbnail: true,
        category: {
          select: { slug: true },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('文章未找到');
    }
    return {
      ...article,
      description: htmlToText(article.description), // Convert HTML to plain text for SEO
      web_thumbnail: article.webThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(article.webThumbnail)
        : null,
    };
  }
}
