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
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { publicApiThrottler } from '../common/config/throttler.config';
import { ProductStatus } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ============================================================================
  // ADMIN (Protected)
  // ============================================================================

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: QueryProductDto) {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      skipMissingProperties: false,
      validateCustomDecorators: true,
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      skipMissingProperties: false,
      validateCustomDecorators: true,
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async toggleFeatured(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.toggleFeatured(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: ProductStatus },
  ) {
    return await this.productsService.updateStatus(id, body.status);
  }
}

// Public controller for landing page
@Controller('public/products')
export class ProductsPublicController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async listPublic(@Query() query: QueryProductDto) {
    return await this.productsService.findPublicAll(query);
  }

  @Get('slug/:slug')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async getDetailBySlug(@Param('slug') slug: string) {
    const data = await this.productsService.findBySlug(slug);
    return data;
  }
}
