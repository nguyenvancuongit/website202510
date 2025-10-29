import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CorporateHonorsService } from './corporate-honors.service';
import { CreateCorporateHonorDto } from './dto/create-corporate-honor.dto';
import { UpdateCorporateHonorDto } from './dto/update-corporate-honor.dto';
import { UpdateCorporateHonorOrderDto } from './dto/update-corporate-honor-order.dto';
import { QueryCorporateHonorDto } from './dto/query-corporate-honor.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { appConfig } from '../common/config';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { publicApiThrottler } from 'src/common/config/throttler.config';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Permission } from 'src/users/constants';

@Controller('corporate-honors')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.MANAGE_CORPORATE_HONORS)
export class CorporateHonorsController {
  constructor(private readonly service: CorporateHonorsService) {}

  // ============================================================================
  // ADMIN ENDPOINTS
  // ============================================================================

  private validateFile(file: Express.Multer.File) {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        '图片必须是有效的图片文件 (JPEG, PNG, WebP)',
      );
    }

    if (file.size > maxSize) {
      throw new BadRequestException('图片大小不能超过5MB');
    }
  }

  @Get()
  async findAll(@Query() query: QueryCorporateHonorDto) {
    return await this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', appConfig.getMulterConfig('honor')))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateCorporateHonorDto,
    @Request() req: any,
  ) {
    // Validate file if provided
    if (file) {
      const fileUploadDto = new FileUploadDto();
      fileUploadDto.image = file;
      this.validateFile(file);
    }

    return await this.service.create(dto, file, req.user.id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', appConfig.getMulterConfig('honor')))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateCorporateHonorDto,
    @Request() req: any,
  ) {
    // Validate file if provided
    if (file) {
      const fileUploadDto = new FileUploadDto();
      fileUploadDto.image = file;
      this.validateFile(file);
    }

    return await this.service.update(id, dto, file, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    await this.service.remove(id, req.user.id);
  }

  @Patch('order/update')
  async updateOrder(
    @Body() dto: UpdateCorporateHonorOrderDto,
    @Request() req: any,
  ) {
    return await this.service.updateOrder(dto, req.user.id);
  }
}

@Controller('public/corporate-honors')
export class PublicCorporateHonorsController {
  constructor(private readonly service: CorporateHonorsService) {}

  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: publicApiThrottler })
  async findAllPublic(@Query() query: QueryCorporateHonorDto) {
    // Set default sorting to sort_order for public API
    const modifiedQuery = {
      ...query,
      sort_by: query.sort_by || 'sort_order',
      sort_order: query.sort_order || 'asc',
    };
    return await this.service.findAllPublic(modifiedQuery);
  }
}
