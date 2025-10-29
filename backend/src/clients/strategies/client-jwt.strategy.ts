import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { appConfig, CLIENT_STATUS } from '../../common/config';

@Injectable()
export class ClientJwtStrategy extends PassportStrategy(
  Strategy,
  'client-jwt',
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtConfig.clientSecret,
    });
  }

  async validate(payload: any) {
    if (payload.type !== 'client') {
      throw new UnauthorizedException('无效的令牌类型');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        status: true,
      },
    });

    if (!client) {
      throw new UnauthorizedException('客户不存在');
    }

    if (client.status !== CLIENT_STATUS.ACTIVE) {
      throw new UnauthorizedException('客户账户未激活');
    }

    return {
      id: client.id,
      email: client.email,
      fullName: client.fullName,
      phoneNumber: client.phoneNumber,
      status: client.status,
    };
  }
}
