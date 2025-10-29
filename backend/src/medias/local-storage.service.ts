import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const access = promisify(fs.access);

export interface FileInfo {
  filename: string;
  path: string;
  absolutePath: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  mimeType?: string;
  category:
    | 'banners'
    | 'images'
    | 'posts'
    | 'latest-news'
    | 'honors'
    | 'case-studies'
    | 'products'
    | 'solutions';
}

export interface DirectoryListing {
  files: FileInfo[];
  totalFiles: number;
  totalSize: number;
}

@Injectable()
export class LocalStorageService {
  private readonly uploadsPath = path.join(process.cwd(), 'uploads');
  private readonly allowedCategories = [
    'banners',
    'images',
    'posts',
    'latest-news',
    'honors',
    'case-studies',
    'products',
    'solutions',
  ] as const;

  constructor() {
    // Ensure uploads directory exists
    this.ensureUploadsDirectory();
  }

  /**
   * Ensure uploads directory and subdirectories exist
   */
  private ensureUploadsDirectory(): void {
    try {
      if (!fs.existsSync(this.uploadsPath)) {
        fs.mkdirSync(this.uploadsPath, { recursive: true });
      }

      // Create subdirectories if they don't exist
      this.allowedCategories.forEach((category) => {
        const categoryPath = path.join(this.uploadsPath, category);
        if (!fs.existsSync(categoryPath)) {
          fs.mkdirSync(categoryPath, { recursive: true });
        }
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to initialize uploads directory: ${error.message}`,
      );
    }
  }

  /**
   * Get MIME type based on file extension
   */
  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.avi': 'video/avi',
      '.mov': 'video/quicktime',
      '.wmv': 'video/x-ms-wmv',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Validate category parameter
   */
  private validateCategory(category: string): void {
    if (!this.allowedCategories.includes(category as any)) {
      throw new BadRequestException(
        `Invalid category. Allowed categories: ${this.allowedCategories.join(', ')}`,
      );
    }
  }

  /**
   * Get file information by filename and category
   */
  async getFile(filename: string, category: string): Promise<FileInfo> {
    this.validateCategory(category);

    const filePath = path.join(this.uploadsPath, category, filename);

    try {
      await access(filePath, fs.constants.F_OK);
      const stats = await stat(filePath);

      return {
        filename,
        path: `/uploads/${category}/${filename}`,
        absolutePath: filePath,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        mimeType: this.getMimeType(filename),
        category: category as any,
      };
    } catch {
      throw new NotFoundException(
        `File ${filename} not found in ${category} category`,
      );
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filename: string, category: string): Promise<boolean> {
    this.validateCategory(category);

    const filePath = path.join(this.uploadsPath, category, filename);

    try {
      await access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * List all files in a specific category
   */
  async listFiles(category: string): Promise<DirectoryListing> {
    this.validateCategory(category);

    const categoryPath = path.join(this.uploadsPath, category);

    try {
      const files = await readdir(categoryPath);
      const fileInfos: FileInfo[] = [];
      let totalSize = 0;

      for (const filename of files) {
        const filePath = path.join(categoryPath, filename);
        const stats = await stat(filePath);

        if (stats.isFile()) {
          const fileInfo: FileInfo = {
            filename,
            path: `/uploads/${category}/${filename}`,
            absolutePath: filePath,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
            mimeType: this.getMimeType(filename),
            category: category as any,
          };

          fileInfos.push(fileInfo);
          totalSize += stats.size;
        }
      }

      // Sort by modification date (newest first)
      fileInfos.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());

      return {
        files: fileInfos,
        totalFiles: fileInfos.length,
        totalSize,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to list files in ${category}: ${error.message}`,
      );
    }
  }

  /**
   * List all files across all categories
   */
  async listAllFiles(): Promise<{ [category: string]: DirectoryListing }> {
    const result: { [category: string]: DirectoryListing } = {};

    for (const category of this.allowedCategories) {
      try {
        result[category] = await this.listFiles(category);
      } catch {
        result[category] = { files: [], totalFiles: 0, totalSize: 0 };
      }
    }

    return result;
  }

  /**
   * Remove a file from local storage
   */
  async removeFile(
    filePath: string,
  ): Promise<{ message: string; deletedFile: string }> {
    try {
      const fullFilePath = `${process.cwd()}${filePath}`;

      // Check if file exists first
      await access(fullFilePath, fs.constants.F_OK);

      // Delete the file
      await unlink(fullFilePath);

      return {
        message: 'File deleted successfully',
        deletedFile: filePath,
      };
    } catch (error) {
      console.log('error remove file: ', error);

      if (error.code === 'ENOENT') {
        throw new NotFoundException(`File ${filePath} not found`);
      }
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Remove multiple files from local storage
   */
  async removeFiles(filePaths: string[]): Promise<{
    success: Array<{ file: string }>;
    failed: Array<{ file: string; error: string }>;
  }> {
    const success: Array<{
      file: string;
    }> = [];
    const failed: Array<{
      file: string;
      error: string;
    }> = [];

    for (const filePath of filePaths) {
      try {
        const result = await this.removeFile(filePath);
        success.push({
          file: result.deletedFile,
        });
      } catch (error) {
        failed.push({
          file: filePath,
          error: error.message,
        });
      }
    }

    return { success, failed };
  }

  /**
   * Clean up orphaned files (files that exist in filesystem but not in database)
   * This requires the PrismaService to check database records
   */
  async findOrphanedFiles(): Promise<{ [category: string]: FileInfo[] }> {
    const orphanedFiles: { [category: string]: FileInfo[] } = {};

    for (const category of this.allowedCategories) {
      const listing = await this.listFiles(category);
      // Note: To implement full orphan detection, you'd need to inject PrismaService
      // and check which files exist in filesystem but not in database
      // For now, this just returns all files - you can extend this later
      orphanedFiles[category] = listing.files;
    }

    return orphanedFiles;
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    categories: { [category: string]: { files: number; size: number } };
  }> {
    const allFiles = await this.listAllFiles();
    let totalFiles = 0;
    let totalSize = 0;
    const categories: {
      [category: string]: { files: number; size: number };
    } = {};

    for (const [category, listing] of Object.entries(allFiles)) {
      totalFiles += listing.totalFiles;
      totalSize += listing.totalSize;
      categories[category] = {
        files: listing.totalFiles,
        size: listing.totalSize,
      };
    }

    return {
      totalFiles,
      totalSize,
      categories,
    };
  }

  /**
   * Get formatted file size
   */
  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
