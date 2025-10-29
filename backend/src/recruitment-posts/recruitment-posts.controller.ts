import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { RecruitmentPostsService } from './recruitment-posts.service';
import { CreateRecruitmentPostDto } from './dto/create-recruitment-post.dto';
import { UpdateRecruitmentPostDto } from './dto/update-recruitment-post.dto';
import { UpdateRecruitmentPostStatusDto } from './dto/update-status.dto';
import { FindAllRecruitmentPostsDto } from './dto/find-all-recruitment-posts.dto';
import { QueryPublicRecruitmentPostsDto, QueryRelatedPostsDto } from './dto/query-public-recruitment-posts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { publicApiThrottler } from '../common/config/throttler.config';
import { type AuthUser, CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('recruitment-posts')
@UseGuards(JwtAuthGuard)
export class RecruitmentPostsController {
  constructor(private readonly recruitmentPostsService: RecruitmentPostsService) { }

  @Post()
  async create(@Body() createDto: CreateRecruitmentPostDto, @CurrentUser() user: AuthUser) {
    return this.recruitmentPostsService.create(createDto, BigInt(user.id));
  }

  @Get()
  async findAll(@Query() query: FindAllRecruitmentPostsDto) {
    return this.recruitmentPostsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recruitmentPostsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRecruitmentPostDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.recruitmentPostsService.update(id, updateDto, BigInt(user.id));
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateRecruitmentPostStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.recruitmentPostsService.updateStatus(
      id,
      updateStatusDto.status,
      BigInt(user.id),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.recruitmentPostsService.remove(id);
    return { message: '招聘信息删除成功' };
  }
}

// Public controller for landing page
@Controller('public/recruitment-posts')
export class RecruitmentPostsPublicController {
  constructor(private readonly recruitmentPostsService: RecruitmentPostsService) { }

  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async listPublic(@Query() query: QueryPublicRecruitmentPostsDto) {
    const data = await this.recruitmentPostsService.findPublicPosts(query);
    return data;
  }

  @Get('slug/:slug')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async getBySlug(@Param('slug') slug: string) {
    const data = await this.recruitmentPostsService.findPublicPostBySlug(slug);
    return data;
  }

  @Get("related-posts/:id")
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async getRelatedPosts(@Param('id') id: string, @Query() query: QueryRelatedPostsDto) {
    return await this.recruitmentPostsService.getRelatedPosts(id, query.limit);
  }
}
