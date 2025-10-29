import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoriesDto } from './dto/query-categories.dto';
import { UpdateCategoryOrderDto } from './dto/update-category-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { publicApiThrottler } from '../common/config/throttler.config';
import { CategoryStatus } from '@prisma/client';
import { CategoryType } from './types';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Permission } from 'src/users/constants';
import { type AuthUser, CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(
  Permission.MANAGE_LATEST_NEWS,
  Permission.MANAGE_CASE_STUDIES,
)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  // ============================================================================
  // ADMIN (Protected)
  // ============================================================================

  @Get(':category')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('category', new ParseEnumPipe(CategoryType)) category: CategoryType,
    @Query() query: QueryCategoriesDto,
  ) {
    // Apply default values if not provided
    const queryWithDefaults: QueryCategoriesDto = {
      page: 1,
      limit: 10,
      sort_by: 'order',
      sort_order: 'asc',
      ...query,
    };

    return await this.categoriesService.findAll(queryWithDefaults, category);
  }

  @Get(':category/:id')
  async findOne(
    @Param('category', new ParseEnumPipe(CategoryType)) category: CategoryType,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.categoriesService.findOne(id, category);
  }

  // ============================================================================
  // ADMIN ENDPOINTS (Protected)
  // ============================================================================

  @Post(':category')
  async create(
    @Param('category', new ParseEnumPipe(CategoryType)) category: CategoryType,
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.categoriesService.create(
      createCategoryDto,
      category,
      user.id,
    );
  }

  @Patch(':category/:id')
  async update(
    @Param('category', new ParseEnumPipe(CategoryType)) category: CategoryType,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.categoriesService.update(
      id,
      updateCategoryDto,
      category,
      user.id,
    );
  }

  @Delete(':category/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('category', new ParseEnumPipe(CategoryType)) category: CategoryType,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.categoriesService.remove(id, category, user.id);
  }

  @Put(':category/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOrder(@Body() updateCategoryOrderDto: UpdateCategoryOrderDto) {
    return await this.categoriesService.updateOrder(updateCategoryOrderDto);
  }

  // ============================================================================
  // UTILITY ENDPOINTS
  // ============================================================================

  @Get(':category/status/:status')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async findByStatus(
    @Param('category', new ParseEnumPipe(CategoryType)) category: CategoryType,
    @Param('status') status: CategoryStatus,
  ) {
    return await this.categoriesService.findByStatus(status);
  }
}

// Public categories
@Controller('public/categories')
export class PublicCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get(':category')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  @HttpCode(HttpStatus.OK)
  async all(
    @Param('category', new ParseEnumPipe(CategoryType)) category: CategoryType,
  ) {
    const data = await this.categoriesService.findPublicAll(
      category,
    );
    return data;
  }
}
