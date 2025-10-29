import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BannersModule } from './banners/banners.module';
import { UploadsModule } from './uploads/uploads.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { FriendLinksModule } from './friend-links/friend-links.module';
import { CustomersModule } from './customers/customers.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from './common/throttler/throttler.module';
import { MediasModule } from './medias/medias.module';
import { ClientsModule } from './clients/clients.module';
import { MailModule } from './mail/mail.module';
import { CorporateHonorsModule } from './corporate-honors/corporate-honors.module';
import { CategoriesModule } from './categories/categories.module';
import { LatestNewsModule } from './latest-news/latest-news.module';
import { CaseStudiesModule } from './case-studies/case-studies.module';
import { ProductsModule } from './products/products.module';
import { OperationLogModule } from './operation-logs/operation-log.module';
import { RecruitmentPostTypesModule } from './recruitment-post-types/recruitment-post-types.module';
import { RecruitmentPostsModule } from './recruitment-posts/recruitment-posts.module';
import { ResumeApplicationsModule } from './resume-applications/resume-applications.module';
import { RedisCacheService } from './cache/redis.service';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [
    // Todo: need to configure rate limit on api gateway or reverse proxy (e.g. Nginx) in production
    //  and disable this throttling module to avoid performance overhead
    ThrottlerModule, // Rate limiting
    ScheduleModule.forRoot(), // Enable scheduled tasks
    PrismaModule,
    AuthModule,
    BannersModule,
    CategoriesModule,
    LatestNewsModule,
    CaseStudiesModule,
    ProductsModule,
    UploadsModule,
    SystemSettingsModule,
    FriendLinksModule,
    CustomersModule,
    HashtagsModule,
    MediasModule,
    UsersModule,
    ClientsModule, // Client authentication
    MailModule, // Email service
    CorporateHonorsModule,
    RecruitmentPostTypesModule,
    RecruitmentPostsModule,
    ResumeApplicationsModule,
    OperationLogModule, // Operation logging
    AddressesModule, // Address lookup (provinces, cities, districts)
  ],
  controllers: [AppController],
  providers: [AppService, RedisCacheService],
})
export class AppModule {}
