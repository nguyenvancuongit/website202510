import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';

@Injectable()
export class OperationLogBackupService {
  private readonly logger = new Logger(OperationLogBackupService.name);
  private readonly backupDir = path.join(process.cwd(), 'backups', 'operation-logs');

  constructor(private readonly prisma: PrismaService) {
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      this.logger.log(`Created backup directory: ${this.backupDir}`);
    }
  }

  /**
   * Scheduled task to run every 3 months (quarterly)
   * Runs on the 1st day of January, April, July, and October at 2:00 AM
   */
  @Cron('0 2 1 1,4,7,10 *', {
    name: 'operation-logs-backup',
    timeZone: 'Asia/Shanghai',
  })
  async scheduledBackup(): Promise<void> {
    this.logger.log('Starting scheduled operation logs backup and cleanup...');

    try {
      await this.backupAndCleanupOldLogs();
    } catch (error) {
      this.logger.error('Scheduled backup failed:', error);
    }
  }

  /**
   * Backup and cleanup old logs (90 days retention)
   */
  private async backupAndCleanupOldLogs(): Promise<void> {
    const daysToKeep = 90; // Production retention: 90 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    this.logger.log(`Starting backup for logs older than ${cutoffDate.toISOString()}`);

    // Get old logs
    const oldLogs = await this.getOldLogs(cutoffDate);

    if (oldLogs.length === 0) {
      this.logger.log('No old logs found to backup');
      return;
    }

    this.logger.log(`Found ${oldLogs.length} old logs to backup`);

    // Create backup file
    const backupFileName = await this.createBackupFile(oldLogs, cutoffDate);

    // Delete old logs from database
    const deleteResult = await this.deleteOldLogs(cutoffDate);

    this.logger.log(
      `Backup completed successfully. ` +
      `File: ${backupFileName}, ` +
      `Records backed up: ${oldLogs.length}, ` +
      `Records deleted: ${deleteResult.count}`
    );

    // Clean up old backup files (keep only latest 12 files - 3 years worth)
    this.cleanupOldBackupFiles();
  }

  /**
   * Get old logs from database
   */
  private async getOldLogs(cutoffDate: Date) {
    return await this.prisma.operationLog.findMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /**
   * Create backup file (CSV format compressed to ZIP)
   */
  private async createBackupFile(logs: any[], cutoffDate: Date): Promise<string> {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const cutoffTimestamp = cutoffDate.toISOString().slice(0, 10);
    const csvFileName = `operation_logs_backup_before_${cutoffTimestamp}_${timestamp}.csv`;
    const zipFileName = `operation_logs_backup_before_${cutoffTimestamp}_${timestamp}.zip`;
    const csvFilePath = path.join(this.backupDir, csvFileName);
    const zipFilePath = path.join(this.backupDir, zipFileName);

    if (logs.length === 0) {
      throw new Error('No logs to backup');
    }

    // Get table columns dynamically
    const { headers, rows } = await this.generateDynamicCSVContent(logs);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Write CSV file temporarily
    fs.writeFileSync(csvFilePath, '\uFEFF' + csvContent, 'utf8');

    // Create ZIP file
    await this.createZipFile(csvFilePath, zipFilePath);

    // Remove temporary CSV file
    fs.unlinkSync(csvFilePath);

    return zipFileName;
  }

  /**
   * Generate CSV content dynamically based on actual table columns
   */
  private async generateDynamicCSVContent(logs: any[]): Promise<{
    headers: string[];
    rows: string[][];
  }> {
    // Get table schema information from Prisma
    // wtf is this shit?
    const tableInfo = await this.prisma.$queryRaw<{
      column_name: string;
      data_type: string;
    }[]>`
      SELECT 
        column_name,
        data_type,
      FROM information_schema.columns 
      WHERE table_name = 'operation_logs' 
      ORDER BY ordinal_position;
    `;

    // Additional user fields (from joined table)
    const userFields = ['username', 'email', 'phone'];

    // Build headers dynamically using original column names
    const headers: string[] = [];
    const dbColumns: string[] = [];

    // Add operation_logs table columns
    tableInfo.forEach((col: any) => {
      const columnName = col.column_name;
      dbColumns.push(columnName);
      headers.push(columnName); // Use original column name
    });

    // Add user fields
    userFields.forEach(field => {
      headers.push(`user_${field}`); // Prefix with 'user_' to distinguish
    });

    // Generate rows dynamically
    const rows = logs.map((log) => {
      const row: string[] = [];

      // Add values for operation_logs columns
      dbColumns.forEach(columnName => {
        let value = '';

        // Convert snake_case to camelCase for object property access
        const camelCaseKey = this.snakeToCamel(columnName);
        const rawValue = log[camelCaseKey];

        // Handle different data types
        if (rawValue !== null && rawValue !== undefined) {
          switch (columnName) {
            case 'created_at':
              value = rawValue instanceof Date ? rawValue.toISOString() : rawValue;
              break;
            case 'id':
            case 'user_id':
              value = rawValue.toString();
              break;
            default:
              value = rawValue.toString();
          }
        }

        // Escape CSV special characters
        row.push(`"${(value || '').replace(/"/g, '""')}"`);
      });

      // Add user fields
      userFields.forEach(field => {
        const userValue = log.user?.[field] || '';
        row.push(`"${userValue.replace(/"/g, '""')}"`);
      });

      return row;
    });

    return { headers, rows };
  }

  /**
   * Convert snake_case to camelCase
   */
  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Create ZIP file from CSV
   */
  private async createZipFile(csvFilePath: string, zipFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver.create('zip', {
        zlib: { level: 9 }, // Maximum compression
      });

      output.on('close', () => {
        this.logger.log(`ZIP file created: ${zipFilePath} (${archive.pointer()} bytes)`);
        resolve();
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.file(csvFilePath, { name: path.basename(csvFilePath) });
      archive.finalize();
    });
  }

  /**
   * Delete old logs from database
   */
  private async deleteOldLogs(cutoffDate: Date) {
    return await this.prisma.operationLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
  }

  /**
   * Clean up old backup files (keep only latest 12 files - 3 years worth)
   */
  private cleanupOldBackupFiles(): void {
    if (!fs.existsSync(this.backupDir)) {
      return;
    }

    const files = fs.readdirSync(this.backupDir)
      .filter(file => file.endsWith('.zip'))
      .map(fileName => {
        const filePath = path.join(this.backupDir, fileName);
        const stats = fs.statSync(filePath);
        return {
          fileName,
          filePath,
          createdAt: stats.birthtime,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const filesToKeep = 12;
    if (files.length <= filesToKeep) {
      return;
    }

    const filesToDelete = files.slice(filesToKeep);

    for (const file of filesToDelete) {
      try {
        fs.unlinkSync(file.filePath);
        this.logger.log(`Deleted old backup file: ${file.fileName}`);
      } catch (error) {
        this.logger.error(`Failed to delete backup file ${file.fileName}:`, error);
      }
    }
  }
}
