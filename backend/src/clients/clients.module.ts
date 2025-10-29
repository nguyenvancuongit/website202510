import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientJwtStrategy } from './strategies/client-jwt.strategy';
import { PrismaModule } from '../database/prisma.module';
import { MailModule } from '../mail/mail.module';
import { appConfig } from 'src/common/config';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    PassportModule,
    JwtModule.register({
      secret: appConfig.jwtConfig.clientSecret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [ClientsController],
  providers: [ClientsService, ClientJwtStrategy],
  exports: [ClientsService],
})
export class ClientsModule {}
