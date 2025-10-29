import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  QueryCategoriesDto,
} from './dto/query-categories.dto';
import { UpdateCategoryOrderDto } from './dto/update-category-order.dto';
import {
  CategoryStatus,
  CategoryType as PrismaCategoryType,
} from '@prisma/client';
import { generateSlug } from 'src/common/helpers/slugify';
import { CategoryType } from './types';
import { OperationLogService } from '../operation-logs/operation-log.service';
import {
  OPERATION_TYPE,
  MODULE_TYPE,
  TARGET_TYPE,
  CATEGORY_STATUS,
  OPERATION_STATUS,
  LATEST_NEWS_STATUS,
  CASE_STUDY_STATUS,
  PRODUCT_STATUS,
  SOLUTION_STATUS,
} from '../common/config/constants';
import type {
  OperationType,
  ModuleType,
  TargetType,
} from '../common/config/constants';

// Mapping function to convert custom CategoryType to Prisma CategoryType
function mapCategoryTypeToPrisma(
  categoryType: CategoryType,
): PrismaCategoryType {
  const mapping: Record<CategoryType, PrismaCategoryType> = {
    [CategoryType.LATEST_NEW]: 'latestNew' as PrismaCategoryType,
    [CategoryType.PRODUCT]: 'product' as PrismaCategoryType,
    [CategoryType.SOLUTION]: 'solution' as PrismaCategoryType,
    [CategoryType.CASE_STUDY]: 'caseStudy' as PrismaCategoryType,
  };
  return mapping[categoryType];
}

// Mapping function to get appropriate module type based on category type
function getModuleTypeByCategory(categoryType: CategoryType): ModuleType {
  const mapping: Record<CategoryType, ModuleType> = {
    [CategoryType.LATEST_NEW]: MODULE_TYPE.LATEST_NEWS_CATEGORIES as ModuleType,
    [CategoryType.CASE_STUDY]: MODULE_TYPE.CASE_STUDIES_CATEGORIES as ModuleType,
    [CategoryType.PRODUCT]: MODULE_TYPE.PRODUCT_CATEGORIES as ModuleType,
    [CategoryType.SOLUTION]: MODULE_TYPE.SOLUTION_CATEGORIES as ModuleType,
  };
  return mapping[categoryType];
}

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private readonly operationLogService: OperationLogService,
  ) { }

  async create(
    createCategoryDto: CreateCategoryDto,
    categoryType: CategoryType,
    userId?: string,
  ) {
    const prismaCategoryType = mapCategoryTypeToPrisma(categoryType);

    // Check if name already exists for this category type
    const existingByName = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name,
        type: prismaCategoryType,
      },
    });

    if (existingByName) {
      throw new BadRequestException('此分类名称已存在');
    }

    const slug = generateSlug(createCategoryDto.name);

    // Get the highest order number for this category type and increment it
    const lastCategory = await this.prisma.category.findFirst({
      where: { type: prismaCategoryType },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = lastCategory ? lastCategory.order + 1 : 1;

    const categoryData = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        slug: slug,
        order: nextOrder,
        type: prismaCategoryType,
        status: createCategoryDto.status ?? CategoryStatus.enabled,
        publishedPost: 0, // Always initialize to 0, not editable via API
      },
    });

    // Log operation if userId is provided
    if (userId) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.CREATE as OperationType,
        module: getModuleTypeByCategory(categoryType),
        operationDesc: `创建${categoryType}分类`,
        targetType: TARGET_TYPE.CATEGORY as TargetType,
        targetId: categoryData.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return categoryData;
  }

  async findAll(queryDto: QueryCategoriesDto, categoryType: CategoryType) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sort_by = 'order',
      sort_order = 'asc',
    } = queryDto;

    const prismaCategoryType = mapCategoryTypeToPrisma(categoryType);

    // Build where clause
    const where: any = {
      type: prismaCategoryType, // Filter by category type
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status !== undefined) {
      where.status = status;
    }

    // Build order by
    const orderBy: any = {};

    if (sort_by === 'name') {
      orderBy.name = sort_order;
    } else if (sort_by === 'order') {
      orderBy.order = sort_order;
    } else if (sort_by === 'status') {
      orderBy.status = sort_order;
    } else if (sort_by === 'published_post') {
      orderBy.publishedPost = sort_order;
    } else if (sort_by === 'updated_at') {
      orderBy.updatedAt = sort_order;
    } else {
      orderBy.createdAt = sort_order;
    }

    // Get total count
    const total = await this.prisma.category.count({ where });

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    // Get data with published post count using Prisma's _count feature
    let includeConfig: any = {};

    switch (categoryType) {
      case CategoryType.LATEST_NEW:
        includeConfig = {
          _count: {
            select: {
              latestNews: {
                where: { status: LATEST_NEWS_STATUS.PUBLISHED },
              },
            },
          },
        };
        break;
      case CategoryType.CASE_STUDY:
        includeConfig = {
          _count: {
            select: {
              caseStudies: {
                where: { status: CASE_STUDY_STATUS.PUBLISHED },
              },
            },
          },
        };
        break;
      case CategoryType.PRODUCT:
        includeConfig = {
          _count: {
            select: {
              products: {
                where: { status: PRODUCT_STATUS.PUBLISHED },
              },
            },
          },
        };
        break;
      case CategoryType.SOLUTION:
        includeConfig = {
          _count: {
            select: {
              solutions: {
                where: { status: SOLUTION_STATUS.PUBLISHED },
              },
            },
          },
        };
        break;
      default:
        includeConfig = { _count: { select: {} } };
        break;
    }

    const data = await this.prisma.category.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      include: includeConfig,
    });

    // Transform data to include publishedPost count
    const dataWithPublishedCount = data.map((category) => {
      let publishedPostCount = 0;

      if (category._count) {
        switch (categoryType) {
          case CategoryType.LATEST_NEW:
            publishedPostCount = (category._count as any).latestNews || 0;
            break;
          case CategoryType.CASE_STUDY:
            publishedPostCount = (category._count as any).caseStudies || 0;
            break;
          case CategoryType.PRODUCT:
            publishedPostCount = (category._count as any).products || 0;
            break;
          case CategoryType.SOLUTION:
            publishedPostCount = (category._count as any).solutions || 0;
            break;
        }
      }

      delete category._count;
      return {
        ...category,
        publishedPost: publishedPostCount,
      };
    });

    // Re-sort if sorting by published_post since we've updated the values
    if (sort_by === 'published_post') {
      dataWithPublishedCount.sort((a, b) => {
        return sort_order === 'asc'
          ? a.publishedPost - b.publishedPost
          : b.publishedPost - a.publishedPost;
      });
    }

    return {
      data: dataWithPublishedCount,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findPublicAll(
    categoryType: CategoryType,
  ) {
    const data = await this.prisma.category.findMany({
      where: {
        status: CategoryStatus.enabled,
        type: mapCategoryTypeToPrisma(categoryType),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        order: true,
      },
      orderBy: [{ order: 'asc' }],
    });

    return data;
  }

  async findOne(id: number, categoryType: CategoryType) {
    const prismaCategoryType = mapCategoryTypeToPrisma(categoryType);

    const latestNewCategory = await this.prisma.category.findFirst({
      where: {
        id: BigInt(id),
        type: prismaCategoryType, // Ensure the category belongs to the specified type
      },
    });

    if (!latestNewCategory) {
      throw new NotFoundException('分类不存在');
    }

    return latestNewCategory;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    categoryType: CategoryType,
    userId?: string,
  ) {
    const prismaCategoryType = mapCategoryTypeToPrisma(categoryType);

    // Check if category exists and belongs to the specified type
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        id: BigInt(id),
        type: prismaCategoryType,
      },
    });

    if (!existingCategory) {
      throw new NotFoundException('分类不存在');
    }
    let slug = existingCategory.slug;
    // Check if name already exists (excluding current category)
    if (updateCategoryDto.name) {
      const existingByName = await this.prisma.category.findFirst({
        where: {
          name: updateCategoryDto.name,
          type: prismaCategoryType, // Only check within the same category type
          id: { not: BigInt(id) },
        },
      });

      if (existingByName) {
        throw new BadRequestException('此分类名称已存在');
      }

      // Regenerate slug if name is changed and slug is not explicitly provided
      slug = generateSlug(updateCategoryDto.name);
    }

    const result = await this.prisma.category.update({
      where: { id: BigInt(id) },
      data: {
        ...updateCategoryDto,
        slug: slug,
      },
    });

    // Log operation if userId is provided
    if (userId) {
      // Determine operation description based on status change
      let operationDesc = `编辑${categoryType}分类`;
      let operationType = OPERATION_TYPE.UPDATE as OperationType;
      if (
        updateCategoryDto.status &&
        updateCategoryDto.status === CATEGORY_STATUS.ENABLED
      ) {
        operationDesc = `启用${categoryType}分类`;
        operationType = OPERATION_TYPE.ENABLE as OperationType;
      } else if (
        updateCategoryDto.status &&
        updateCategoryDto.status === CATEGORY_STATUS.DISABLED
      ) {
        operationDesc = `禁用${categoryType}分类`;
        operationType = OPERATION_TYPE.DISABLE as OperationType;
      }

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: operationType,
        module: getModuleTypeByCategory(categoryType),
        operationDesc,
        targetType: TARGET_TYPE.CATEGORY as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return result;
  }

  async remove(id: number, categoryType?: CategoryType, userId?: string) {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingCategory) {
      throw new NotFoundException('分类不存在');
    }

    const result = await this.prisma.category.delete({
      where: { id: BigInt(id) },
    });

    // Log operation if userId and categoryType are provided
    if (userId && categoryType) {
      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.DELETE as OperationType,
        module: getModuleTypeByCategory(categoryType),
        operationDesc: `删除${categoryType}分类`,
        targetType: TARGET_TYPE.CATEGORY as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return result;
  }

  //   todo: validate order should not be the same
  async updateOrder(updateCategoryOrderDto: UpdateCategoryOrderDto) {
    const { category_orders } = updateCategoryOrderDto;

    // Extract category IDs to check if they exist
    const categoryIds = category_orders.map((order) => BigInt(order.id));

    // Check if all category IDs exist
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    if (categories.length !== categoryIds.length) {
      throw new BadRequestException('一个或多个分类ID未找到');
    }

    // Update order for each category
    const updatePromises = category_orders.map((order) =>
      this.prisma.category.update({
        where: { id: BigInt(order.id) },
        data: { order: order.order },
      }),
    );

    await Promise.all(updatePromises);

    return { message: '分类顺序更新成功' };
  }

  async findByStatus(status: CategoryStatus) {
    return await this.prisma.category.findMany({
      where: { status },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
  }

  // Internal method to update published post count - not exposed via API
  async updatePublishedPostCount(id: number, count: number) {
    return await this.prisma.category.update({
      where: { id: BigInt(id) },
      data: { publishedPost: count },
    });
  }

  // Internal method to increment published post count - not exposed via API
  async incrementPublishedPostCount(id: number) {
    return await this.prisma.category.update({
      where: { id: BigInt(id) },
      data: { publishedPost: { increment: 1 } },
    });
  }

  // Internal method to decrement published post count - not exposed via API
  async decrementPublishedPostCount(id: number) {
    return await this.prisma.category.update({
      where: { id: BigInt(id) },
      data: { publishedPost: { decrement: 1 } },
    });
  }
}
