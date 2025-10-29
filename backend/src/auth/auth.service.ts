import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/auth.dto';
import { USER_STATUS } from '../common/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    if (!loginDto) {
      throw new UnauthorizedException('需要登录数据');
    }

    const { phone, password } = loginDto as any;

    if (!phone || !password) {
      throw new UnauthorizedException('手机号和密码是必填项');
    }

    // Find user by phone
    const user = await this.prisma.user.findFirst({
      where: {
        phone,
        status: USER_STATUS.ACTIVE,
      },
    });

    if (!user) {
      throw new UnauthorizedException('手机号或密码无效');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('手机号或密码无效');
    }

    // Create JWT token
    const payload = {
      sub: user.id.toString(),
      username: user.username,
      email: user.email,
      permissions: user.permissions,
      id: user.id.toString(),
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        status: user.status,
        permissions: user.permissions,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: BigInt(userId),
        status: USER_STATUS.ACTIVE,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      phone: user.phone,
      status: user.status,
      permissions: user.permissions,
    };
  }

  async changePassword(userId: string, newPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await this.prisma.user.update({
      where: { id: BigInt(userId) },
      data: { passwordHash },
    });
    return { success: true };
  }
}
