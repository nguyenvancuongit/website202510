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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecruitmentPostTypesService } from './recruitment-post-types.service';
import { CreateRecruitmentPostTypeDto } from './dto/create-recruitment-post-type.dto';
import { UpdateRecruitmentPostTypeDto } from './dto/update-recruitment-post-type.dto';
import { UpdateRecruitmentPostTypeStatusDto } from './dto/update-status.dto';
import { FindAllRecruitmentPostTypesDto } from './dto/find-all-recruitment-post-types.dto';
import { publicApiThrottler } from '../common/config/throttler.config';
import { type AuthUser, CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { Permission } from '../users/constants';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('recruitment-post-types')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.MANAGE_RECRUITMENTS)
export class RecruitmentPostTypesController {
  constructor(private readonly recruitmentPostTypesService: RecruitmentPostTypesService) { }

  @Post()
  create(@Body() createDto: CreateRecruitmentPostTypeDto, @CurrentUser() user: AuthUser) {
    return this.recruitmentPostTypesService.create(createDto, BigInt(user.id));
  }

  @Get()
  findAll(@Query() query: FindAllRecruitmentPostTypesDto) {
    return this.recruitmentPostTypesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recruitmentPostTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRecruitmentPostTypeDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.recruitmentPostTypesService.update(id, updateDto, BigInt(user.id));
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateRecruitmentPostTypeStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.recruitmentPostTypesService.updateStatus(id, statusDto, BigInt(user.id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recruitmentPostTypesService.remove(id);
  }
}

// Public controller for landing page
@Controller('public/recruitment-post-types')
export class RecruitmentPostTypesPublicController {
  constructor(private readonly recruitmentPostTypesService: RecruitmentPostTypesService) { }

  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async listPublic() {
    const data = await this.recruitmentPostTypesService.findPublicEnabled();
    return data;
  }
}
