import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
import { QueryCaseStudyDto } from './dto/query-case-study.dto';
import { CaseStudy, CaseStudyStatus, CategoryStatus } from '@prisma/client';
import { MediaService } from '../medias/medias.service';
import { generateSlug } from '../common/helpers/slugify';
import { CategoriesService } from 'src/categories/categories.service';
import { OperationLogService } from '../operation-logs/operation-log.service';
import {
  CASE_STUDY_STATUS,
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
export class CaseStudiesService {
  constructor(
    private prisma: PrismaService,
    private mediaService: MediaService,
    private readonly categoryService: CategoriesService,
    private readonly operationLogService: OperationLogService,
  ) { }

  async create(
    createCaseStudyDto: CreateCaseStudyDto,
    files: {
      webThumbnail: Express.Multer.File;
      mobileThumbnail: Express.Multer.File;
      customerLogo?: Express.Multer.File;
    },
    userId?: string,
  ): Promise<any> {
    let webThumbnailMediaId: bigint | null = null;
    let mobileThumbnailMediaId: bigint | null = null;
    let customerLogoMediaId: bigint | null = null;

    // check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: BigInt(createCaseStudyDto.category_id) },
    });

    if (!category) {
      throw new BadRequestException('分类不存在');
    }

    const existingTitle = await this.prisma.caseStudy.findFirst({
      where: { title: createCaseStudyDto.title },
    });

    if (existingTitle) {
      throw new BadRequestException('此标题已存在');
    }

    // Generate slug from title
    const slug = generateSlug(createCaseStudyDto.title);

    // Upload thumbnails to media library
    if (files.webThumbnail) {
      const webMedia = await this.mediaService.create(
        files.webThumbnail,
        'case-studies',
      );
      webThumbnailMediaId = webMedia.id;
    }

    if (files?.mobileThumbnail) {
      const mobileMedia = await this.mediaService.create(
        files.mobileThumbnail,
        'case-studies',
      );
      mobileThumbnailMediaId = mobileMedia.id;
    }

    if (files?.customerLogo) {
      const customerLogoMedia = await this.mediaService.create(
        files.customerLogo,
        'case-studies',
      );
      customerLogoMediaId = customerLogoMedia.id;
    }

    // Only require thumbnails if status is not draft
    if (
      createCaseStudyDto.status !== CASE_STUDY_STATUS.DRAFT &&
      (!webThumbnailMediaId || !mobileThumbnailMediaId)
    ) {
      throw new BadRequestException('Web和移动端缩略图都是必需的');
    }

    // Create case study
    const createData: any = {
      title: createCaseStudyDto.title,
      slug: slug,
      status: createCaseStudyDto.status,
      featured: createCaseStudyDto.featured || false,
      categoryId: BigInt(createCaseStudyDto.category_id),
      keyHighlights: createCaseStudyDto.key_highlights || [],
    };

    // Add optional fields only if they exist
    if (createCaseStudyDto.content !== undefined) {
      createData.content = createCaseStudyDto.content;
    }
    if (createCaseStudyDto.customer_name !== undefined) {
      createData.customerName = createCaseStudyDto.customer_name;
    }
    if (createCaseStudyDto.highlight_description !== undefined) {
      createData.highlightDescription =
        createCaseStudyDto.highlight_description;
    }
    if (createCaseStudyDto.customer_feedback !== undefined) {
      createData.customerFeedback = createCaseStudyDto.customer_feedback;
    }
    if (webThumbnailMediaId !== undefined) {
      createData.webThumbnailMediaId = webThumbnailMediaId;
    }
    if (mobileThumbnailMediaId !== undefined) {
      createData.mobileThumbnailMediaId = mobileThumbnailMediaId;
    }
    if (customerLogoMediaId !== undefined) {
      createData.customerLogoMediaId = customerLogoMediaId;
    }

    const caseStudy = await this.prisma.caseStudy.create({
      data: createData,
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
        customerLogo: true,
      },
    });

    if (caseStudy.status === CaseStudyStatus.published) {
      await this.categoryService.incrementPublishedPostCount(
        Number(category.id),
      );
    }

    // Log operation if userId is provided
    if (userId) {
      const operationDesc =
        createCaseStudyDto.status === CASE_STUDY_STATUS.PUBLISHED
          ? `创建并发布案例研究: ${caseStudy.title}` // Create and publish case study: {title}
          : `创建案例研究草稿: ${caseStudy.title}`; // Create case study draft: {title}

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.CREATE as OperationType,
        module: MODULE_TYPE.CASE_STUDIES_POSTS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.CASE_STUDY as TargetType,
        targetId: caseStudy.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return caseStudy;
  }

  async findAll(queryDto: QueryCaseStudyDto) {
    const {
      page = 1,
      limit = 10,
      search,
      category_id,
      status,
      featured,
      start_date,
      end_date,
      customer_name,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = queryDto;

    const skip = (page - 1) * limit;

    // Build where conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
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

    if (customer_name) {
      where.customerName = { contains: customer_name, mode: 'insensitive' };
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
    const [caseStudies, total] = await Promise.all([
      this.prisma.caseStudy.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort_by]: sort_order,
        },
        include: {
          category: true,
          webThumbnail: true,
          mobileThumbnail: true,
          customerLogo: true,
        },
      }),
      this.prisma.caseStudy.count({ where }),
    ]);

    // Map media URLs for each case study
    const mappedCaseStudies = caseStudies.map((caseStudy) => ({
      ...caseStudy,
      webThumbnail: caseStudy.webThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(caseStudy.webThumbnail)
        : null,
      mobileThumbnail: caseStudy.mobileThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(
          caseStudy.mobileThumbnail,
        )
        : null,
      customerLogo: caseStudy.customerLogo
        ? this.mediaService.mappingMediaWithCompleteUrl(caseStudy.customerLogo)
        : null,
    }));

    return {
      data: mappedCaseStudies,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // Public: list published (optional category), sorted by featured desc then createdAt desc, with pagination
  async findPublicAll(query: QueryCaseStudyDto) {
    const { page = 1, limit = 10, category_id } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      category: {
        id: category_id ? BigInt(category_id) : undefined,
        status: CategoryStatus.enabled
      },
      status: CaseStudyStatus.published
    }

    const [rows, total] = await Promise.all([
      this.prisma.caseStudy.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          customerName: true,
          keyHighlights: true,
          highlightDescription: true,
          customerFeedback: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          },
          webThumbnail: true,
          mobileThumbnail: true,
        }
      }),
      this.prisma.caseStudy.count({ where }),
    ]);
    const data = rows.map((cs) => this.mapPublic(cs));

    return {
      data,
      pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
    };
  }

  private mapPublic(item: any) {
    // strip sensitive fields if any; map media paths if needed
    return {
      ...item,
      web_thumbnail: item.webThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(item.webThumbnail)
        : null,
      mobile_thumbnail: item.mobileThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(item.mobileThumbnail)
        : null,
    };
  }

  async findOne(id: number) {
    const caseStudy = await this.prisma.caseStudy.findUnique({
      where: { id: BigInt(id) },
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
        customerLogo: true,
      },
    });

    if (!caseStudy) {
      throw new NotFoundException('案例研究未找到');
    }

    return {
      ...caseStudy,
      webThumbnail: caseStudy.webThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(caseStudy.webThumbnail)
        : null,
      mobileThumbnail: caseStudy.mobileThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(
          caseStudy.mobileThumbnail,
        )
        : null,
      customerLogo: caseStudy.customerLogo
        ? this.mediaService.mappingMediaWithCompleteUrl(caseStudy.customerLogo)
        : null,
    };
  }

  async findBySlug(slug: string) {
    const caseStudy = await this.prisma.caseStudy.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        customerName: true,
        status: true,
        keyHighlights: true,
        highlightDescription: true,
        customerFeedback: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        webThumbnail: true,
        mobileThumbnail: true,
      },
    });

    if (!caseStudy || caseStudy.status !== CaseStudyStatus.published) {
      throw new NotFoundException('案例研究未找到');
    }

    return {
      ...caseStudy,
      webThumbnail: caseStudy.webThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(caseStudy.webThumbnail)
        : null,
      mobileThumbnail: caseStudy.mobileThumbnail
        ? this.mediaService.mappingMediaWithCompleteUrl(
          caseStudy.mobileThumbnail,
        )
        : null,
    };
  }

  async update(
    id: number,
    updateCaseStudyDto: UpdateCaseStudyDto,
    files?: {
      webThumbnail?: Express.Multer.File;
      mobileThumbnail?: Express.Multer.File;
      customerLogo?: Express.Multer.File;
    },
    userId?: string,
  ): Promise<CaseStudy> {
    // Check if case study exists
    const existingCaseStudy = await this.findOne(id);
    const updateData: any = {};

    // Validate category (if provided)
    if (updateCaseStudyDto.category_id) {
      const category = await this.prisma.category.findUnique({
        where: { id: BigInt(updateCaseStudyDto.category_id) },
      });

      if (!category) {
        throw new BadRequestException('分类不存在');
      }
      updateData.categoryId = BigInt(updateCaseStudyDto.category_id);
    }

    if (updateCaseStudyDto.title) {
      // Check for title uniqueness
      const existingTitle = await this.prisma.caseStudy.findFirst({
        where: {
          title: updateCaseStudyDto.title,
          id: { not: BigInt(id) },
        },
      });

      if (existingTitle) {
        throw new BadRequestException('此标题已存在');
      }

      updateData.title = updateCaseStudyDto.title;
      updateData.slug = generateSlug(updateCaseStudyDto.title);
    }

    // Update other fields
    if (updateCaseStudyDto.content != null) {
      updateData.content = updateCaseStudyDto.content;
    }
    if (updateCaseStudyDto.featured != null) {
      updateData.featured = updateCaseStudyDto.featured;
    }
    if (updateCaseStudyDto.status != null) {
      updateData.status = updateCaseStudyDto.status;
    }
    if (updateCaseStudyDto.customer_name != null) {
      updateData.customerName = updateCaseStudyDto.customer_name;
    }
    if (updateCaseStudyDto.key_highlights != null) {
      updateData.keyHighlights = updateCaseStudyDto.key_highlights;
    }
    if (updateCaseStudyDto.highlight_description != null) {
      updateData.highlightDescription =
        updateCaseStudyDto.highlight_description;
    }
    if (updateCaseStudyDto.customer_feedback != null) {
      updateData.customerFeedback = updateCaseStudyDto.customer_feedback;
    }

    let webThumbnailMediaId = existingCaseStudy.webThumbnailMediaId;
    let mobileThumbnailMediaId = existingCaseStudy.mobileThumbnailMediaId;
    let customerLogoMediaId = existingCaseStudy.customerLogoMediaId;

    // Handle removing web thumbnail
    if (updateCaseStudyDto.removeWebThumbnail) {
      if (existingCaseStudy.webThumbnailMediaId) {
        await this.mediaService.delete(existingCaseStudy.webThumbnailMediaId);
      }
      webThumbnailMediaId = null;
      updateData.webThumbnailMediaId = null;
    }
    // Handle Web thumbnail update
    else if (files?.webThumbnail) {
      const webMedia = await this.mediaService.create(
        files.webThumbnail,
        'case-studies',
      );
      // Delete old media file
      if (existingCaseStudy.webThumbnailMediaId) {
        await this.mediaService.delete(existingCaseStudy.webThumbnailMediaId);
      }
      webThumbnailMediaId = webMedia.id;
      updateData.webThumbnailMediaId = webThumbnailMediaId;
    }

    // Handle removing mobile thumbnail
    if (updateCaseStudyDto.removeMobileThumbnail) {
      if (existingCaseStudy.mobileThumbnailMediaId) {
        await this.mediaService.delete(
          existingCaseStudy.mobileThumbnailMediaId,
        );
      }
      mobileThumbnailMediaId = null;
      updateData.mobileThumbnailMediaId = null;
    }
    // Handle mobile thumbnail update
    else if (files?.mobileThumbnail) {
      const mobileMedia = await this.mediaService.create(
        files.mobileThumbnail,
        'case-studies',
      );
      // Delete old media file
      if (existingCaseStudy.mobileThumbnailMediaId) {
        await this.mediaService.delete(
          existingCaseStudy.mobileThumbnailMediaId,
        );
      }
      mobileThumbnailMediaId = mobileMedia.id;
      updateData.mobileThumbnailMediaId = mobileThumbnailMediaId;
    }

    // Handle removing customer logo
    if (updateCaseStudyDto.removeCustomerLogo) {
      if (existingCaseStudy.customerLogoMediaId) {
        await this.mediaService.delete(existingCaseStudy.customerLogoMediaId);
      }
      customerLogoMediaId = null;
      updateData.customerLogoMediaId = null;
    }
    // Handle customer logo update
    else if (files?.customerLogo) {
      const customerLogoMedia = await this.mediaService.create(
        files.customerLogo,
        'case-studies',
      );
      // Delete old media file
      if (existingCaseStudy.customerLogoMediaId) {
        await this.mediaService.delete(existingCaseStudy.customerLogoMediaId);
      }
      customerLogoMediaId = customerLogoMedia.id;
      updateData.customerLogoMediaId = customerLogoMediaId;
    }

    const updatedCaseStudy = await this.prisma.caseStudy.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
        customerLogo: true,
      },
    });

    // Log operation if userId is provided
    if (userId) {
      let operationDesc = `更新案例研究: ${updatedCaseStudy.title}`; // Update case study: {title}
      if (
        updateCaseStudyDto.status === CASE_STUDY_STATUS.PUBLISHED &&
        existingCaseStudy.status !== CaseStudyStatus.published
      ) {
        operationDesc = `更新并发布案例研究: ${updatedCaseStudy.title}`; // Update and publish case study: {title}
      } else if (updateCaseStudyDto.status === CASE_STUDY_STATUS.DRAFT) {
        operationDesc = `更新案例研究草稿: ${updatedCaseStudy.title}`; // Update case study draft: {title}
      } else if (updateCaseStudyDto.status === CASE_STUDY_STATUS.UNPUBLISHED) {
        operationDesc = `更新并取消发布案例研究: ${updatedCaseStudy.title}`; // Update and unpublish case study: {title}
      }

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.CASE_STUDIES_POSTS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.CASE_STUDY as TargetType,
        targetId: updatedCaseStudy.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return updatedCaseStudy;
  }

  async remove(id: number, userId?: string): Promise<void> {
    const existingCaseStudy = await this.findOne(id);

    // Delete associated media files
    if (existingCaseStudy.webThumbnailMediaId) {
      await this.mediaService.delete(existingCaseStudy.webThumbnailMediaId);
    }
    if (existingCaseStudy.mobileThumbnailMediaId) {
      await this.mediaService.delete(existingCaseStudy.mobileThumbnailMediaId);
    }
    if (existingCaseStudy.customerLogoMediaId) {
      await this.mediaService.delete(existingCaseStudy.customerLogoMediaId);
    }
    if (existingCaseStudy.status === CaseStudyStatus.published) {
      await this.categoryService.decrementPublishedPostCount(
        Number(existingCaseStudy.categoryId),
      );
    }

    await this.prisma.caseStudy.delete({
      where: { id: BigInt(id) },
    });

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.DELETE as OperationType,
        module: MODULE_TYPE.CASE_STUDIES_POSTS as ModuleType,
        operationDesc: `删除案例研究: ${existingCaseStudy.title}`, // Delete case study: {title}
        targetType: TARGET_TYPE.CASE_STUDY as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }
  }

  async toggleFeatured(id: number, userId?: string): Promise<CaseStudy> {
    const existingCaseStudy = await this.findOne(id);

    const result = await this.prisma.caseStudy.update({
      where: { id: BigInt(id) },
      data: {
        featured: !existingCaseStudy.featured,
      },
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
        customerLogo: true,
      },
    });

    // Log operation if userId is provided
    if (userId) {
      const operationDesc = result.featured
        ? `设置案例研究为推荐: ${result.title}` // Set case study as featured: {title}
        : `取消案例研究推荐: ${result.title}`; // Remove case study from featured: {title}

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.CASE_STUDIES_POSTS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.CASE_STUDY as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return result;
  }

  async updateStatus(id: number, status: CaseStudyStatus, userId?: string) {

    const result = await this.prisma.caseStudy.update({
      where: { id: BigInt(id) },
      data: { status },
      include: {
        category: true,
        webThumbnail: true,
        mobileThumbnail: true,
        customerLogo: true,
      },
    });

    // Log operation if userId is provided
    if (userId) {
      let operationDesc = `更新案例研究状态: ${result.title}`; // Update case study status: {title}
      if (status === CASE_STUDY_STATUS.PUBLISHED) {
        operationDesc = `发布案例研究: ${result.title}`; // Publish case study: {title}
      } else if (status === CASE_STUDY_STATUS.UNPUBLISHED) {
        operationDesc = `取消发布案例研究: ${result.title}`; // Unpublish case study: {title}
      } else if (status === CASE_STUDY_STATUS.DRAFT) {
        operationDesc = `设置案例研究为草稿: ${result.title}`; // Set case study as draft: {title}
      }

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.CASE_STUDIES_POSTS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.CASE_STUDY as TargetType,
        targetId: result.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return result;
  }
}
