import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { QueryCustomersDto } from './dto/query-customers.dto';
import { UpdateCustomerStatusDto } from './dto/update-customer-status.dto';
import { CUSTOMER_CONFIG, CUSTOMER_STATUS } from '../common/config/constants';
import { CreateCustomerDto } from './dto/create-customers.dto';
import { OperationLogService } from '../operation-logs/operation-log.service';
import {
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
import { SubmitSource } from './customers.types';
import { TZDate } from '@date-fns/tz';

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private readonly operationLogService: OperationLogService,
  ) { }

  async findAll(query: QueryCustomersDto, isExport = false) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      cooperation_type,
      cooperation_requirement,
      start_date,
      end_date,
      sort_by = 'createdAt',
      sort_order = 'desc',
    } = query;
    console.log('run this?');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status !== undefined) {
      where.status = status;
    }

    if (cooperation_type !== undefined) {
      // When schema uses cooperationTypes as array, filter contains
      where.cooperationTypes = { has: cooperation_type };
    }

    if (cooperation_requirement !== undefined) {
      where.cooperationRequirements = { has: cooperation_requirement };
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

    // Build orderBy
    const orderBy: any = {};
    if (sort_by) {
      // Map snake_case to camelCase for Prisma
      const sortByMapping: Record<string, string> = {
        created_at: 'createdAt',
        updated_at: 'updatedAt',
        cooperation_type: 'cooperationTypes',
        request_note: 'requestNote',
        status: 'status',
      };

      const prismaField = sortByMapping[sort_by] || sort_by;
      orderBy[prismaField] = sort_order;
    }

    // Get total count for pagination
    const total = await this.prisma.customer.count({ where });

    // Get customers with pagination
    const customers = await this.prisma.customer.findMany({
      where,
      skip,
      orderBy,
      take: isExport ? undefined : limit,
    });

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: BigInt(id) },
    });

    if (!customer) {
      throw new NotFoundException(`找不到ID为${id}的客户`);
    }

    return customer;
  }

  async create(
    createCustomerDto: CreateCustomerDto & { submitSource: SubmitSource },
  ) {
    const customer = await this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        status: CUSTOMER_STATUS.PENDING_FOLLOW_UP,
      },
    });
    return customer;
  }

  async updateStatus(
    id: number,
    updateCustomerStatusDto: UpdateCustomerStatusDto,
    userId?: string,
  ) {
    const customer = await this.findOne(id);
    const { status: newStatus } = updateCustomerStatusDto;

    const updatedCustomer = await this.prisma.customer.update({
      where: { id: BigInt(id) },
      data: { status: newStatus },
    });

    // Log operation if userId is provided
    if (userId) {
      const statusMapping = {
        [CUSTOMER_STATUS.PENDING_FOLLOW_UP]: '待跟进',
        [CUSTOMER_STATUS.REGISTERED]: '已注册',
        [CUSTOMER_STATUS.UNDER_FOLLOW_UP]: '跟进中',
        [CUSTOMER_STATUS.COOPERATING]: '合作中',
        [CUSTOMER_STATUS.CANCELLED]: '已取消',
      };

      const operationDesc = `更新客户状态: ${customer.name} → ${statusMapping[newStatus] || newStatus}`;

      await this.operationLogService.createLog({
        userId: BigInt(userId),
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.CUSTOMERS as ModuleType,
        operationDesc,
        targetType: TARGET_TYPE.CUSTOMER as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return updatedCustomer;
  }

  async exportData(query: QueryCustomersDto) {
    // Reuse findAll to get filtered data without pagination
    const { data: customers } = await this.findAll({
      ...query,
      page: 1,
      limit: undefined,
    }, true);

    const headers = [
      "合作类型",
      "所在地区",
      "单位名称",
      "职务",
      "联系人称呼",
      "邮箱",
      "联系电话",
      "合作需求",
      "备注信息",
      "提交来源",
      "状态",
      "提交时间",
    ];

    const rows = customers.map((c) => [
      c.cooperationTypes
        ?.map(
          (type) =>
            CUSTOMER_CONFIG.COOPERATION_TYPE[
              type as keyof typeof CUSTOMER_CONFIG.COOPERATION_TYPE
            ].label || type
        )
        .join(",") ?? "",
      c.address ?? "",
      c.company ?? "",
      c.title ?? "",
      c.name ?? "",
      c.email ?? "",
      c.phone ?? "",
      c.cooperationRequirements
        ?.map(
          (requirement) =>
            CUSTOMER_CONFIG.COOPERATION_REQUIREMENT[
              requirement as keyof typeof CUSTOMER_CONFIG.COOPERATION_REQUIREMENT
            ].label || requirement
        )
        .join(",") ?? "",
      c.requestNote ?? "",
      c.submitSource
        ? CUSTOMER_CONFIG.SUBMIT_SOURCE[
          c.submitSource as keyof typeof CUSTOMER_CONFIG.SUBMIT_SOURCE
        ].label
        : "桌面",
      c.status
        ? CUSTOMER_CONFIG.CUSTOMER_STATUS[
          c.status as keyof typeof CUSTOMER_CONFIG.CUSTOMER_STATUS
        ].label
        : "待跟进",
      new TZDate(c.createdAt, 'Asia/Shanghai').toISOString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((r) =>
        r.map((v) => `"${String(v || "").replace(/"/g, '""')}` + '"').join(",")
      )
      .join("\n");

    return {
      filename: `customers_${new TZDate().toISOString().split('T')[0]}.csv`,
      csvContent,
    };
  }
}
