import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { CreateSystemSettingDto } from './dto/create-system-setting.dto';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';
import { UpdateCareerEducationConfigDto } from './dto/career-education-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { Permission } from '../users/constants';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

// Admin Controller
@Controller('system-settings')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.MANAGE_SYSTEM_SETTINGS)
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) { }

  @Post()
  create(@Body() createSystemSettingDto: CreateSystemSettingDto) {
    return this.systemSettingsService.create(createSystemSettingDto);
  }

  @Get()
  findAll() {
    return this.systemSettingsService.findAll();
  }

  // @Get(':key')
  // findOne(@Param('key') key: string) {
  //   return this.systemSettingsService.findOne(key);
  // }

  @Patch(':key')
  update(
    @Param('key') key: string,
    @Body() updateSystemSettingDto: UpdateSystemSettingDto,
  ) {
    return this.systemSettingsService.update(key, updateSystemSettingDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.systemSettingsService.remove(key);
  }

  @Post('view-more/:categoryType/toggle')
  async toggleViewMore(
    @Param('categoryType', ParseIntPipe) categoryType: number,
    @CurrentUser() user: AuthUser,
  ) {
    const data = await this.systemSettingsService.toggleViewMore(categoryType, user.id);
    return { data };
  }

  @Get('view-more/:categoryType')
  async getViewMoreStatus(
    @Param('categoryType', ParseIntPipe) categoryType: number,
  ) {
    const enabled =
      await this.systemSettingsService.getViewMoreStatus(categoryType);
    return { data: { value: enabled.toString() } };
  }

  // Solution Pages Configuration Endpoints
  @Get('solution-pages')
  async getSolutionPagesConfig() {
    return await this.systemSettingsService.getSolutionPagesConfig();
  }

  @Post('solution-pages')
  async updateSolutionPagesConfig(@Body() config: any, @CurrentUser() user: AuthUser) {
    return await this.systemSettingsService.updateSolutionPagesConfig(config, user.id);
  }

  // Product Pages Configuration Endpoints
  @Get('product-pages')
  async getProductPagesConfig() {
    return await this.systemSettingsService.getProductPagesConfig();
  }

  @Post('product-pages')
  async updateProductPagesConfig(@Body() config: any, @CurrentUser() user: AuthUser) {
    return await this.systemSettingsService.updateProductPagesConfig(config, user.id);
  }

  // Career Education Configuration Endpoints
  @Get('career-education')
  async getCareerEducationConfig() {
    return await this.systemSettingsService.getCareerEducationConfig();
  }

  @Post('career-education')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateCareerEducationConfig(
    @Body() config: UpdateCareerEducationConfigDto,
  ) {
    return await this.systemSettingsService.updateCareerEducationConfig(config);
  }
}

// Public Controller (no authentication required)
@Controller('system-settings/public')
export class SystemSettingsPublicController {
  constructor(private readonly systemSettingsService: SystemSettingsService) { }

  @Get('solution-pages')
  async getEnabledSolutionPages() {
    return await this.systemSettingsService.getEnabledSolutionPages();
  }

  @Get('product-pages')
  async getEnabledProductPages() {
    return await this.systemSettingsService.getEnabledProductPages();
  }

  @Get('career-education')
  async getEnabledCareerEducation() {
    return await this.systemSettingsService.getEnabledCareerEducation();
  }
}
