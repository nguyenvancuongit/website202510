import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PERMISSIONS } from '../src/users/constants/index';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin user with password from environment variable
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_DEFAULT_PASSWORD || 'vian2025',
    10,
  );

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      permissions: PERMISSIONS.map((p) => p.value),
    },
    create: {
      username: 'admin',
      email: 'admin@vianblog.com',
      phone: '0987654321',
      passwordHash: adminPassword,
      status: 'active',
      permissions: PERMISSIONS.map((p) => p.value),
    },
  });

  console.log('Created admin user:', admin);

  // Create default solution pages configuration
  const solutionPagesConfig = {
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

  const solutionPagesSetting = await prisma.systemSetting.upsert({
    where: { key: 'solution_pages_config' },
    update: {
      value: JSON.stringify(solutionPagesConfig),
      type: 'json',
    },
    create: {
      key: 'solution_pages_config',
      value: JSON.stringify(solutionPagesConfig),
      type: 'json',
    },
  });

  console.log('Created solution pages configuration:', solutionPagesSetting.key);

  // Create default product pages configuration
  const productPagesConfig = {
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

  const productPagesSetting = await prisma.systemSetting.upsert({
    where: { key: 'product_pages_config' },
    update: {
      value: JSON.stringify(productPagesConfig),
      type: 'json',
    },
    create: {
      key: 'product_pages_config',
      value: JSON.stringify(productPagesConfig),
      type: 'json',
    },
  });

  console.log('Created product pages configuration:', productPagesSetting.key);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
