/**
 * User Status Constants
 */
export const USER_STATUS = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
} as const;

/**
 * User Management Constants
 */
export const USER_MANAGEMENT = {
  DEFAULT_PASSWORD_LENGTH: 8,
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  PASSWORD_CHARACTERS:
    'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789',
} as const;

/**
 * Client Status Constants
 */
export const CLIENT_STATUS = {
  PENDING: 'pending', // Pending email verification
  ACTIVE: 'active', // Active - verified and can login
  DISABLED: 'disabled', // Disabled by admin
} as const;

/**
 * Client Management Constants
 */
export const CLIENT_MANAGEMENT = {
  DEFAULT_PASSWORD_LENGTH: 8,
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  PASSWORD_CHARACTERS:
    'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789',
  EMAIL_VERIFICATION: {
    CODE_LENGTH: 6,
    CODE_EXPIRES_IN_MINUTES: 10, // 10 minutes
    RESEND_COOLDOWN: 60, // 60 seconds
    MAX_ATTEMPTS: 5, // Maximum verification attempts
  },
  PASSWORD_VALIDATION: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
} as const;

/**
 * Email Configuration Constants
 */
export const EMAIL_CONFIG = {
  FROM_NAME: process.env.MAIL_FROM_NAME || 'Vian Stats',
  FROM_EMAIL: process.env.MAIL_FROM_EMAIL || 'business@vianstats.com',
  SMTP: {
    HOST: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
    PORT: parseInt(process.env.MAIL_PORT || '2525'),
    SECURE: process.env.MAIL_SECURE === 'true' || false, // true for 465, false for other ports
    AUTH: {
      USER: process.env.MAIL_USERNAME || '75a34aae05fcc8',
      PASS: process.env.MAIL_PASSWORD || 'c9df4002c18456',
    },
  },
  TEMPLATES: {
    EMAIL_VERIFICATION_CODE: 'email-verification-code',
    PASSWORD_SENT: 'password-sent',
    PASSWORD_RESET: 'password-reset',
    WELCOME: 'welcome',
  },
  SUBJECTS: {
    EMAIL_VERIFICATION_CODE: '验证码 - Vian Stats',
    PASSWORD_SENT: '您的登录密码 - Vian Stats',
    PASSWORD_RESET: '重置您的密码',
    WELCOME: '欢迎加入 Vian Stats',
  },
} as const;

/**
 * Permission Constants
 */
export const PERMISSIONS = {
  DASHBOARD: 'dashboard',
  BANNER_MANAGEMENT: 'banner_management',
  INFORMATION_MANAGEMENT: 'information_management',
  CUSTOMER_CASE_MANAGEMENT: 'customer_case_management',
  CORPORATE_HONOR_MANAGEMENT: 'corporate_honor_management',
  DATA_MANAGEMENT: 'data_management',
  LINK_MANAGEMENT: 'link_management',
  PERMISSION_MANAGEMENT: 'permission_management',
  OPERATION_RECORD: 'operation_record',
  RECRUITMENT_MANAGEMENT: 'recruitment_management',
} as const;

/**
 * Permission Status Constants
 */
export const PERMISSION_STATUS = {
  DISABLED: 0,
  ACTIVE: 1,
} as const;

/**
 * Category Types
 */
export const CATEGORY_TYPE = {
  POPULAR_NEWS: 0,
  PRODUCT_SYSTEM: 1,
  SOLUTIONS: 2,
  CASE_STUDIES: 3,
} as const;

/**
 * System Settings Keys
 */
export const SYSTEM_SETTINGS_KEYS = {
  HOMEPAGE_POPULAR_NEWS_VIEW_MORE: 'homepage_popular_news_view_more',
  HOMEPAGE_PRODUCT_SYSTEM_VIEW_MORE: 'homepage_product_system_view_more',
  HOMEPAGE_SOLUTIONS_VIEW_MORE: 'homepage_solutions_view_more',
  HOMEPAGE_CASE_STUDIES_VIEW_MORE: 'homepage_case_studies_view_more',
} as const;

/**
 * Category Type to System Settings Key Mapping
 */
export const CATEGORY_VIEW_MORE_KEYS = {
  [CATEGORY_TYPE.POPULAR_NEWS]:
    SYSTEM_SETTINGS_KEYS.HOMEPAGE_POPULAR_NEWS_VIEW_MORE,
  [CATEGORY_TYPE.PRODUCT_SYSTEM]:
    SYSTEM_SETTINGS_KEYS.HOMEPAGE_PRODUCT_SYSTEM_VIEW_MORE,
  [CATEGORY_TYPE.SOLUTIONS]: SYSTEM_SETTINGS_KEYS.HOMEPAGE_SOLUTIONS_VIEW_MORE,
  [CATEGORY_TYPE.CASE_STUDIES]:
    SYSTEM_SETTINGS_KEYS.HOMEPAGE_CASE_STUDIES_VIEW_MORE,
} as const;

/**
 * Category Status
 */
export const CATEGORY_STATUS = {
  DISABLED: 'disabled',
  ENABLED: 'enabled',
} as const;

/**
 * Banner Status
 */
export const BANNER_STATUS = {
  DISABLED: 0,
  ENABLED: 1,
} as const;

/**
 * Friend Link Status
 */
export const FRIEND_LINK_STATUS = {
  DISABLED: 0,
  ENABLED: 1,
} as const;

/**
 * Post Status Constants
 */
export const POST_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  OFFLINE: 2,
} as const;

/**
 * Latest News Status Constants
 */
export const LATEST_NEWS_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
} as const;

/**
 * Case Study Status Constants
 */
export const CASE_STUDY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
} as const;

/**
 * Product Status Constants
 */
export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
} as const;

/**
 * Solution Status Constants
 */
export const SOLUTION_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
} as const;
/**
 * Product Section Image Position Constants
 */
export const PRODUCT_SECTION_IMAGE_POSITION = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export const SECTION_TYPE = {
  INTRO: 'intro',
  FEATURED_GRID: 'featured_grid',
  ICON_LIST: 'icon_list',
  TAB_CONTENT: 'tab_content',
  SECTION_WITH_SUBTITLE_IMAGE: 'section_with_subtitle_image',
  CARD_LIST: 'card_list',
  IMAGE_TO_TEXT: 'image_to_text',
  FEATURED_LIST_TO_IMAGE: 'featured_list_to_image',
} as const;

/**
 * Customer Cooperation Type Constants
 */
export const CUSTOMER_COOPERATION_TYPE = {
  PRODUCT_SERVICE_PURCHASE: 0, // 产品服务购买
  AGENCY_COOPERATION: 1, // 代理合作
  PERSONAL_CONSULTATION: 2, // 个人咨询
  OTHER_BUSINESS_COOPERATION: 3, // 其他业务合作
} as const;

/**
 * Customer Cooperation Requirements Constants
 */
export const CUSTOMER_COOPERATION_REQUIREMENTS = {
  PURCHASE_EXPLORATION_EQUIPMENT: 0, // 购买自助探索设备
  PLATFORM_GUIDANCE_SERVICE: 1, // 学生发展指导平台
  JOB_FAIR_EVENT: 2, // 生涯游园会服务
  TEACHER_TRAINING_PROGRAM: 3, // 师资队伍培训考证
  REGIONAL_SCREENING: 4, // 区域大规模筛查
  PERSONAL_CAREER_COUNSELING: 5, // 个人生涯教育咨询
  ENTERPRISE_TALENT_DEVELOPMENT: 6, // 企业人才发展服务
  ENTERPRISE_DIGITAL_TRANSFORMATION: 7, // 企业数字化转型
  JOINT_MARKETING_ACTIVITY: 8, // 联合市场营销活动
  OTHER_BUSINESS_CONSULTATION: 9, // 其他业务咨询
} as const;

/**
 * Customer Status Constants
 */
export const CUSTOMER_STATUS = {
  PENDING_FOLLOW_UP: 0,
  REGISTERED: 1,
  UNDER_FOLLOW_UP: 2,
  COOPERATING: 3,
  CANCELLED: 4,
} as const;

/**
 * JWT Configuration
 */
export const JWT_CONFIG = {
  DEFAULT_EXPIRES_IN: '7d',
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  DEFAULT_PORT: 3001,
  API_PREFIX: 'api',
} as const;

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB in bytes
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/x-m4v',
    'video/x-msvideo',
    'video/quicktime',
  ],
  UPLOAD_PATH: 'uploads',
  BANNER_PATH: 'uploads/banners',
  POST_PATH: 'uploads/posts',
  IMAGE_PATH: 'uploads/images',
  VIDEO_PATH: 'uploads/videos',
  HONOR_PATH: 'uploads/honors',
  LATEST_NEWS_PATH: 'uploads/latest-news',
  CASE_STUDIES_PATH: 'uploads/case-studies',
  PRODUCTS_PATH: 'uploads/products',
  SOLUTIONS_PATH: 'uploads/solutions',
  MEDIAS_PATH: 'uploads/medias',
  HOST: 'http://localhost:3001', // Default host, can be overridden by env variable
} as const;

/**
 * Security Configuration
 */
export const SECURITY_CONFIG = {
  BCRYPT_SALT_ROUNDS: 12,
} as const;

/**
 * Hashtag Status Constants
 */
export const HASHTAG_STATUS = {
  DISABLED: 0,
  ACTIVE: 1,
} as const;

/**
 * Hashtag Default Values
 */
export const HASHTAG_DEFAULTS = {
  STATUS: HASHTAG_STATUS.ACTIVE,
} as const;

/**
 * Type helpers for TypeScript
 */
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type PermissionStatus =
  (typeof PERMISSION_STATUS)[keyof typeof PERMISSION_STATUS];
export type BannerStatus = (typeof BANNER_STATUS)[keyof typeof BANNER_STATUS];
export type FriendLinkStatus =
  (typeof FRIEND_LINK_STATUS)[keyof typeof FRIEND_LINK_STATUS];
export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];
export type CustomerCooperationType =
  (typeof CUSTOMER_COOPERATION_TYPE)[keyof typeof CUSTOMER_COOPERATION_TYPE];
export type CustomerStatus =
  (typeof CUSTOMER_STATUS)[keyof typeof CUSTOMER_STATUS];
export type HashtagStatus =
  (typeof HASHTAG_STATUS)[keyof typeof HASHTAG_STATUS];
export type LatestNewsStatus =
  (typeof LATEST_NEWS_STATUS)[keyof typeof LATEST_NEWS_STATUS];
export type CaseStudyStatus =
  (typeof CASE_STUDY_STATUS)[keyof typeof CASE_STUDY_STATUS];
export type SolutionStatus =
  (typeof SOLUTION_STATUS)[keyof typeof SOLUTION_STATUS];

/**
 * Operation Log Constants
 */
export const OPERATION_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export const OPERATION_TYPE = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  PUBLISH: 'publish',
  UNPUBLISH: 'unpublish',
  ENABLE: 'enable',
  DISABLE: 'disable',
} as const;

export const MODULE_TYPE = {
  LATEST_NEWS_POSTS: 'latest_news_posts',
  LATEST_NEWS_CATEGORIES: 'latest_news_categories',
  BANNERS: 'banners',
  CASE_STUDIES_POSTS: 'case_studies_posts',
  CASE_STUDIES_CATEGORIES: 'case_studies_categories',
  PRODUCT_POSTS: 'product_posts',
  PRODUCT_CATEGORIES: 'product_categories',
  SOLUTION_POSTS: 'solution_posts',
  SOLUTION_CATEGORIES: 'solution_categories',
  CORPORATE_HONORS: 'corporate_honors',
  CUSTOMERS: 'customers',
  FRIEND_LINKS: 'friend_links',
  USERS: 'users',
  SYSTEM_SETTINGS: 'system_settings',
} as const;

export const TARGET_TYPE = {
  LATEST_NEW: 'LatestNew',
  POST: 'Post',
  BANNER: 'Banner',
  CATEGORY: 'Category',
  CASE_STUDY: 'CaseStudy',
  CORPORATE_HONOR: 'CorporateHonor',
  CUSTOMER: 'Customer',
  FRIEND_LINK: 'FriendLink',
  USER: 'User',
  SYSTEM_SETTING: 'SystemSetting',
} as const;

/**
 * Operation Log Labels (Chinese)
 */
export const OPERATION_STATUS_LABELS = {
  [OPERATION_STATUS.SUCCESS]: '成功',
  [OPERATION_STATUS.FAILED]: '失败',
} as const;

export const OPERATION_TYPE_LABELS = {
  [OPERATION_TYPE.CREATE]: '创建',
  [OPERATION_TYPE.UPDATE]: '更新',
  [OPERATION_TYPE.DELETE]: '删除',
  [OPERATION_TYPE.PUBLISH]: '发布',
  [OPERATION_TYPE.UNPUBLISH]: '取消发布',
  [OPERATION_TYPE.ENABLE]: '启用',
  [OPERATION_TYPE.DISABLE]: '禁用',
} as const;

export const MODULE_TYPE_LABELS = {
  [MODULE_TYPE.LATEST_NEWS_POSTS]: '资讯文章管理',
  [MODULE_TYPE.LATEST_NEWS_CATEGORIES]: '资讯分类管理',
  [MODULE_TYPE.BANNERS]: 'Banner管理',
  [MODULE_TYPE.CASE_STUDIES_POSTS]: '案例研究管理',
  [MODULE_TYPE.CASE_STUDIES_CATEGORIES]: '案例研究分类管理',
  [MODULE_TYPE.PRODUCT_POSTS]: '产品管理',
  [MODULE_TYPE.PRODUCT_CATEGORIES]: '产品分类管理',
  [MODULE_TYPE.SOLUTION_POSTS]: '解决方案管理',
  [MODULE_TYPE.SOLUTION_CATEGORIES]: '解决方案分类管理',
  [MODULE_TYPE.CORPORATE_HONORS]: '企业荣誉管理',
  [MODULE_TYPE.CUSTOMERS]: '客户数据管理',
  [MODULE_TYPE.FRIEND_LINKS]: '友情链接管理',
  [MODULE_TYPE.USERS]: '用户管理',
  [MODULE_TYPE.SYSTEM_SETTINGS]: '系统设置',
} as const;

/**
 * Operation Log Type helpers
 */
export type OperationStatus =
  (typeof OPERATION_STATUS)[keyof typeof OPERATION_STATUS];
export type OperationType =
  (typeof OPERATION_TYPE)[keyof typeof OPERATION_TYPE];
export type ModuleType = (typeof MODULE_TYPE)[keyof typeof MODULE_TYPE];
export type TargetType = (typeof TARGET_TYPE)[keyof typeof TARGET_TYPE];


export const CUSTOMER_CONFIG = {
  // Customer status
  CUSTOMER_STATUS: {
    0: { label: "待跟进", color: "bg-blue-100 text-blue-800" }, // Pending Follow Up
    1: { label: "已登记", color: "bg-yellow-100 text-yellow-800" }, // Registered
    2: { label: "跟进中", color: "bg-green-100 text-green-800" }, // Under Follow Up
    3: { label: "已合作", color: "bg-red-100 text-red-800" }, // Cooperating
    4: { label: "已取消", color: "bg-red-100 text-red-800" }, // Cancelled
  },

  // Customer status values
  CUSTOMER_STATUS_VALUES: {
    PENDING_FOLLOW_UP: 0,
    REGISTERED: 1,
    UNDER_FOLLOW_UP: 2,
    COOPERATING: 3,
    CANCELLED: 4,
  },

  // Customer status options for form
  CUSTOMER_STATUS_OPTIONS: [
    { value: 0, label: "待跟进" },
    { value: 1, label: "已登记" },
    { value: 2, label: "跟进中" },
    { value: 3, label: "已合作" },
    { value: 4, label: "已取消" },
  ],

  // Cooperation type labels
  COOPERATION_TYPE: {
    0: { label: "产品服务购买", color: "bg-purple-100 text-purple-800" },
    1: { label: "代理合作", color: "bg-blue-100 text-blue-800" },
    2: { label: "个人咨询", color: "bg-green-100 text-green-800" },
    3: { label: "其他业务合作", color: "bg-orange-100 text-orange-800" },
  },

  // Cooperation type values
  COOPERATION_TYPE_VALUES: {
    PRODUCT_SERVICE_PURCHASE: 0,
    AGENCY_COOPERATION: 1,
    PERSONAL_CONSULTATION: 2,
    OTHER: 3,
  },

  // Cooperation type options for form
  COOPERATION_TYPE_OPTIONS: [
    {
      label: "产品服务购买",
      value: 0,
    },
    {
      label: "代理合作",
      value: 1,
    },
    {
      label: "个人咨询",
      value: 2,
    },
    {
      label: "其他业务合作",
      value: 3,
    },
  ],

  // Cooperation requirement labels
  COOPERATION_REQUIREMENT: {
    0: { label: "购买自助探索设备", color: "bg-purple-100 text-purple-800" },
    1: { label: "学生发展指导平台", color: "bg-blue-100 text-blue-800" },
    2: { label: "生涯游园会服务", color: "bg-green-100 text-green-800" },
    3: { label: "师资队伍培训考证", color: "bg-orange-100 text-orange-800" },
    4: { label: "区域大规模筛查", color: "bg-indigo-100 text-indigo-800" },
    5: { label: "个人生涯教育咨询", color: "bg-pink-100 text-pink-800" },
    6: { label: "企业人才发展服务", color: "bg-red-100 text-red-800" },
    7: { label: "企业数字化转型", color: "bg-yellow-100 text-yellow-800" },
    8: { label: "联合市场营销活动", color: "bg-gray-100 text-gray-800" },
    9: { label: "其他业务咨询", color: "bg-cyan-100 text-cyan-800" },
  },

  // Cooperation requirement values
  COOPERATION_REQUIREMENT_VALUES: {
    PURCHASE_EXPLORATION_EQUIPMENT: 0,
    PLATFORM_GUIDANCE_SERVICE: 1,
    JOB_FAIR_EVENT: 2,
    TEACHER_TRAINING_PROGRAM: 3,
    REGIONAL_SCREENING: 4,
    PERSONAL_CAREER_COUNSELING: 5,
    ENTERPRISE_TALENT_DEVELOPMENT: 6,
    ENTERPRISE_DIGITAL_TRANSFORMATION: 7,
    JOINT_MARKETING_ACTIVITY: 8,
    OTHER_BUSINESS_CONSULTATION: 9,
  },

  // Cooperation requirement options for form
  COOPERATION_REQUIREMENT_OPTIONS: [
    { value: 0, label: "购买自助探索设备" },
    { value: 1, label: "学生发展指导平台" },
    { value: 2, label: "生涯游园会服务" },
    { value: 3, label: "师资队伍培训考证" },
    { value: 4, label: "区域大规模筛查" },
    { value: 5, label: "个人生涯教育咨询" },
    { value: 6, label: "企业人才发展服务" },
    { value: 7, label: "企业数字化转型" },
    { value: 8, label: "联合市场营销活动" },
    { value: 9, label: "其他业务咨询" },
  ],

  SUBMIT_SOURCE: {
    0: { label: "桌面", color: "bg-gray-100 text-gray-800" },
    1: { label: "移动", color: "bg-blue-100 text-blue-800" },
    2: { label: "平板", color: "bg-green-100 text-green-800" },
  },
};