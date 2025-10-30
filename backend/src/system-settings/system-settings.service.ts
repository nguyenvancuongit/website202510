import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisCacheService } from '../cache/redis.service';
import { CreateSystemSettingDto } from './dto/create-system-setting.dto';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';
import { SystemSetting } from '@prisma/client';
import { CATEGORY_VIEW_MORE_KEYS, OPERATION_TYPE, MODULE_TYPE, TARGET_TYPE, OPERATION_STATUS } from '../common/config/constants';
import { OperationLogService } from '../operation-logs/operation-log.service';
import type { OperationType, ModuleType, TargetType } from '../common/config/constants';

@Injectable()
export class SystemSettingsService {
  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private readonly operationLogService: OperationLogService,
  ) { }

  async create(
    createSystemSettingDto: CreateSystemSettingDto,
  ): Promise<SystemSetting> {
    try {
      // 检查key是否已存在
      const existingSetting = await this.prisma.systemSetting.findUnique({
        where: { key: createSystemSettingDto.key },
      });

      if (existingSetting) {
        throw new BadRequestException('设置键已存在');
      }

      const setting = await this.prisma.systemSetting.create({
        data: createSystemSettingDto,
      });

      return setting;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('创建系统设置失败');
    }
  }

  async findAll(): Promise<SystemSetting[]> {
    return await this.prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async findOne(key: string): Promise<SystemSetting> {
    try {
      const setting = await this.prisma.systemSetting.findUnique({
        where: { key },
      });

      if (!setting) {
        throw new NotFoundException('系统设置不存在');
      }

      return setting;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('获取系统设置失败');
    }
  }

  async update(
    key: string,
    updateSystemSettingDto: UpdateSystemSettingDto,
  ): Promise<SystemSetting> {
    try {
      const setting = await this.prisma.systemSetting.findUnique({
        where: { key },
      });

      if (!setting) {
        throw new NotFoundException('系统设置不存在');
      }

      const updatedSetting = await this.prisma.systemSetting.update({
        where: { key },
        data: updateSystemSettingDto,
      });

      return updatedSetting;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('更新系统设置失败');
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const setting = await this.prisma.systemSetting.findUnique({
        where: { key },
      });

      if (!setting) {
        throw new NotFoundException('系统设置不存在');
      }

      await this.prisma.systemSetting.delete({
        where: { key },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('删除系统设置失败');
    }
  }

  async getValue(key: string): Promise<any> {
    try {
      const setting = await this.findOne(key);

      switch (setting.type) {
        case 'boolean':
          return setting.value === 'true';
        case 'number':
          return parseFloat(setting.value);
        case 'json':
          return JSON.parse(setting.value);
        default:
          return setting.value;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }

  async setValue(
    key: string,
    value: any,
    type: string = 'string',
  ): Promise<SystemSetting> {
    let stringValue: string;

    switch (type) {
      case 'boolean':
        stringValue = Boolean(value).toString();
        break;
      case 'number':
        stringValue = Number(value).toString();
        break;
      case 'json':
        stringValue = JSON.stringify(value);
        break;
      default:
        stringValue = String(value);
    }

    const existingSetting = await this.prisma.systemSetting.findUnique({
      where: { key },
    });

    if (existingSetting) {
      return await this.update(key, { value: stringValue, type });
    } else {
      return await this.create({ key, value: stringValue, type });
    }

  }

  async toggleViewMore(categoryType: number, userId?: string): Promise<SystemSetting> {
    try {
      const settingKey =
        CATEGORY_VIEW_MORE_KEYS[
        categoryType as keyof typeof CATEGORY_VIEW_MORE_KEYS
        ];

      if (!settingKey) {
        throw new BadRequestException('不支持的分类类型');
      }

      // Get current value
      const currentSetting = await this.findOne(settingKey);
      const currentValue = currentSetting.value === 'true';
      const newValue = !currentValue;

      // Update the setting
      const result = await this.setValue(settingKey, newValue, 'boolean');

      // Log operation if userId is provided
      if (userId) {
        const actionDesc = newValue ? '启用' : '禁用';
        const categoryLabels = {
          0: '热门资讯',
          1: '产品体系',
          2: '解决方案',
          3: '客户案例'
        };
        const categoryName = categoryLabels[categoryType as keyof typeof categoryLabels] || `分类${categoryType}`;
        
        await this.operationLogService.createLog({
          userId: BigInt(userId),
          operationType: newValue ? OPERATION_TYPE.ENABLE as OperationType : OPERATION_TYPE.DISABLE as OperationType,
          module: MODULE_TYPE.SYSTEM_SETTINGS as ModuleType,
          operationDesc: `${actionDesc}${categoryName}的查看更多按钮 (设置项: ${settingKey}, ${currentValue ? 'true' : 'false'} → ${newValue ? 'true' : 'false'})`,
          targetType: TARGET_TYPE.SYSTEM_SETTING as TargetType,
          targetId: settingKey,
          status: OPERATION_STATUS.SUCCESS,
        });
      }

      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('切换显示更多按钮状态失败');
    }
  }

  async getViewMoreStatus(categoryType: number): Promise<boolean> {
    try {
      const settingKey =
        CATEGORY_VIEW_MORE_KEYS[
        categoryType as keyof typeof CATEGORY_VIEW_MORE_KEYS
        ];

      if (!settingKey) {
        throw new BadRequestException('不支持的分类类型');
      }

      const setting = await this.findOne(settingKey);
      return setting.value === 'true';
    } catch (error) {
      if (error instanceof NotFoundException) {
        // If setting doesn't exist, default to true
        return true;
      }
      throw new BadRequestException('获取显示更多按钮状态失败');
    }
  }

  // Solution Pages Configuration Methods
  async getSolutionPagesConfig(): Promise<any> {
    const cacheKey = 'system-settings:solution-pages:config';
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const setting = await this.prisma.systemSetting.findUnique({
        where: { key: 'solution_pages_config' },
      });

      let config;
      if (!setting) {
        // Return default configuration if not exists
        config = this.getDefaultSolutionPagesConfig();
      } else {
        config = JSON.parse(setting.value);
      }

      await this.cache.set(cacheKey, config, 300); // Cache for 5 minutes
      return config;
    } catch {
      throw new BadRequestException('获取解决方案页面配置失败');
    }
  }

  // Product Pages Configuration Methods
  async getProductPagesConfig(): Promise<any> {
    const cacheKey = 'system-settings:product-pages:config';
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const setting = await this.prisma.systemSetting.findUnique({
        where: { key: 'product_pages_config' },
      });

      let config;
      if (!setting) {
        // Return default configuration if not exists
        config = this.getDefaultProductPagesConfig();
      } else {
        config = JSON.parse(setting.value);
      }

      await this.cache.set(cacheKey, config, 300); // Cache for 5 minutes
      return config;
    } catch {
      throw new BadRequestException('获取产品页面配置失败');
    }
  }

  async updateSolutionPagesConfig(config: any, userId?: string): Promise<any> {
    try {
      // Validate the configuration structure
      this.validateSolutionPagesConfig(config);

      // Get old config for comparison
      const oldConfigSetting = await this.prisma.systemSetting.findUnique({
        where: { key: 'solution_pages_config' },
      });
      
      let oldConfig = {};
      if (oldConfigSetting) {
        oldConfig = JSON.parse(oldConfigSetting.value);
      } else {
        oldConfig = this.getDefaultSolutionPagesConfig();
      }

      const setting = await this.prisma.systemSetting.upsert({
        where: { key: 'solution_pages_config' },
        update: {
          value: JSON.stringify(config),
          type: 'json',
        },
        create: {
          key: 'solution_pages_config',
          value: JSON.stringify(config),
          type: 'json',
        },
      });

      // Invalidate related caches
      await this.cache.invalidateByPattern('system-settings:solution-pages:*');

      // Log operation if userId is provided
      if (userId) {
        // Compare old and new config to find changes
        const changedPages: string[] = [];
        let hasOrderChanges = false;
        
        Object.keys(config).forEach(pageKey => {
          const oldPage = oldConfig[pageKey];
          const newPage = config[pageKey];
          
          if (!oldPage) {
            // New page added
            const status = newPage.enabled ? '启用' : '禁用';
            const pageName = newPage.name || pageKey;
            changedPages.push(`${pageName} -> ${status}`);
          } else {
            // Check for enabled status changes
            if (oldPage.enabled !== newPage.enabled) {
              const status = newPage.enabled ? '启用' : '禁用';
              const pageName = newPage.name || pageKey;
              changedPages.push(`${pageName} -> ${status}`);
            }
            
            // Check for order changes
            if (oldPage.order !== newPage.order) {
              hasOrderChanges = true;
            }
          }
        });
        
        let operationDesc = '';
        if (changedPages.length > 0) {
          operationDesc = `更新解决方案页面配置: ${changedPages.join(', ')}`;
          if (hasOrderChanges) {
            operationDesc += ', 调整页面排序';
          }
        } else if (hasOrderChanges) {
          operationDesc = '更新解决方案页面配置: 调整页面排序';
        } else {
          operationDesc = '更新解决方案页面配置';
        }
        
        await this.operationLogService.createLog({
          userId: BigInt(userId),
          operationType: OPERATION_TYPE.UPDATE as OperationType,
          module: MODULE_TYPE.SYSTEM_SETTINGS as ModuleType,
          operationDesc: operationDesc,
          targetType: TARGET_TYPE.SYSTEM_SETTING as TargetType,
          targetId:  oldConfigSetting?.id.toString(),
          status: OPERATION_STATUS.SUCCESS,
        });
      }

      return JSON.parse(setting.value);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('更新解决方案页面配置失败');
    }
  }

  async updateProductPagesConfig(config: any, userId?: string): Promise<any> {
    try {
      // Validate the configuration structure
      this.validateProductPagesConfig(config);

      // Get old config for comparison
      const oldConfigSetting = await this.prisma.systemSetting.findUnique({
        where: { key: 'product_pages_config' },
      });
      
      let oldConfig = {};
      if (oldConfigSetting) {
        oldConfig = JSON.parse(oldConfigSetting.value);
      } else {
        oldConfig = this.getDefaultProductPagesConfig();
      }

      const setting = await this.prisma.systemSetting.upsert({
        where: { key: 'product_pages_config' },
        update: {
          value: JSON.stringify(config),
          type: 'json',
        },
        create: {
          key: 'product_pages_config',
          value: JSON.stringify(config),
          type: 'json',
        },
      });

      // Invalidate related caches
      await this.cache.invalidateByPattern('system-settings:product-pages:*');

      // Log operation if userId is provided
      if (userId) {
        // Compare old and new config to find changes
        const changedPages: string[] = [];
        let hasOrderChanges = false;
        
        Object.keys(config).forEach(pageKey => {
          const oldPage = oldConfig[pageKey];
          const newPage = config[pageKey];
          
          if (!oldPage) {
            // New page added
            const status = newPage.enabled ? '启用' : '禁用';
            const pageName = newPage.name || pageKey;
            changedPages.push(`${pageName} -> ${status}`);
          } else {
            // Check for enabled status changes
            if (oldPage.enabled !== newPage.enabled) {
              const status = newPage.enabled ? '启用' : '禁用';
              const pageName = newPage.name || pageKey;
              changedPages.push(`${pageName} -> ${status}`);
            }
            
            // Check for order changes
            if (oldPage.order !== newPage.order) {
              hasOrderChanges = true;
            }
          }
        });
        
        let operationDesc = '';
        if (changedPages.length > 0) {
          operationDesc = `更新产品页面配置: ${changedPages.join(', ')}`;
          if (hasOrderChanges) {
            operationDesc += ', 调整页面排序';
          }
        } else if (hasOrderChanges) {
          operationDesc = '更新产品页面配置: 调整页面排序';
        } else {
          operationDesc = '更新产品页面配置';
        }
        
        await this.operationLogService.createLog({
          userId: BigInt(userId),
          operationType: OPERATION_TYPE.UPDATE as OperationType,
          module: MODULE_TYPE.SYSTEM_SETTINGS as ModuleType,
          operationDesc: operationDesc,
          targetType: TARGET_TYPE.SYSTEM_SETTING as TargetType,
          targetId:  oldConfigSetting?.id.toString(),
          status: OPERATION_STATUS.SUCCESS,
        });
      }

      return JSON.parse(setting.value);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('更新产品页面配置失败');
    }
  }

  async getEnabledSolutionPages(): Promise<any> {
    const cacheKey = 'system-settings:solution-pages:enabled';
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;

    try {
      const config = await this.getSolutionPagesConfig();
      const enabledPages: any = {};

      Object.keys(config).forEach(pageKey => {
        if (config[pageKey].enabled) {
          enabledPages[pageKey] = config[pageKey];
        }
      });

      await this.cache.set(cacheKey, enabledPages, 300); // Cache for 5 minutes
      return enabledPages;
    } catch {
      throw new BadRequestException('获取已启用的解决方案页面失败');
    }
  }

  async getEnabledProductPages(): Promise<any> {
    const cacheKey = 'system-settings:product-pages:enabled';
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;

    try {
      const config = await this.getProductPagesConfig();
      const enabledPages: any = {};

      Object.keys(config).forEach(pageKey => {
        if (config[pageKey].enabled) {
          enabledPages[pageKey] = config[pageKey];
        }
      });

      await this.cache.set(cacheKey, enabledPages, 300); // Cache for 5 minutes
      return enabledPages;
    } catch {
      throw new BadRequestException('获取已启用的产品页面失败');
    }
  }

  private getDefaultSolutionPagesConfig() {
    return {
      classroom: {
        enabled: true,
        order: 1,
        name: '智慧教室',
        description: '智能化教室解决方案',
        slug: 'classroom'
      },
      enterprise: {
        enabled: true,
        order: 2,
        name: '企业解决方案',
        description: '企业级智能化解决方案',
        slug: 'enterprise'
      },
      'guidance-center': {
        enabled: true,
        order: 3,
        name: '指导中心',
        description: '学生指导中心解决方案',
        slug: 'guidance-center'
      },
      'teacher-guidance': {
        enabled: true,
        order: 4,
        name: '教师指导',
        description: '教师指导系统解决方案',
        slug: 'teacher-guidance'
      },
      'teacher-training': {
        enabled: true,
        order: 5,
        name: '教师培训',
        description: '教师培训管理解决方案',
        slug: 'teacher-training'
      },
      'university-city': {
        enabled: true,
        order: 6,
        name: '大学城',
        description: '智慧大学城综合解决方案',
        slug: 'university-city'
      }
    };
  }

  private getDefaultProductPagesConfig() {
    return {
      'cloud-platform': {
        enabled: true,
        order: 1,
        name: '学生发展指导智慧云平台',
        description: '赋能生涯教育数智化建设',
        slug: 'cloud-platform'
      },
      terminal: {
        enabled: true,
        order: 2,
        name: '智能生涯自助探索终端',
        description: '助力学生课余自助探索',
        slug: 'terminal'
      },
      games: {
        enabled: true,
        order: 3,
        name: '生涯活动与服务',
        description: '校园大型生涯探索活动',
        slug: 'games'
      },
      assessment: {
        enabled: true,
        order: 4,
        name: '企业人才发展与数智化服务',
        description: '人才体系建设咨询与服务',
        slug: 'assessment'
      }
    };
  }

  private validateSolutionPagesConfig(config: any): void {
    if (!config || typeof config !== 'object') {
      throw new BadRequestException('配置格式无效');
    }

    const validPageKeys = ['classroom', 'enterprise', 'guidance-center', 'teacher-guidance', 'teacher-training', 'university-city'];

    Object.keys(config).forEach(pageKey => {
      if (!validPageKeys.includes(pageKey)) {
        throw new BadRequestException(`无效的页面键: ${pageKey}`);
      }

      const page = config[pageKey];
      if (typeof page.enabled !== 'boolean') {
        throw new BadRequestException(`页面 ${pageKey} 的 enabled 字段必须是布尔值`);
      }

      if (typeof page.order !== 'number' || page.order < 1) {
        throw new BadRequestException(`页面 ${pageKey} 的 order 字段必须是大于0的数字`);
      }

      if (!page.name || typeof page.name !== 'string') {
        throw new BadRequestException(`页面 ${pageKey} 的 name 字段是必需的`);
      }
    });
  }

  private validateProductPagesConfig(config: any): void {
    if (!config || typeof config !== 'object') {
      throw new BadRequestException('配置格式无效');
    }

    const validPageKeys = ['cloud-platform', 'terminal', 'games', 'assessment'];

    Object.keys(config).forEach(pageKey => {
      if (!validPageKeys.includes(pageKey)) {
        throw new BadRequestException(`无效的产品页面键: ${pageKey}`);
      }

      const page = config[pageKey];
      if (typeof page.enabled !== 'boolean') {
        throw new BadRequestException(`产品页面 ${pageKey} 的 enabled 字段必须是布尔值`);
      }

      if (typeof page.order !== 'number' || page.order < 1) {
        throw new BadRequestException(`产品页面 ${pageKey} 的 order 字段必须是大于0的数字`);
      }

      if (!page.name || typeof page.name !== 'string') {
        throw new BadRequestException(`产品页面 ${pageKey} 的 name 字段是必需的`);
      }
    });
  }

  // Career Education Categories Configuration
  async getCareerEducationConfig(): Promise<any> {
    const cacheKey = 'system:career-education-config';

    try {
      // Try to get from cache first
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Get from database
      const setting = await this.prisma.systemSetting.findUnique({
        where: { key: 'career_education_config' },
      });

      let config;
      if (!setting) {
        // Create default configuration if not exists
        config = this.getDefaultCareerEducationConfig();
        await this.prisma.systemSetting.create({
          data: {
            key: 'career_education_config',
            value: JSON.stringify(config),
            type: 'json',
          },
        });
      } else {
        config = JSON.parse(setting.value);
      }

      // Cache for 5 minutes
      await this.cache.set(cacheKey, JSON.stringify(config), 300);

      return config;
    } catch {
      throw new BadRequestException('获取生涯教育配置失败');
    }
  }

  async updateCareerEducationConfig(config: any): Promise<any> {
    try {
      // DTO validation already done at controller level
      // Update in database
      const updated = await this.prisma.systemSetting.upsert({
        where: { key: 'career_education_config' },
        update: {
          value: JSON.stringify(config),
          type: 'json',
        },
        create: {
          key: 'career_education_config',
          value: JSON.stringify(config),
          type: 'json',
        },
      });

      // Clear cache
      await this.cache.del('system:career-education-config');

      return JSON.parse(updated.value);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('更新生涯教育配置失败');
    }
  }

  async getEnabledCareerEducation(): Promise<any> {
    try {
      const config = await this.getCareerEducationConfig();

      const result = {};
      Object.keys(config).forEach(categoryKey => {
        const category = config[categoryKey];
        if (category.enabled) {
          // Filter enabled items within the category
          const enabledItems = category.items
            .filter((item: any) => item.enabled)
            .sort((a: any, b: any) => a.order - b.order);

          result[categoryKey] = {
            ...category,
            items: enabledItems
          };
        }
      });

      return result;
    } catch {
      throw new BadRequestException('获取已启用的生涯教育配置失败');
    }
  }

  private getDefaultCareerEducationConfig() {
    return {
      platform: {
        enabled: true,
        order: 1,
        name: '学生发展指导智慧平台',
        items: [
          {
            id: 'platform-1',
            enabled: true,
            order: 1,
            title: '学生测评与发展指导系统',
            description: '学生通过PC端完成生涯课堂作业、开展自由测评练习，查询职业、院校信息库，让学生了解自我、认知世界、模拟高考志愿填报。',
          },
          {
            id: 'platform-2',
            enabled: true,
            order: 2,
            title: '生涯教师咨询辅助系统',
            description: '应个体咨询辅导不同阶段的需求，精选科学权威的量表、工具，覆盖中学阶段生涯教育资源包，辅助教师高效开展个性化指导。',
          },
          {
            id: 'platform-3',
            enabled: true,
            order: 3,
            title: '生涯课堂系统',
            description: '智能化软硬件组合，内置不同侧重点的测评量表和生涯探索工具，教学模式灵活调用，帮助教师优化发展指导教学内容。',
          },
          {
            id: 'platform-4',
            enabled: true,
            order: 4,
            title: '生涯数据可视化看板',
            description: '汇集师生运用学生发展指导智慧平台所获得的过程数据和结果数据，实时展示学生生涯规划指导的各版块工作进展。',
          }
        ]
      },
      device: {
        enabled: true,
        order: 2,
        name: '生涯探索智能设备',
        items: [
          {
            id: 'device-1',
            enabled: true,
            order: 1,
            title: '生涯自助探索一体机',
            description: '集合了"测试探索、升学指导、职业规划"三大核心模块，多场景灵活部署，助力学校减负增效，弥补专业指导老师缺口。',
          },
          {
            id: 'device-2',
            enabled: true,
            order: 2,
            title: 'AI智能静音生涯探索舱',
            description: '环保静音舱体，内置生涯教师咨询辅助系统，可结合学生的兴趣、个性和职业倾向等进行专业测评，开展学业发展辅导。',
          },
          {
            id: 'device-3',
            enabled: true,
            order: 3,
            title: '卧式生涯自助探索终端',
            description: '融合放松按摩与智能生涯探索的功能，为学生营造轻松舒缓的探索环境，便于进行深度的兴趣发掘、职业测评与学业规划。',
          },
          {
            id: 'device-4',
            enabled: true,
            order: 4,
            title: '元宇宙兴趣岛探索终端',
            description: '借助元宇宙技术，构建妙趣横生的虚拟兴趣岛，搭配VR眼镜，让学生沉浸式挖掘兴趣爱好，唤醒其探索世界的意识。',
          }
        ]
      },
      training: {
        enabled: true,
        order: 3,
        name: '生涯培训与活动',
        items: [
          {
            id: 'training-1',
            enabled: true,
            order: 1,
            title: '生涯游园会活动',
            description: '以生涯规划著名理论"认知信息加工理论（CIP）"为基础，设置三大生涯探索体验区，让学生了解自己性格、兴趣及能力等。',
          },
          {
            id: 'training-2',
            enabled: true,
            order: 2,
            title: '校园科技节活动',
            description: '深度融合数字科技与生涯规划理论，联合学校共同打造沉浸式生涯探索体验，助力学生从多个维度认识自我、了解世界。',
          },
          {
            id: 'training-3',
            enabled: true,
            order: 3,
            title: '职业大讲堂活动',
            description: '邀请各行各业的从业者，以讲座、互动问答等形式，分享职业日常、成长路径与行业前景，帮助学生初步建立职业认知。',
          },
          {
            id: 'training-4',
            enabled: true,
            order: 4,
            title: '企业参访活动',
            description: '组织学生前往各行业、企业进行实地观察、了解未来就业方向、岗位职责、薪资水平等，帮助学生进一步明晰生涯发展方向。',
          },
          {
            id: 'training-5',
            enabled: true,
            order: 5,
            title: '生涯指导老师高级研修班',
            description: '通过案例研讨、实操训练、生涯指导工具运用等形式，聚焦理论更新、技能优化、课程设计等内容，提升教师专业素养。',
          },
          {
            id: 'training-6',
            enabled: true,
            order: 6,
            title: '生涯指导老师A/B/C证培训',
            description: '象导生涯以师资培训解决方案为支撑，以打造专业的生涯教育指导教师为目标，推出的多层次培训课程和资质认证体系。',
          }
        ]
      },
      consulting: {
        enabled: true,
        order: 4,
        name: '企业数字化咨询服务',
        items: [
          {
            id: 'consulting-1',
            enabled: true,
            order: 1,
            title: '企业人才发展咨询服务',
            description: '为企业量身定制的人才培养与发展的方案，提供全周期、一站式的人才发展咨询服务，提升核心人才的能力，驱动企业快速发展。',
          },
          {
            id: 'consulting-2',
            enabled: true,
            order: 2,
            title: '数智化转型咨询服务',
            description: '赋能企业数字化转型，梳理生产流程、客户开发、组织决策等关键环节的问题，重组优化原有业务流程，提升运营与决策效率。',
          }
        ]
      }
    };
  }

}
