import { Module } from '@nestjs/common';
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig } from '../config/throttler.config';

@Module({
  imports: [NestThrottlerModule.forRoot(throttlerConfig)],
  exports: [NestThrottlerModule],
})
export class ThrottlerModule {}
