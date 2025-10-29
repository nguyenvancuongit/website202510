import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import {
  CustomersController,
  CustomersPublicController,
} from './customers.controller';
import { PrismaModule } from '../database/prisma.module';
import { OperationLogModule } from '../operation-logs/operation-log.module';
import { CaptchaModule } from '../captcha/captcha.module';

@Module({
  imports: [PrismaModule, OperationLogModule, CaptchaModule],
  controllers: [CustomersController, CustomersPublicController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
