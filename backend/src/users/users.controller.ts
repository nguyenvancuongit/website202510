import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { Permission } from './constants';
import {
  CurrentUser,
  type AuthUser,
} from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.MANAGE_USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: AuthUser) {
    if (createUserDto.permissions && !user.permissions.includes(Permission.MANAGE_PERMISSIONS)) {
      throw new ForbiddenException('没有权限分配用户权限');
    }
    return this.usersService.create(createUserDto, user.sub.toString());
  }

  @Get()
  findAll(@Query() getUsersDto: GetUsersDto, @CurrentUser() user: AuthUser) {
    return this.usersService.findAll(getUsersDto, user.sub);
  }

  @Get('permissions')
  getAllPermissions() {
    return this.usersService.getAllPermissions();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: AuthUser,
  ) {
    if (updateUserDto.permissions && !user.permissions.includes(Permission.MANAGE_PERMISSIONS)) {
      throw new ForbiddenException('没有权限分配用户权限');
    }
    return this.usersService.update(BigInt(id), updateUserDto, user.sub);
  }

  @Post(':id/reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Param('id', ParseIntPipe) id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.resetPassword(
      BigInt(id),
      resetPasswordDto,
      user.sub,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.usersService.remove(BigInt(id), user.sub);
  }
}
