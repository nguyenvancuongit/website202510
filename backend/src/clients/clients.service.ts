import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { QueryClientsDto } from './dto/query-clients.dto';
import { ExportClientsDto } from './dto/export-clients.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ClientLoginDto } from './dto/client-login.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import {
  CLIENT_STATUS,
  EMAIL_CONFIG,
  CLIENT_MANAGEMENT,
  appConfig,
} from '../common/config';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async findAll(query: QueryClientsDto) {
    const {
      page = 1,
      page_size = 10,
      search,
      email,
      phone_number,
      status,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = query;

    const skip = (page - 1) * page_size;
    const take = page_size;

    // Build where conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }

    if (phone_number) {
      where.phoneNumber = { contains: phone_number, mode: 'insensitive' };
    }

    if (status) {
      where.status = status.toLowerCase();
    }

    // Build orderBy
    const orderBy: any = {};
    if (sort_by === 'email') {
      orderBy.email = sort_order;
    } else if (sort_by === 'phone_number') {
      orderBy.phoneNumber = sort_order;
    } else if (sort_by === 'full_name') {
      orderBy.fullName = sort_order;
    } else if (sort_by === 'last_login_time') {
      orderBy.lastLoginTime = sort_order;
    } else if (sort_by === 'created_at') {
      orderBy.createdAt = sort_order;
    } else if (sort_by === 'updated_at') {
      orderBy.updatedAt = sort_order;
    } else {
      orderBy.createdAt = sort_order; // Default fallback
    }

    // Get total count
    const total = await this.prisma.client.count({ where });

    // Get clients
    const clients = await this.prisma.client.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginTime: true,
      },
    });

    // Transform data to match frontend expectations
    const transformedClients = clients.map((client) => ({
      id: client.id,
      email: client.email,
      full_name: client.fullName,
      phone_number: client.phoneNumber,
      status: client.status,
      created_at: client.createdAt.toISOString(),
      updated_at: client.updatedAt.toISOString(),
      last_login_time: client.lastLoginTime?.toISOString(),
    }));

    return {
      data: transformedClients,
      pagination: {
        page,
        page_size,
        total,
        total_pages: Math.ceil(total / page_size),
      },
    };
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginTime: true,
      },
    });

    if (!client) {
      throw new NotFoundException('客户不存在');
    }

    // Transform data to match frontend expectations
    return {
      id: client.id,
      email: client.email,
      full_name: client.fullName,
      phone_number: client.phoneNumber,
      status: client.status,
      created_at: client.createdAt.toISOString(),
      updated_at: client.updatedAt.toISOString(),
      last_login_time: client.lastLoginTime?.toISOString(),
    };
  }

  async updateStatus(id: string, updateStatusDto: UpdateClientStatusDto) {
    const { status } = updateStatusDto;

    // Check if client exists
    const existingClient = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      throw new NotFoundException('客户不存在');
    }

    // Update client status
    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginTime: true,
      },
    });

    // Transform data to match frontend expectations
    return {
      id: updatedClient.id,
      email: updatedClient.email,
      full_name: updatedClient.fullName,
      phone_number: updatedClient.phoneNumber,
      status: updatedClient.status,
      created_at: updatedClient.createdAt.toISOString(),
      updated_at: updatedClient.updatedAt.toISOString(),
      last_login_time: updatedClient.lastLoginTime?.toISOString(),
    };
  }

  async exportToCsv(query: ExportClientsDto) {
    // Get all clients without pagination for export
    const { status, start_date, end_date } = query;

    // Build where conditions
    const where: any = {};

    if (status) {
      where.status = status;
    }

    // Date range filter
    if (start_date || end_date) {
      where.createdAt = {};

      if (start_date) {
        where.createdAt.gte = new Date(start_date);
      }

      if (end_date) {
        // Include the entire end date
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateTime;
      }
    }

    // Get all clients for export (default sort by created date desc)
    const clients = await this.prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginTime: true,
      },
    });

    // Transform to CSV format
    const csvHeader =
      'ID,邮箱,姓名,手机号,状态,创建时间,更新时间,最近登录时间\n';
    const csvRows = clients
      .map((client, index) => {
        const clientId = `User${String(index + 1).padStart(6, '0')}`;
        const fullName = client.fullName || '';
        const phoneNumber = client.phoneNumber || '';
        const status =
          client.status === 'pending'
            ? '待验证'
            : client.status === 'active'
              ? '正常'
              : '禁用';
        const createdAt = client.createdAt
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19);
        const updatedAt = client.updatedAt
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19);
        const lastLoginTime = client.lastLoginTime
          ? client.lastLoginTime
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19)
          : '';

        return `${clientId},${client.email},"${fullName}",${phoneNumber},${status},${createdAt},${updatedAt},${lastLoginTime}`;
      })
      .join('\n');

    return csvHeader + csvRows;
  }

  // Authentication Methods

  async register(registerDto: RegisterClientDto) {
    const { email } = registerDto;

    // Check if client already exists
    const existingClient = await this.prisma.client.findUnique({
      where: { email },
    });

    if (existingClient) {
      if (existingClient.status === CLIENT_STATUS.ACTIVE) {
        throw new ConflictException('该邮箱已注册并激活');
      }
      if (existingClient.status === CLIENT_STATUS.PENDING) {
        // Generate new verification code and resend
        const verificationCode = this.generateVerificationCode();
        const verificationExpires = new Date(
          Date.now() +
          CLIENT_MANAGEMENT.EMAIL_VERIFICATION.CODE_EXPIRES_IN_MINUTES *
          60 *
          1000,
        );

        await this.prisma.client.update({
          where: { email },
          data: {
            emailVerificationCode: verificationCode,
            emailVerificationExpires: verificationExpires,
          },
        });

        await this.sendVerificationCodeEmail(email, verificationCode);
        return {
          message: '验证码已重新发送，请检查您的邮箱',
          email: email,
        };
      }
      throw new ConflictException('该邮箱已被禁用');
    }

    // Generate verification code
    const verificationCode = this.generateVerificationCode();
    // const verificationExpires = new Date(
    //   Date.now() +
    //   CLIENT_MANAGEMENT.EMAIL_VERIFICATION.CODE_EXPIRES_IN_MINUTES *
    //   60 *
    //   1000,
    // );

    // Send verification code email
    await this.sendVerificationCodeEmail(email, verificationCode);

    return {
      message: '注册成功！我们已发送6位验证码到您的邮箱，请输入验证码完成注册',
      email: email,
    };
  }

  async verifyCode(verifyDto: VerifyCodeDto) {
    const { email, code } = verifyDto;

    // Find client by email
    const client = await this.prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      throw new BadRequestException('邮箱不存在');
    }

    if (client.status !== CLIENT_STATUS.PENDING) {
      throw new BadRequestException('账户状态异常');
    }

    // Check if code exists
    if (!client.emailVerificationCode) {
      throw new BadRequestException('请先获取验证码');
    }

    // Check if code is expired
    if (
      client.emailVerificationExpires &&
      client.emailVerificationExpires < new Date()
    ) {
      throw new BadRequestException('验证码已过期，请重新获取');
    }

    // Check if code matches
    if (client.emailVerificationCode !== code) {
      throw new BadRequestException('验证码不正确');
    }

    // Generate random password
    const randomPassword = this.generateRandomPassword();
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    // Update client status to active and set password
    const updatedClient = await this.prisma.client.update({
      where: { id: client.id },
      data: {
        status: CLIENT_STATUS.ACTIVE,
        passwordHash,
        emailVerificationCode: null,
        emailVerificationExpires: null,
      },
    });

    // Send password email
    await this.sendPasswordEmail(email, randomPassword);

    // Generate JWT token
    const payload = {
      sub: updatedClient.id,
      email: updatedClient.email,
      type: 'client',
    };
    const access_token = this.jwtService.sign(payload, {
      secret: appConfig.jwtConfig.clientSecret,
      expiresIn: appConfig.jwtConfig.expiresIn,
    });

    return {
      access_token,
      client: {
        id: updatedClient.id,
        email: updatedClient.email,
        full_name: updatedClient.fullName,
        phone_number: updatedClient.phoneNumber,
        status: updatedClient.status,
      },
      message: '验证成功！密码已发送到您的邮箱，请查收并使用密码登录',
    };
  }

  async login(loginDto: ClientLoginDto) {
    const { email_or_phone, password } = loginDto;

    // Find client by email or phone
    const client = await this.prisma.client.findFirst({
      where: {
        OR: [{ email: email_or_phone }, { phoneNumber: email_or_phone }],
      },
    });

    if (!client) {
      throw new UnauthorizedException('用户名或密码无效');
    }

    if (!client.passwordHash) {
      throw new UnauthorizedException('账户未完成注册，请先完成邮箱验证');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, client.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码无效');
    }

    // Update last login time
    await this.prisma.client.update({
      where: { id: client.id },
      data: { lastLoginTime: new Date() },
    });

    // Generate JWT token
    const payload = {
      sub: client.id,
      email: client.email,
      type: 'client',
    };
    const access_token = this.jwtService.sign(payload, {
      secret: appConfig.jwtConfig.clientSecret,
      expiresIn: appConfig.jwtConfig.expiresIn,
    });

    return {
      access_token,
      client: {
        id: client.id,
        email: client.email,
        full_name: client.fullName,
        phone_number: client.phoneNumber,
        status: client.status,
        last_login_time: client.lastLoginTime,
      },
    };
  }

  async getProfile(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        status: true,
        lastLoginTime: true,
        createdAt: true,
      },
    });

    if (!client) {
      throw new UnauthorizedException('客户端不存在');
    }

    return {
      id: client.id,
      email: client.email,
      full_name: client.fullName,
      phone_number: client.phoneNumber,
      status: client.status,
      last_login_time: client.lastLoginTime,
      created_at: client.createdAt,
    };
  }

  async updateProfile(clientId: string, updateDto: UpdateClientProfileDto) {
    const { full_name, phone_number } = updateDto;

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new UnauthorizedException('客户端不存在');
    }

    // Prepare update data
    const updateData: any = {};

    if (full_name !== undefined) {
      updateData.fullName = full_name;
    }

    if (phone_number !== undefined) {
      // Check if phone number is already taken
      if (phone_number) {
        const existingPhone = await this.prisma.client.findUnique({
          where: { phoneNumber: phone_number },
        });
        if (existingPhone && existingPhone.id !== clientId) {
          throw new ConflictException('该手机号已被使用');
        }
      }
      updateData.phoneNumber = phone_number;
    }

    // Update client
    const updatedClient = await this.prisma.client.update({
      where: { id: clientId },
      data: updateData,
    });

    return {
      id: updatedClient.id,
      email: updatedClient.email,
      full_name: updatedClient.fullName,
      phone_number: updatedClient.phoneNumber,
      status: updatedClient.status,
      last_login_time: updatedClient.lastLoginTime,
      message: 'Profile updated successfully',
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateRandomPassword(): string {
    const characters = CLIENT_MANAGEMENT.PASSWORD_CHARACTERS;
    let password = '';

    // Ensure at least one of each required type
    password += characters.charAt(Math.floor(Math.random() * 26)); // uppercase
    password += characters.charAt(Math.floor(Math.random() * 26) + 26); // lowercase
    password += Math.floor(Math.random() * 10); // number

    // Fill the rest randomly
    for (let i = 3; i < CLIENT_MANAGEMENT.DEFAULT_PASSWORD_LENGTH; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  private async sendVerificationCodeEmail(email: string, code: string) {
    await this.mailService.sendEmail({
      to: email,
      subject: EMAIL_CONFIG.SUBJECTS.EMAIL_VERIFICATION_CODE,
      template: EMAIL_CONFIG.TEMPLATES.EMAIL_VERIFICATION_CODE,
      context: {
        code,
        expiresIn: `${CLIENT_MANAGEMENT.EMAIL_VERIFICATION.CODE_EXPIRES_IN_MINUTES}分钟`,
      },
    });
  }

  private async sendPasswordEmail(email: string, password: string) {
    await this.mailService.sendEmail({
      to: email,
      subject: EMAIL_CONFIG.SUBJECTS.PASSWORD_SENT,
      template: EMAIL_CONFIG.TEMPLATES.PASSWORD_SENT,
      context: {
        email,
        password,
      },
    });
  }
}
