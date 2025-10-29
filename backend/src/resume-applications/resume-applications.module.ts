import { Module } from '@nestjs/common';
import { ResumeApplicationsService } from './resume-applications.service';
import { 
  ResumeApplicationsPublicController, 
  ResumeApplicationsController 
} from './resume-applications.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResumeApplicationsPublicController, ResumeApplicationsController],
  providers: [ResumeApplicationsService],
  exports: [ResumeApplicationsService],
})
export class ResumeApplicationsModule {}
