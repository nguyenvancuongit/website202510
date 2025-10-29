// src/common/config/app.config.ts
import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import {
  API_CONFIG,
  JWT_CONFIG,
  SECURITY_CONFIG,
  UPLOAD_CONFIG,
} from './constants';

/**
 * Application Configuration
 * Centralized configuration management with environment variable support
 */
export class AppConfig {
  // Server Configuration
  static get port(): number {
    return parseInt(process.env.PORT || API_CONFIG.DEFAULT_PORT.toString(), 10);
  }

  static get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  static get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  static get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  static get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  // Database Configuration
  static get databaseUrl(): string {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    return process.env.DATABASE_URL;
  }

  // JWT Configuration
  static get jwtConfig() {
    return {
      secret: process.env.JWT_SECRET || 'vian-blog-fallback-secret',
      expiresIn: process.env.JWT_EXPIRES_IN || JWT_CONFIG.DEFAULT_EXPIRES_IN,
      clientSecret:
        process.env.CLIENT_JWT_SECRET || 'vian-blog-fallback-client-secret',
    };
  }

  // Admin Configuration
  static get adminConfig() {
    return {
      defaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || 'vian2025',
    };
  }

  // CORS Configuration
  static get corsConfig() {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const corsOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : [clientUrl];

    return {
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
  }

  // File Upload Configuration
  static get uploadConfig() {
    return {
      host: process.env.UPLOAD_HOST || UPLOAD_CONFIG.HOST,
      maxFileSize: parseInt(
        process.env.MAX_FILE_SIZE || UPLOAD_CONFIG.MAX_FILE_SIZE.toString(),
        10,
      ),
      maxVideoSize: parseInt(
        process.env.MAX_VIDEO_SIZE || UPLOAD_CONFIG.MAX_VIDEO_SIZE.toString(),
        10,
      ),
      allowedImageTypes:
        process.env.ALLOWED_FILE_TYPES?.split(',') ||
        UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES,
      allowedVideoTypes:
        process.env.ALLOWED_VIDEO_TYPES?.split(',') ||
        UPLOAD_CONFIG.ALLOWED_VIDEO_TYPES,
      uploadPath: process.env.UPLOAD_PATH || UPLOAD_CONFIG.UPLOAD_PATH,
      bannerPath: UPLOAD_CONFIG.BANNER_PATH,
      postPath: UPLOAD_CONFIG.POST_PATH,
      imagePath: UPLOAD_CONFIG.IMAGE_PATH,
      videoPath: UPLOAD_CONFIG.VIDEO_PATH,
      honorPath: UPLOAD_CONFIG.HONOR_PATH,
      latestNewsPath: UPLOAD_CONFIG.LATEST_NEWS_PATH,
      caseStudiesPath: UPLOAD_CONFIG.CASE_STUDIES_PATH,
      productsPath: UPLOAD_CONFIG.PRODUCTS_PATH,
      solutionsPath: UPLOAD_CONFIG.SOLUTIONS_PATH,
      mediasPath: UPLOAD_CONFIG.MEDIAS_PATH,
      resumesPath: './uploads/resumes',
    };
  }

  // Security Configuration
  static get securityConfig() {
    return {
      bcryptSaltRounds: parseInt(
        process.env.BCRYPT_SALT_ROUNDS ||
          SECURITY_CONFIG.BCRYPT_SALT_ROUNDS.toString(),
        10,
      ),
    };
  }

  // API Configuration
  static get apiConfig() {
    return {
      prefix: process.env.API_PREFIX || API_CONFIG.API_PREFIX,
    };
  }

  // Cache Configuration
  static get cacheConfig() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    return {
      redisUrl: url,
      defaultTtlSeconds: parseInt(process.env.CACHE_TTL || '300', 10),
      keyPrefix: process.env.CACHE_PREFIX || 'vian:',
    };
  }

  // File size validation function
  // private static validateFileSize(
  //   file: Express.Multer.File,
  //   uploadType: string,
  // ): { isValid: boolean; error?: string } {
  //   const isImage = (this.uploadConfig.allowedImageTypes as string[]).includes(
  //     file.mimetype,
  //   );
  //   const isVideo = (this.uploadConfig.allowedVideoTypes as string[]).includes(
  //     file.mimetype,
  //   );

  //   // Upload types that allow both images and videos
  //   const mixedUploadTypes = ['banner', 'medias'];
  //   const ONE_MB = 1024 * 1024;

  //   if (isImage) {
  //     // 10MB limit for images
  //     const maxImageSize = 10 * ONE_MB; // 10MB in bytes
  //     if (file.size > maxImageSize) {
  //       return {
  //         isValid: false,
  //         error: `图片文件大小不能超过10MB，当前文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
  //       };
  //     }
  //   } else if (isVideo) {
  //     // Check if this upload type allows videos
  //     if (!mixedUploadTypes.includes(uploadType) && uploadType !== 'video') {
  //       return {
  //         isValid: false,
  //         error: `此上传类型不支持视频文件`,
  //       };
  //     }

  //     // 500MB limit for videos
  //     const maxVideoSize = 500 * ONE_MB; // 500MB in bytes
  //     if (file.size > maxVideoSize) {
  //       return {
  //         isValid: false,
  //         error: `视频文件大小不能超过500MB，当前文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
  //       };
  //     }
  //   }

  //   return { isValid: true };
  // }

  // Multer Configuration for file uploads
  static getMulterConfig(
    uploadType:
      | 'banner'
      | 'post'
      | 'image'
      | 'video'
      | 'honor'
      | 'case-studies'
      | 'latest-news'
      | 'products'
      | 'solutions'
      | 'medias' = 'banner',
  ) {
    const destinationMap = {
      banner: this.uploadConfig.bannerPath,
      post: this.uploadConfig.postPath,
      image: this.uploadConfig.imagePath,
      video: this.uploadConfig.videoPath,
      honor: this.uploadConfig.honorPath,
      'latest-news': this.uploadConfig.latestNewsPath,
      'case-studies': this.uploadConfig.caseStudiesPath,
      products: this.uploadConfig.productsPath,
      solutions: this.uploadConfig.solutionsPath,
      medias: this.uploadConfig.mediasPath,
    };

    const prefixMap = {
      banner: 'banner',
      post: 'post',
      image: 'image',
      video: 'video',
      honor: 'honor',
      'latest-news': 'latest-news',
      'case-studies': 'case-studies',
      products: 'products',
      solutions: 'solutions',
      medias: 'media',
    };

    return {
      storage: diskStorage({
        destination: destinationMap[uploadType],
        filename: (req, file: Express.Multer.File, callback) => {
          const uniqueSuffix = uuid();
          const ext = extname(file.originalname);
          const filename = `${prefixMap[uploadType]}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file: Express.Multer.File, callback) => {
        // Define upload types that allow both images and videos
        const mixedUploadTypes = ['banner', 'medias'];
        // Determine allowed types based on upload type
        let allowedTypes: string[] = [];

        if (mixedUploadTypes.includes(uploadType)) {
          // Allow both images and videos for mixed upload types
          allowedTypes = [
            ...this.uploadConfig.allowedImageTypes,
            ...this.uploadConfig.allowedVideoTypes,
          ];
        } else if (uploadType === 'video') {
          // Only allow videos for video upload type
          allowedTypes = [...this.uploadConfig.allowedVideoTypes];
        } else {
          // Only allow images for other upload types
          allowedTypes = [...this.uploadConfig.allowedImageTypes];
        }

        // Check if file type is allowed
        const isAllowed = allowedTypes.includes(file.mimetype);
        if (!isAllowed) {
          return callback(
            new Error(`只允许以下文件类型: ${allowedTypes.join(', ')}`),
            false,
          );
        }

        // Validate file size
        // const sizeValidation = this.validateFileSize(file, uploadType);
        // if (!sizeValidation.isValid) {
        //   return callback(new Error(sizeValidation.error), false);
        // }
        callback(null, true);
      },
      limits: {
        fileSize: this.uploadConfig.maxVideoSize,
      },
    };
  }

  // Legacy multer config for backward compatibility
  static get multerConfig() {
    return this.getMulterConfig('banner');
  }

  // Resume upload configuration
  static getResumeMulterConfig() {
    return {
      storage: diskStorage({
        destination: this.uploadConfig.resumesPath,
        filename: (req, file: Express.Multer.File, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `resume-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    };
  }

  /**
   * Validate required environment variables
   */
  static validateConfig(): void {
    const requiredEnvVars = ['DATABASE_URL'];

    const missingVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar],
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`,
      );
    }

    // Validate JWT secret in production
    if (
      this.isProduction &&
      (!process.env.JWT_SECRET ||
        process.env.JWT_SECRET === 'vian-blog-fallback-secret')
    ) {
      throw new Error('JWT_SECRET must be set to a secure value in production');
    }
  }
}

// Export singleton instance
export const appConfig = AppConfig;
