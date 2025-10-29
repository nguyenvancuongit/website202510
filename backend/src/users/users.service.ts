import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  USER_STATUS,
  USER_MANAGEMENT,
  SECURITY_CONFIG,
} from '../common/config/constants';
import { AppConfig } from '../common/config/app.config';
import * as bcrypt from 'bcryptjs';
import { PERMISSION_LABELS, PERMISSIONS } from './constants';
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

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly operationLogService: OperationLogService,
  ) { }

  // // Generate random password
  // private generatePassword(
  //   length: number = USER_MANAGEMENT.DEFAULT_PASSWORD_LENGTH,
  // ): string {
  //   const chars = USER_MANAGEMENT.PASSWORD_CHARACTERS;
  //   let result = '';
  //   for (let i = 0; i < length; i++) {
  //     result += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return result;
  // }

  async create(createUserDto: CreateUserDto, currentUserId?: string) {
    // Check if username already exists
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: createUserDto.username.trim() },
    });

    if (existingUserByUsername) {
      throw new ConflictException('用户名已存在');
    }

    // Check if phone already exists (now required)
    const existingUserByPhone = await this.prisma.user.findUnique({
      where: { phone: createUserDto.phone.trim() },
    });

    if (existingUserByPhone) {
      throw new ConflictException('电话号码已存在');
    }

    const hashedPassword = await bcrypt.hash(
      AppConfig.adminConfig.defaultPassword,
      SECURITY_CONFIG.BCRYPT_SALT_ROUNDS,
    );

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username: createUserDto.username.trim(),
        phone: createUserDto.phone.trim(),
        passwordHash: hashedPassword,
        status: createUserDto.status ?? USER_STATUS.ACTIVE,
        permissions: createUserDto.permissions,
      },
    });

    // Log operation if currentUserId is provided
    if (currentUserId) {
      await this.operationLogService.createLog({
        userId: BigInt(currentUserId),
        operationType: OPERATION_TYPE.CREATE as OperationType,
        module: MODULE_TYPE.USERS as ModuleType,
        operationDesc: `创建用户: ${user.username}`,
        targetType: TARGET_TYPE.USER as TargetType,
        targetId: user.id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      generatedPassword: AppConfig.adminConfig.defaultPassword,
    };
  }

  async findAll(getUsersDto: GetUsersDto, currentUserId?: bigint) {
    const {
      page = 1,
      pageSize = USER_MANAGEMENT.PAGINATION.DEFAULT_PAGE_SIZE,
      username,
      phone,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = getUsersDto;

    const skip = (page - 1) * pageSize;
    const take = Math.min(pageSize, USER_MANAGEMENT.PAGINATION.MAX_PAGE_SIZE);

    // Build where conditions
    const where: any = {};

    // Exclude current user from the list
    if (currentUserId) {
      where.id = {
        not: currentUserId,
      };
    }

    if (username) {
      where.username = {
        contains: username,
        mode: 'insensitive',
      };
    }

    if (phone) {
      where.phone = {
        contains: phone,
        mode: 'insensitive',
      };
    }

    if (status) {
      where.status = status;
    }

    // Build order by
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);

    // Transform data to include permissions
    const transformedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      permissions: user.permissions.map(
        (permission) => PERMISSION_LABELS[permission],
      ),
    }));

    return {
      data: transformedUsers,
      pagination: {
        page,
        page_size: take,
        total,
        total_pages: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: bigint) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        passwordHash: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async update(
    id: bigint,
    updateUserDto: UpdateUserDto,
    currentUserId?: bigint,
  ) {
    // Prevent user from updating themselves
    if (currentUserId && id === currentUserId) {
      throw new ForbiddenException('不能修改自己的账户信息');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // Check username uniqueness if updating
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username.trim() },
      });

      if (existingUser) {
        throw new ConflictException('用户名已存在');
      }
    }

    // Check phone uniqueness if updating
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUser = await this.prisma.user.findUnique({
        where: { phone: updateUserDto.phone.trim() },
      });

      if (existingUser) {
        throw new ConflictException('电话号码已存在');
      }
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        username: updateUserDto.username?.trim(),
        phone: updateUserDto.phone?.trim(),
        status: updateUserDto.status,
        permissions: updateUserDto.permissions,
      },
    });

    // Log operation if currentUserId is provided
    if (currentUserId) {
      await this.operationLogService.createLog({
        userId: currentUserId,
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.USERS as ModuleType,
        operationDesc: `更新用户信息: ${updatedUser.username}`,
        targetType: TARGET_TYPE.USER as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return updatedUser;
  }

  async resetPassword(
    id: bigint,
    resetPasswordDto: ResetPasswordDto,
    currentUserId?: bigint,
  ) {
    // Prevent user from resetting their own password through admin panel
    if (currentUserId && id === currentUserId) {
      throw new ForbiddenException('不能重置自己的密码，请使用个人设置');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    let newPassword: string;

    if (resetPasswordDto.new_password) {
      newPassword = resetPasswordDto.new_password;
    } else {
      newPassword = AppConfig.adminConfig.defaultPassword;
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      SECURITY_CONFIG.BCRYPT_SALT_ROUNDS,
    );

    await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash: hashedPassword,
      },
    });

    // Log operation if currentUserId is provided
    if (currentUserId) {
      await this.operationLogService.createLog({
        userId: currentUserId,
        operationType: OPERATION_TYPE.UPDATE as OperationType,
        module: MODULE_TYPE.USERS as ModuleType,
        operationDesc: `重置用户密码: ${user.username}`,
        targetType: TARGET_TYPE.USER as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return {
      new_password: newPassword,
    };
  }

  async remove(id: bigint, currentUserId?: bigint) {
    // Prevent user from deleting themselves
    if (currentUserId && id === currentUserId) {
      throw new ForbiddenException('不能删除自己的账户');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // Remove user
    await this.prisma.user.delete({
      where: { id },
    });

    // Log operation if currentUserId is provided
    if (currentUserId) {
      await this.operationLogService.createLog({
        userId: currentUserId,
        operationType: OPERATION_TYPE.DELETE as OperationType,
        module: MODULE_TYPE.USERS as ModuleType,
        operationDesc: `删除用户: ${user.username}`,
        targetType: TARGET_TYPE.USER as TargetType,
        targetId: id.toString(),
        status: OPERATION_STATUS.SUCCESS,
      });
    }

    return {
      message: '用户删除成功',
    };
  }

  getAllPermissions() {
    return PERMISSIONS;
  }
}
