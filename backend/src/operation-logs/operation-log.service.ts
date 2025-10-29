import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request, Response } from 'express';
import { PrismaService } from '../database/prisma.service';
import { CreateOperationLogDto } from './dto/create-operation-log.dto';
import { QueryOperationLogDto } from './dto/query-operation-log.dto';
import {
  OPERATION_STATUS,
  OPERATION_STATUS_LABELS,
  MODULE_TYPE_LABELS,
  OPERATION_TYPE_LABELS,
} from '../common/config/constants';
import { getClientIp, getRequestParams } from '../common/helpers/request.helper';
import { TZDate } from '@date-fns/tz';

@Injectable({ scope: Scope.REQUEST })
export class OperationLogService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async createLog(data: CreateOperationLogDto) {
    // Auto-extract IP and request params if not provided
    const ipAddress = getClientIp(this.request);
    const requestParams = getRequestParams(this.request);

    return await this.prisma.operationLog.create({
      data: {
        userId: data.userId,
        operationType: data.operationType,
        module: data.module,
        operationDesc: data.operationDesc,
        targetType: data.targetType || null,
        targetId: data.targetId || null,
        ipAddress: ipAddress || null,
        requestParams: requestParams || undefined,
        status: data.status || OPERATION_STATUS.SUCCESS,
      },
    });
  }

  async findAll(query: QueryOperationLogDto) {
    const {
      page = 1,
      limit = 20,
      username,
      phone_number,
      module,
      operation_type,
      status,
      start_date,
      end_date,
      search,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Map snake_case to camelCase for Prisma orderBy
    const sortFieldMap: Record<string, string> = {
      created_at: 'createdAt',
      module: 'module',
      status: 'status',
      operation_type: 'operationType',
      user_id: 'userId',
    };

    const orderByField = sortFieldMap[sort_by] || 'createdAt';
    const orderByDirection = sort_order === 'asc' ? 'asc' : 'desc';

    const where: any = {};

    // Filter by username
    if (username) {
      where.user = {
        username: { contains: username, mode: 'insensitive' },
      };
    }

    // Filter by phone number
    if (phone_number) {
      where.user = {
        ...where.user,
        phone: { contains: phone_number, mode: 'insensitive' },
      };
    }

    if (module) {
      where.module = module;
    }

    if (operation_type) {
      where.operationType = operation_type;
    }

    if (status) {
      where.status = status;
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

    if (search) {
      where.OR = [
        { operationDesc: { contains: search, mode: 'insensitive' } },
        { targetId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [logs, total] = await Promise.all([
      this.prisma.operationLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: orderByDirection },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.operationLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLogById(id: string) {
    return this.prisma.operationLog.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }

  async exportToCsv(query: QueryOperationLogDto, res: Response) {
    const {
      username,
      phone_number,
      module,
      operation_type,
      status,
      start_date,
      end_date,
      search,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = query;

    // Map snake_case to camelCase for Prisma orderBy
    const sortFieldMap: Record<string, string> = {
      created_at: 'createdAt',
      module: 'module',
      status: 'status',
      operation_type: 'operationType',
      user_id: 'userId',
    };

    const orderByField = sortFieldMap[sort_by] || 'createdAt';
    const orderByDirection = sort_order === 'asc' ? 'asc' : 'desc';

    const where: any = {};

    // Apply same filters as findAll method
    if (username) {
      where.user = {
        username: { contains: username, mode: 'insensitive' },
      };
    }

    if (phone_number) {
      where.user = {
        ...where.user,
        phone: { contains: phone_number, mode: 'insensitive' },
      };
    }

    if (module) {
      where.module = module;
    }

    if (operation_type) {
      where.operationType = operation_type;
    }

    if (status) {
      where.status = status;
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

    if (search) {
      where.OR = [
        { operationDesc: { contains: search, mode: 'insensitive' } },
        { targetId: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch all data for export (no pagination)
    const logs = await this.prisma.operationLog.findMany({
      where,
      orderBy: { [orderByField]: orderByDirection },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            phone: true,
          },
        },
      },
    });

    // Generate CSV content
    const csvHeaders = [
      '操作内容',
      '操作类型',
      '系统模块',
      '用户名称',
      '手机号',
      'IP地址',
      '请求参数',
      '操作结果',
      '操作时间',
    ];

    const csvRows = logs.map((log) => [
      `"${log.operationDesc || ''}"`,
      `"${OPERATION_TYPE_LABELS[log.operationType] || log.operationType || ''}"`,
      `"${MODULE_TYPE_LABELS[log.module] || log.module || ''}"`,
      `"${log.user?.username || ''}"`,
      `"${log.user?.phone || ''}"`,
      `"${log.ipAddress || ''}"`,
      `"${log.requestParams ? JSON.stringify(log.requestParams).replace(/"/g, '""') : ''}"`,
      `"${OPERATION_STATUS_LABELS[log.status] || log.status || ''}"`,
      `"${new TZDate(log.createdAt, 'Asia/Shanghai').toISOString()}"`,
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row) => row.join(',')),
    ].join('\n');

    // Set response headers for CSV download
    const timestamp = new TZDate(new Date(), 'Asia/Shanghai')
      .toISOString()
      .slice(0, 19)
      .replace(/[:-]/g, '');
    const filename = `operation_logs_${timestamp}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    // Add BOM for proper UTF-8 encoding in Excel
    res.write('\uFEFF');
    res.write(csvContent);
    res.end();
  }
}
