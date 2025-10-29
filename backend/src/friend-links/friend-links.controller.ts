import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { FriendLinksService } from './friend-links.service';
import { CreateFriendLinkDto } from './dto/create-friend-link.dto';
import { UpdateFriendLinkDto } from './dto/update-friend-link.dto';
import { UpdateFriendLinkOrderDto } from './dto/update-friend-link-order.dto';
import { QueryFriendLinksDto } from './dto/query-friend-links.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { publicApiThrottler } from 'src/common/config/throttler.config';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permission } from 'src/users/constants';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { type AuthUser, CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('friend-links')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.MANAGE_FRIENDLY_LINKS)
export class FriendLinksController {
  constructor(private readonly friendLinksService: FriendLinksService) { }

  // ============================================================================
  // ADMIN ENDPOINTS
  // ============================================================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFriendLinkDto: CreateFriendLinkDto, @CurrentUser() user: AuthUser) {
    return this.friendLinksService.create(createFriendLinkDto, user.id);
  }

  @Get()
  async findAll(@Query() query: QueryFriendLinksDto) {
    return await this.friendLinksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.friendLinksService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateFriendLinkDto: UpdateFriendLinkDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.friendLinksService.update(
      BigInt(id),
      updateFriendLinkDto,
      user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.friendLinksService.remove(BigInt(id), user.id);
  }

  @Put('order')
  updateOrder(
    @Body() updateFriendLinkOrderDto: UpdateFriendLinkOrderDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.friendLinksService.updateOrder(
      updateFriendLinkOrderDto,
      user.id,
    );
  }

  @Patch(':id/toggle-status')
  toggleStatus(@Param('id', ParseIntPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.friendLinksService.toggleStatus(BigInt(id), user.id);
  }
}

@Controller('public/friend-links')
export class FriendLinksPublicController {
  constructor(private readonly friendLinksService: FriendLinksService) { }

  // ============================================================================
  // PUBLIC ENDPOINTS
  // ============================================================================

  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  findAllPublic() {
    return this.friendLinksService.findAllPublic();
  }
}
