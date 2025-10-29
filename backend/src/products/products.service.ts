import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ProductStatus } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { MediaService } from '../medias/medias.service';
import { PRODUCT_STATUS } from 'src/common/config';
import { generateSlug } from '../common/helpers/slugify';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private mediaService: MediaService,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<any> {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: BigInt(createProductDto.category_id) },
    });

    if (!category) {
      throw new BadRequestException('分类不存在');
    }

    // Check if product name already exists
    const existingProduct = await this.prisma.product.findFirst({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new BadRequestException('产品名称已存在');
    }

    // Generate slug from name
    const slug = generateSlug(createProductDto.name);

    // Validate banner media
    const bannerMediaId = await this.validateBannerMedia(
      createProductDto.banner_media_id,
    );

    // Process sections with media IDs
    const sectionsDataWithImages = await this.processSections(
      createProductDto.sections || [],
    );

    // Create product with sections and sub items
    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        slug: slug,
        sortOrder: createProductDto.sort_order || 0,
        status: createProductDto.status || PRODUCT_STATUS.DRAFT,
        featured: createProductDto.featured || false,
        categoryId: BigInt(createProductDto.category_id),
        bannerMediaId: bannerMediaId,
        sections:
          sectionsDataWithImages.length > 0
            ? {
              create: sectionsDataWithImages,
            }
            : undefined,
      },
      include: {
        category: true,
        bannerMedia: true,
        sections: {
          include: {
            sectionSubItems: {
              include: {
                SubItemImage: true,
                ctaIcon: true,
              },
              orderBy: { createdAt: 'asc' },
            },
            sectionImage: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    // Map media URLs before returning
    return this.mapProductWithMediaUrls(product);
  }

  async findAll(query: QueryProductDto): Promise<any> {
    const {
      page = 1,
      limit = 10,
      search,
      category_id,
      sort_by = 'sort_order',
      sort_order = 'asc',
    } = query;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (category_id) {
      where.categoryId = BigInt(category_id);
    }

    const orderBy: any = {};
    // Map frontend sort_by names to Prisma field names
    const sortByMapping = {
      sort_order: 'sortOrder',
      name: 'name',
      status: 'status',
      featured: 'featured',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };

    const prismaFieldName = sortByMapping[sort_by] || sort_by;
    orderBy[prismaFieldName] = sort_order;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          bannerMedia: true,
          sections: {
            include: {
              sectionSubItems: {
                include: {
                  SubItemImage: true,
                  ctaIcon: true,
                },
                orderBy: { createdAt: 'asc' },
              },
              sectionImage: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map((product) => this.mapProductWithMediaUrls(product)),
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id: BigInt(id) },
      include: {
        category: true,
        bannerMedia: true,
        sections: {
          include: {
            sectionSubItems: {
              include: {
                SubItemImage: true,
                ctaIcon: true,
              },
              orderBy: { createdAt: 'asc' },
            },
            sectionImage: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('产品未找到');
    }

    return this.mapProductWithMediaUrls(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<any> {
    const existingProduct = await this.findOne(id);

    console.log(updateProductDto);

    // Check category exists if category_id is being updated
    if (updateProductDto.category_id) {
      const category = await this.prisma.category.findUnique({
        where: { id: BigInt(updateProductDto.category_id) },
      });

      if (!category) {
        throw new BadRequestException('分类不存在');
      }
    }

    // Check name uniqueness if name is being updated and generate slug
    let slug = existingProduct.slug;
    if (
      updateProductDto.name &&
      updateProductDto.name !== existingProduct.name
    ) {
      const duplicateName = await this.prisma.product.findFirst({
        where: {
          name: updateProductDto.name,
          NOT: { id: BigInt(id) },
        },
      });

      if (duplicateName) {
        throw new BadRequestException('产品名称已存在');
      }

      // Generate new slug from updated name
      slug = generateSlug(updateProductDto.name);
    }

    let bannerMediaId = existingProduct.bannerMediaId;

    // Handle banner media updates
    if (updateProductDto.banner_media_id !== undefined) {
      bannerMediaId = await this.validateBannerMedia(
        updateProductDto.banner_media_id,
      );
    }

    // If sections are provided, replace all sections
    let sectionsDataWithImages: any[] = [];
    if (updateProductDto.sections) {
      // Delete existing sections (CASCADE will handle sub items)
      await this.prisma.section.deleteMany({
        where: { productId: BigInt(id) },
      });

      // Process sections with media IDs
      sectionsDataWithImages = await this.processSections(
        updateProductDto.sections,
      );
    }

    // Update product
    const updatedProduct = await this.prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        slug: slug,
        sortOrder: updateProductDto.sort_order,
        status: updateProductDto.status,
        featured: updateProductDto.featured,
        categoryId: updateProductDto.category_id
          ? BigInt(updateProductDto.category_id)
          : undefined,
        bannerMediaId: bannerMediaId,
        sections:
          sectionsDataWithImages.length > 0
            ? {
              create: sectionsDataWithImages,
            }
            : undefined,
      },
      include: {
        category: true,
        bannerMedia: true,
        sections: {
          include: {
            sectionSubItems: {
              include: {
                SubItemImage: true,
                ctaIcon: true,
              },
              orderBy: { createdAt: 'asc' },
            },
            sectionImage: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return this.mapProductWithMediaUrls(updatedProduct);
  }

  // Helper method to validate and get banner media ID
  private async validateBannerMedia(
    bannerMediaId: number | null | undefined,
  ): Promise<bigint | null> {
    if (!bannerMediaId) {
      return null;
    }

    const bannerMedia = await this.mediaService.getById(BigInt(bannerMediaId));
    if (!bannerMedia) {
      throw new BadRequestException('Banner媒体不存在');
    }
    return bannerMedia.id;
  }

  // Helper method to process sub-items with media validation
  private async processSubItems(subItems: any[]): Promise<any[]> {
    if (!subItems || subItems.length === 0) {
      return [];
    }

    return await Promise.all(
      subItems.map(async (subItem, subItemIndex) => {
        let subItemImageMediaId: bigint | null = null;
        let ctaIconMediaId: bigint | null = null;

        // Use sub-item image media ID if provided
        if (subItem.sub_item_image_media_id !== undefined) {
          if (subItem.sub_item_image_media_id === null) {
            subItemImageMediaId = null;
          } else {
            const subItemMedia = await this.mediaService.getById(
              BigInt(subItem.sub_item_image_media_id),
            );
            if (!subItemMedia) {
              throw new BadRequestException(
                `Sub item ${subItemIndex + 1} 图片媒体不存在`,
              );
            }
            subItemImageMediaId = subItemMedia.id;
          }
        }

        // Use CTA icon media ID if provided
        if (subItem.cta_icon_media_id !== undefined) {
          if (subItem.cta_icon_media_id === null) {
            ctaIconMediaId = null;
          } else {
            const ctaIconMedia = await this.mediaService.getById(
              BigInt(subItem.cta_icon_media_id),
            );
            if (!ctaIconMedia) {
              throw new BadRequestException(
                `Sub item ${subItemIndex + 1} CTA图标媒体不存在`,
              );
            }
            ctaIconMediaId = ctaIconMedia.id;
          }
        }

        return {
          title: subItem.title,
          description: subItem.description,
          ctaText: subItem.cta_text,
          ctaIconMediaId: ctaIconMediaId,
          subItemImageMediaId: subItemImageMediaId,
        };
      }),
    );
  }

  // Helper method to process sections with media validation
  private async processSections(sections: any[]): Promise<any[]> {
    if (!sections || sections.length === 0) {
      return [];
    }

    return await Promise.all(
      sections.map(async (section, sectionIndex) => {
        let sectionImageMediaId: bigint | null = null;

        // Use section image media ID if provided
        if (section.section_image_media_id !== undefined) {
          if (section.section_image_media_id === null) {
            sectionImageMediaId = null;
          } else {
            const sectionMedia = await this.mediaService.getById(
              BigInt(section.section_image_media_id),
            );
            if (!sectionMedia) {
              throw new BadRequestException(
                `Section ${sectionIndex + 1} 图片媒体不存在`,
              );
            }
            sectionImageMediaId = sectionMedia.id;
          }
        }

        // Process sub-items
        const subItemsDataWithImages = await this.processSubItems(
          section.sub_items || [],
        );

        return {
          sectionType: section.section_type,
          title: section.title,
          description: section.description,
          subTitle: section.sub_title,
          subDescription: section.sub_description,
          sectionImageMediaId: sectionImageMediaId,
          sectionImageTitle: section.section_image_title,
          sectionImageDescription: section.section_image_description,
          ctaText: section.cta_text || '合作咨询',
          ctaLink: section.cta_link,
          sortOrder: section.sort_order || sectionIndex,
          isActive: section.is_active ?? true,
          sectionSubItems:
            subItemsDataWithImages.length > 0
              ? {
                create: subItemsDataWithImages,
              }
              : undefined,
        };
      }),
    );
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    // Delete banner media if exists
    if (product.bannerMediaId) {
      await this.mediaService.delete(product.bannerMediaId);
    }

    // Delete all section images
    for (const section of product.sections) {
      if (section.sectionImageMediaId) {
        await this.mediaService.delete(section.sectionImageMediaId);
      }
    }

    await this.prisma.product.delete({
      where: { id: BigInt(id) },
    });
  }

  // Public methods for landing page
  async findPublicAll(query: QueryProductDto): Promise<any> {
    const {
      page = 1,
      limit = 10,
      category_id,
      sort_by = 'sort_order',
      sort_order = 'asc',
    } = query;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (category_id) {
      where.categoryId = BigInt(category_id);
    }

    const orderBy: any = {};
    // Map frontend sort_by names to Prisma field names
    const sortByMapping = {
      sort_order: 'sortOrder',
      name: 'name',
      status: 'status',
      featured: 'featured',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };

    const prismaFieldName = sortByMapping[sort_by] || sort_by;
    orderBy[prismaFieldName] = sort_order;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          bannerMedia: true,
          sections: {
            include: {
              sectionSubItems: {
                include: {
                  SubItemImage: true,
                  ctaIcon: true,
                },
                orderBy: { createdAt: 'asc' },
              },
              sectionImage: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        bannerMedia: true,
        sections: {
          include: {
            sectionSubItems: {
              include: {
                SubItemImage: true,
                ctaIcon: true,
              },
              orderBy: { createdAt: 'asc' },
            },
            sectionImage: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('产品未找到');
    }

    return this.mapProductWithMediaUrls(product);
  }

  // Helper method to map media URLs for a product
  private mapProductWithMediaUrls(product: any): any {
    return {
      ...product,
      bannerMedia: product.bannerMedia
        ? this.mediaService.mappingMediaWithCompleteUrl(product.bannerMedia)
        : null,
      banner_media: product.bannerMedia
        ? this.mediaService.mappingMediaWithCompleteUrl(product.bannerMedia)
        : null,
      sections:
        product.sections?.map((section: any) => ({
          ...section,
          sectionImage: section.sectionImage
            ? this.mediaService.mappingMediaWithCompleteUrl(
              section.sectionImage,
            )
            : null,
          sectionSubItems:
            section.sectionSubItems?.map((subItem: any) => ({
              ...subItem,
              imageMedia: subItem.SubItemImage
                ? this.mediaService.mappingMediaWithCompleteUrl(
                  subItem.SubItemImage,
                )
                : null,
              image_media: subItem.SubItemImage
                ? this.mediaService.mappingMediaWithCompleteUrl(
                  subItem.SubItemImage,
                )
                : null,
              sub_item_image: subItem.SubItemImage
                ? this.mediaService.mappingMediaWithCompleteUrl(
                  subItem.SubItemImage,
                )
                : null,
              cta_icon: subItem.ctaIcon
                ? this.mediaService.mappingMediaWithCompleteUrl(subItem.ctaIcon)
                : null,
            })) || [],
        })) || [],
    };
  }

  async toggleFeatured(id: number): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id: BigInt(id) },
    });

    if (!product) {
      throw new NotFoundException('产品未找到');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        featured: !product.featured,
        updatedAt: new Date(),
      },
      include: {
        category: true,
        bannerMedia: true,
        sections: {
          include: {
            sectionSubItems: {
              include: {
                SubItemImage: true,
                ctaIcon: true,
              },
              orderBy: { createdAt: 'asc' },
            },
            sectionImage: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return this.mapProductWithMediaUrls(updatedProduct);
  }

  async updateStatus(id: number, status: ProductStatus): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id: BigInt(id) },
    });

    if (!product) {
      throw new NotFoundException('产品未找到');
    }

    // Validate status
    const validStatuses = Object.values(PRODUCT_STATUS);
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('无效的状态值');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        status: status,
        updatedAt: new Date(),
      },
      include: {
        category: true,
        bannerMedia: true,
        sections: {
          include: {
            sectionSubItems: {
              include: {
                SubItemImage: true,
                ctaIcon: true,
              },
              orderBy: { createdAt: 'asc' },
            },
            sectionImage: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return this.mapProductWithMediaUrls(updatedProduct);
  }
}
