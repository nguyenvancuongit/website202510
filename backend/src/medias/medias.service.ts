import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Media, MediaType } from '@prisma/client';
import * as path from 'path';
import { LocalStorageService } from './local-storage.service';
import { appConfig } from 'src/common/config/app.config';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly localStorageService: LocalStorageService,
  ) { }

  getMediaTypeFromMimetype(mimetype: string): MediaType {
    if (mimetype.startsWith('image/')) {
      return MediaType.image;
    } else if (mimetype.startsWith('video/')) {
      return MediaType.video;
    } else if (mimetype.startsWith('audio/')) {
      return MediaType.audio;
    } else {
      return MediaType.document;
    }
  }

  private getFolderByUploadType(
    uploadType:
      | 'banner'
      | 'post'
      | 'image'
      | 'latest-news'
      | 'honor'
      | 'case-studies'
      | 'products'
      | 'solutions'
      | 'medias',
  ): string {
    switch (uploadType) {
      case 'banner':
        return 'banners';
      case 'post':
        return 'posts';
      case 'image':
        return 'images';
      case 'latest-news':
        return 'latest-news';
      case 'honor':
        return 'honors';
      case 'case-studies':
        return 'case-studies';
      case 'products':
        return 'products';
      case 'solutions':
        return 'solutions';
      case 'medias':
        return 'medias';
      default:
        throw new BadRequestException('Invalid upload type');
    }
  }

  async create(
    file: Express.Multer.File,
    uploadType:
      | 'banner'
      | 'post'
      | 'image'
      | 'latest-news'
      | 'honor'
      | 'case-studies'
      | 'products'
      | 'solutions'
      | 'medias',
    altText?: string,
    caption?: string,
    uploadBy?: bigint,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Determine the media type based on MIME type
    const mediaType = this.getMediaTypeFromMimetype(file.mimetype);
    const folder = this.getFolderByUploadType(uploadType);

    // Get the relative path for storage in database
    const relativePath = `/uploads/${folder}/${file.filename}`;

    // Get the absolute path for file operations
    const absolutePath = path.join(
      process.cwd(),
      'uploads',
      folder,
      file.filename,
    );

    try {
      // Create Media record in database
      const media = await this.prisma.media.create({
        data: {
          name: file.filename,
          path: relativePath,
          type: mediaType,
          size: file.size,
          altText: altText || null,
          caption: caption || null,
          uploadBy: uploadBy || null,
        },
        include: {
          uploader: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      return media;
    } catch (error) {
      // If database operation fails, try to clean up the uploaded file
      await this.localStorageService.removeFile(absolutePath);

      throw new BadRequestException(
        `Failed to create media record: ${error.message}`,
      );
    }
  }

  async findAll(userId?: bigint) {
    const where: any = {};

    // Filter by uploader if userId provided
    if (userId) {
      where.uploadBy = userId;
    }

    const [medias, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        include: {
          uploader: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where }),
    ]);

    const mediasWithFullUrl = medias.map((media) => ({
      ...media,
      path: `${appConfig.uploadConfig.host}${media.path}`,
      id: media.id.toString(),
      uploadBy: media.uploadBy?.toString(),
      uploader: media.uploader
        ? {
          ...media.uploader,
          id: media.uploader.id.toString(),
        }
        : null,
    }));

    return {
      data: mediasWithFullUrl,
    };
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    uploadBy?: bigint,
  ): Promise<any> {
    const uploadPromises = files.map(async (file) => {
      try {
        const media = await this.create(
          file,
          'medias',
          undefined,
          undefined,
          uploadBy,
        );

        return {
          id: media.id.toString(),
          name: media.name,
          path: `${appConfig.uploadConfig.host}${media.path}`,
          type: media.type,
          size: media.size,
          upload_by: media.uploadBy?.toString(),
          created_at: media.createdAt.toISOString(),
          uploader: media.uploader
            ? {
              id: media.uploader.id.toString(),
              username: media.uploader.username,
            }
            : undefined,
        };
      } catch (error) {
        console.error(`Failed to upload file ${file.originalname}:`, error);
      }
    });

    return await Promise.all(uploadPromises);
  }

  async getById(id: bigint) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new BadRequestException('Media not found');
    }

    return media;
  }

  async getAll(skip = 0, take = 10, type?: MediaType) {
    const where = type ? { type } : {};

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      data: media,
      meta: {
        total,
        skip,
        take,
        hasMore: skip + take < total,
      },
    };
  }

  async delete(id: bigint) {
    const media = await this.getById(id);

    try {
      console.log('start to delete file', media.path);

      await this.localStorageService.removeFile(media.path);

      console.log('file deleted successfully', media.path);
      await this.prisma.media.delete({
        where: { id },
      });

      console.log('media deleted successfully', media.path);
      return {
        message: 'Media deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to delete media: ${error.message}`);
    }
  }

  async update(id: bigint, altText?: string, caption?: string) {
    const updateData: any = {};

    if (altText !== undefined) {
      updateData.altText = altText;
    }

    if (caption !== undefined) {
      updateData.caption = caption;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No update data provided');
    }

    try {
      const media = await this.prisma.media.update({
        where: { id },
        data: updateData,
      });

      return {
        message: 'Media updated successfully',
        data: media,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to update media: ${error.message}`);
    }
  }

  mappingMediaWithCompleteUrl(media: Media): Media {
    return {
      ...media,
      path: `${appConfig.uploadConfig.host}${media.path}`,
    };
  }
}
