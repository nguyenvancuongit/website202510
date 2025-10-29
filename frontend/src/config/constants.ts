// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  STATIC_URL: process.env.NEXT_PUBLIC_STATIC_URL || "http://localhost:3001",
  UPLOADS_PATH: "/uploads",
};

// Helper function to get full image URL
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) { return ""; }
  if (imagePath.startsWith("http")) { return imagePath; }
  return `${API_CONFIG.STATIC_URL}${imagePath}`;
};

// Category type constants
export const CATEGORY_TYPES = {
  0: { label: "热门新闻", color: "bg-purple-100 text-purple-800" }, // Popular News
  1: { label: "产品系统", color: "bg-blue-100 text-blue-800" }, // Product System
  2: { label: "解决方案", color: "bg-green-100 text-green-800" }, // Solutions
  3: { label: "案例研究", color: "bg-orange-100 text-orange-800" }, // Case Studies
};

// Category type values
export const CATEGORY_TYPE_VALUES = {
  POPULAR_NEWS: 0,
  PRODUCT_SYSTEM: 1,
  SOLUTIONS: 2,
  CASE_STUDIES: 3,
};

// Category type options for form select (matching the display order)
export const CATEGORY_TYPE_OPTIONS = [
  { value: 0, label: "热门新闻" }, // Popular News
  { value: 1, label: "产品系统" }, // Product System
  { value: 2, label: "解决方案" }, // Solutions
  { value: 3, label: "案例研究" }, // Case Studies
];

// Category status constants
export const CATEGORY_STATUS = {
  0: { label: "禁用", color: "bg-red-100 text-red-800" }, // Disabled
  1: { label: "启用", color: "bg-green-100 text-green-800" }, // Enabled
};

// General status constants (reusable for banners, categories, etc.)
export const STATUS_LABELS = {
  0: "禁用", // Disabled
  1: "启用", // Enabled
};

// Product status constants (using string enum like backend)
export const PRODUCT_STATUS_OPTIONS = [
  { value: "draft", label: "草稿" },
  { value: "published", label: "已发布" },
  { value: "unpublished", label: "已下线" },
]

// Product section image position constants
export const PRODUCT_SECTION_IMAGE_POSITIONS = {
  TOP: "top",
  LEFT: "left",
  RIGHT: "right",
  BOTTOM: "bottom",
} as const;

export const PRODUCT_SECTION_IMAGE_POSITION_OPTIONS = [
  { value: "top", label: "顶部" },
  { value: "left", label: "左侧" },
  { value: "bottom", label: "底部" },
  { value: "right", label: "右侧" },
];

export const SECTION_TYPE = {
  INTRO: "intro",
  FEATURED_GRID: "featured_grid",
  ICON_LIST: "icon_list",
  TAB_CONTENT: "tab_content",
  SECTION_WITH_SUBTITLE_IMAGE: "section_with_subtitle_image",
  CARD_LIST: "card_list",
  IMAGE_TO_TEXT: "image_to_text",
  FEATURED_LIST_TO_IMAGE: "featured_list_to_image",
} as const;

export const SECTION_TYPE_CONFIG = {
  [SECTION_TYPE.INTRO]: {
    label: "介绍区域",
    description: "产品介绍区域，展示核心特点和价值主张",
    hasSubItems: false,
    icon: "📋",
    previewColor: "bg-green-50 border-green-200",
    fields: ["title", "description", "sectionImage"] as const,
  },
  [SECTION_TYPE.FEATURED_GRID]: {
    label: "特色网格",
    description: "网格布局展示核心优势，每个项目包含图标、标题和描述",
    hasSubItems: true,
    icon: "🔳",
    previewColor: "bg-purple-50 border-purple-200",
    fields: ["title", "description"] as const,
    subItemFields: ["title", "description", "subItemImage"] as const,
  },
  [SECTION_TYPE.ICON_LIST]: {
    label: "图标列表",
    description: "图标列表展示，适合展示合作伙伴、技术栈等",
    hasSubItems: true,
    icon: "📱",
    previewColor: "bg-orange-50 border-orange-200",
    fields: ["title", "description"] as const,
    subItemFields: ["title", "subItemImage"] as const,
  },
  [SECTION_TYPE.TAB_CONTENT]: {
    label: "标签内容",
    description: "标签切换内容区域，支持多个标签页展示不同内容",
    hasSubItems: true,
    icon: "📂",
    previewColor: "bg-indigo-50 border-indigo-200",
    fields: [] as const,
    subItemFields: ["title", "description", "ctaText", "ctaIcon", "subItemImage"] as const,
  },
  [SECTION_TYPE.SECTION_WITH_SUBTITLE_IMAGE]: {
    label: "图文并茂",
    description: "带副标题的图文展示区域，左右布局",
    hasSubItems: false,
    icon: "🖼️",
    previewColor: "bg-cyan-50 border-cyan-200",
    fields: ["title", "description", "sectionImage", "sectionImageTitle", "sectionImageDescription"] as const,
  },
  [SECTION_TYPE.CARD_LIST]: {
    label: "卡片列表",
    description: "卡片式列表展示，适合案例展示",
    hasSubItems: true,
    icon: "🃏",
    previewColor: "bg-pink-50 border-pink-200",
    fields: ["title", "description", "ctaText", "ctaLink"] as const,
    subItemFields: ["title", "description", "subItemImage"] as const,
  },
  [SECTION_TYPE.IMAGE_TO_TEXT]: {
    label: "图片转文字",
    description: "左侧图片，右侧文字说明的布局",
    hasSubItems: false,
    icon: "🖼️",
    previewColor: "bg-yellow-50 border-yellow-200",
    fields: ["title", "description", "sectionImage"] as const,
  },
  [SECTION_TYPE.FEATURED_LIST_TO_IMAGE]: {
    label: "特色列表配图",
    description: "左侧特色列表，右侧配套图片展示",
    hasSubItems: true,
    icon: "📝",
    previewColor: "bg-emerald-50 border-emerald-200",
    fields: ["title", "description", "sectionImage"] as const,
    subItemFields: ["title", "description"] as const,
  },
} as const;

export const SECTION_TYPE_OPTIONS = [
  { value: SECTION_TYPE.INTRO, label: SECTION_TYPE_CONFIG[SECTION_TYPE.INTRO].label },
  { value: SECTION_TYPE.FEATURED_GRID, label: SECTION_TYPE_CONFIG[SECTION_TYPE.FEATURED_GRID].label },
  { value: SECTION_TYPE.ICON_LIST, label: SECTION_TYPE_CONFIG[SECTION_TYPE.ICON_LIST].label },
  { value: SECTION_TYPE.TAB_CONTENT, label: SECTION_TYPE_CONFIG[SECTION_TYPE.TAB_CONTENT].label },
  { value: SECTION_TYPE.SECTION_WITH_SUBTITLE_IMAGE, label: SECTION_TYPE_CONFIG[SECTION_TYPE.SECTION_WITH_SUBTITLE_IMAGE].label },
  { value: SECTION_TYPE.CARD_LIST, label: SECTION_TYPE_CONFIG[SECTION_TYPE.CARD_LIST].label },
  { value: SECTION_TYPE.IMAGE_TO_TEXT, label: SECTION_TYPE_CONFIG[SECTION_TYPE.IMAGE_TO_TEXT].label },
  { value: SECTION_TYPE.FEATURED_LIST_TO_IMAGE, label: SECTION_TYPE_CONFIG[SECTION_TYPE.FEATURED_LIST_TO_IMAGE].label },
];

// Status values - use these constants instead of hardcoded numbers
export const STATUS_VALUES = {
  DISABLED: 0,
  ENABLED: 1,
};

// Blog Configuration
export const POST_CONFIG = {
  // Maximum featured posts per category on homepage
  MAX_FEATURED_POSTS: {
    0: 3, // Popular News
    1: 3, // Product System
    2: 6, // Solutions
    3: 4, // Case Studies
  },

  // Pagination
  DEFAULT_PAGE_SIZE: 10,

  // Content limits
  CONTENT_LIMITS: {
    TITLE_MAX_LENGTH: 255,
    SLUG_MAX_LENGTH: 255,
    EXCERPT_MAX_LENGTH: 500,
    CONTENT_MIN_LENGTH: 100,
  },

  // Image settings
  IMAGE_SETTINGS: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
    THUMBNAIL_DIMENSIONS: { width: 800, height: 450 },
  },

  // Category section labels for tabs
  CATEGORY_SECTIONS: [
    {
      type: 0,
      name: "热门新闻",
      icon: "📰",
      description: "最新的行业动态和热门资讯",
      maxFeatured: 3,
      slug: "popular-news",
      href: "/posts/popular-news",
    },
    {
      type: 1,
      name: "产品系统",
      icon: "🏭",
      description: "公司产品介绍和系统解决方案",
      maxFeatured: 3,
      slug: "product-system",
      href: "/posts/product-system",
    },
    {
      type: 2,
      name: "解决方案",
      icon: "💡",
      description: "针对不同行业的专业解决方案",
      maxFeatured: 6,
      slug: "solutions",
      href: "/posts/solutions",
    },
    {
      type: 3,
      name: "案例研究",
      icon: "📊",
      description: "成功案例分析和客户见证",
      maxFeatured: 4,
      slug: "case-studies",
      href: "/posts/case-studies",
    },
  ],

  // Editor settings for rich text editor
  EDITOR_CONFIG: {
    TOOLBAR_OPTIONS: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
      ["link", "image", "video"],
    ],
    FORMATS: [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "video",
      "color",
      "background",
      "align",
    ],
  },
};

// Export specific sections for easier access
export const CATEGORY_SECTIONS = POST_CONFIG.CATEGORY_SECTIONS;

// Customer Configuration
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

  // Submit source labels
  SUBMIT_SOURCE: {
    0: { label: "桌面", color: "bg-gray-100 text-gray-800" },
    1: { label: "移动", color: "bg-blue-100 text-blue-800" },
    2: { label: "平板", color: "bg-green-100 text-green-800" },
  },

  // Submit source values
  SUBMIT_SOURCE_VALUES: {
    DESKTOP: 0,
    MOBILE: 1,
    TABLET: 2,
  },

  // Submit source options for form
  SUBMIT_SOURCE_OPTIONS: [
    { value: 0, label: "桌面" },
    { value: 1, label: "移动" },
    { value: 2, label: "平板" },
  ],

  // Status transition rules
  STATUS_TRANSITIONS: {
    0: [0, 1, 2, 3, 4],
    1: [0, 1, 2, 3, 4],
    2: [0, 1, 2, 3, 4],
    3: [0, 1, 2, 3, 4],
    4: [] as number[], // CANCELLED cannot change status
  } as Record<number, number[]>,

  // Pagination settings
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // Date range presets
  DATE_RANGE_PRESETS: [
    {
      key: "last_1_day",
      label: "过去1天",
      value: "1d",
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0); // Start of day
        end.setHours(23, 59, 59, 999); // End of day
        return { start, end };
      },
    },
    {
      key: "last_7_days",
      label: "过去7天",
      value: "7d",
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0); // Start of day 7 days ago
        end.setHours(23, 59, 59, 999); // End of today
        return { start, end };
      },
    },
    {
      key: "last_1_month",
      label: "过去1个月",
      value: "1m",
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 1);
        start.setHours(0, 0, 0, 0); // Start of day 1 month ago
        end.setHours(23, 59, 59, 999); // End of today
        return { start, end };
      },
    },
    {
      key: "today",
      label: "今天",
      value: "today",
      getDates: () => {
        const start = new Date();
        const end = new Date();
        start.setHours(0, 0, 0, 0); // Start of today
        end.setHours(23, 59, 59, 999); // End of today
        return { start, end };
      },
    },
    {
      key: "custom",
      label: "自定义",
      value: "custom",
      getDates: () => null, // User will select custom dates
    },
  ],
};

// Export specific customer sections for easier access
export const CUSTOMER_STATUS = CUSTOMER_CONFIG.CUSTOMER_STATUS;
export const CUSTOMER_STATUS_VALUES = CUSTOMER_CONFIG.CUSTOMER_STATUS_VALUES;
export const COOPERATION_TYPE = CUSTOMER_CONFIG.COOPERATION_TYPE;
export const COOPERATION_TYPE_VALUES = CUSTOMER_CONFIG.COOPERATION_TYPE_VALUES;
export const COOPERATION_REQUIREMENT = CUSTOMER_CONFIG.COOPERATION_REQUIREMENT;
export const COOPERATION_REQUIREMENT_VALUES =
  CUSTOMER_CONFIG.COOPERATION_REQUIREMENT_VALUES;
export const SUBMIT_SOURCE = CUSTOMER_CONFIG.SUBMIT_SOURCE;
export const SUBMIT_SOURCE_VALUES = CUSTOMER_CONFIG.SUBMIT_SOURCE_VALUES;

// Hashtag Configuration
export const HASHTAG_CONFIG = {
  // Hashtag status
  HASHTAG_STATUS: {
    0: { label: "禁用", color: "bg-red-100 text-red-800" }, // Disabled
    1: { label: "启用", color: "bg-green-100 text-green-800" }, // Active
  },

  // Hashtag status values
  HASHTAG_STATUS_VALUES: {
    DISABLED: 0,
    ACTIVE: 1,
  },

  // Hashtag status options for form
  HASHTAG_STATUS_OPTIONS: [
    { value: 1, label: "启用" },
    { value: 0, label: "禁用" },
  ],

  // Pagination settings
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // Date range presets (reuse customer presets)
  DATE_RANGE_PRESETS: CUSTOMER_CONFIG.DATE_RANGE_PRESETS,

  // Validation rules
  VALIDATION: {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100,
    NAME_PATTERN: /^[a-zA-Z0-9\u4e00-\u9fff_-]+$/, // Letters, numbers, Chinese characters, underscore, hyphen
  },
};

// Export specific hashtag sections for easier access
export const HASHTAG_STATUS = HASHTAG_CONFIG.HASHTAG_STATUS;
export const HASHTAG_STATUS_VALUES = HASHTAG_CONFIG.HASHTAG_STATUS_VALUES;

// Banner Configuration
export const BANNER_CONFIG = {
  // Active banners display configuration
  ACTIVE_SECTION: {
    MAX_ITEMS: 8,
    EMPTY_SLOT_TEXT: "暂无横幅",
    GRID_COLS: 1, // 1 column - each banner on its own row
    GRID_ROWS: 8, // 8 rows
    ITEM_HEIGHT: "h-16", // Smaller height for better fit when stacked vertically
  },

  // Banner status
  BANNER_STATUS: {
    0: { label: "禁用", color: "bg-red-100 text-red-800" }, // Disabled
    1: { label: "启用", color: "bg-green-100 text-green-800" }, // Enabled
  },

  // Banner status values
  BANNER_STATUS_VALUES: {
    DISABLED: 0,
    ENABLED: 1,
  },

  // Pagination settings
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // Sort options
  SORT_OPTIONS: [
    { value: "created_at", label: "创建时间" },
    { value: "updated_at", label: "更新时间" },
    { value: "title", label: "标题" },
    { value: "sort_order", label: "排序" },
    { value: "status", label: "状态" },
  ],
};

// Export specific banner sections for easier access
export const BANNER_STATUS = BANNER_CONFIG.BANNER_STATUS;
export const BANNER_STATUS_VALUES = BANNER_CONFIG.BANNER_STATUS_VALUES;

// Category Configuration
export const CATEGORY_CONFIG = {
  // Category status
  CATEGORY_STATUS: {
    0: { label: "禁用", color: "bg-red-100 text-red-800" }, // Disabled
    1: { label: "启用", color: "bg-green-100 text-green-800" }, // Enabled
  },

  // Category status values
  CATEGORY_STATUS_VALUES: {
    DISABLED: 0,
    ENABLED: 1,
  },

  // Category status options for form
  CATEGORY_STATUS_OPTIONS: [
    { value: 0, label: "禁用" },
    { value: 1, label: "启用" },
  ],

  // Category type labels
  CATEGORY_TYPE: {
    0: { label: "热门新闻", color: "bg-blue-100 text-blue-800" },
    1: { label: "产品体系", color: "bg-purple-100 text-purple-800" },
    2: { label: "解决方案", color: "bg-green-100 text-green-800" },
    3: { label: "案例分享", color: "bg-orange-100 text-orange-800" },
  },

  // Category type values
  CATEGORY_TYPE_VALUES: {
    POPULAR_NEWS: 0,
    PRODUCT_SYSTEM: 1,
    SOLUTIONS: 2,
    CASE_STUDIES: 3,
  },

  // Category type options for form
  CATEGORY_TYPE_OPTIONS: [
    { value: 0, label: "热门新闻" },
    { value: 1, label: "产品体系" },
    { value: 2, label: "解决方案" },
    { value: 3, label: "案例分享" },
  ],

  // Pagination settings
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // Sort options
  SORT_OPTIONS: [
    { value: "created_at", label: "创建时间" },
    { value: "updated_at", label: "更新时间" },
    { value: "name", label: "分类名称" },
    { value: "type", label: "分类类型" },
    { value: "status", label: "状态" },
  ],
};

// System setting keys
export const SYSTEM_SETTING_KEYS = {
  VIEW_MORE_BUTTONS: {
    POPULAR_NEWS: "homepage_popular_news_view_more",
    PRODUCT_SYSTEM: "homepage_product_system_view_more",
    SOLUTIONS: "homepage_solutions_view_more",
    CASE_STUDIES: "homepage_case_studies_view_more",
  },
  MAX_FEATURED_POSTS: {
    POPULAR_NEWS: "max_featured_posts_popular_news",
    PRODUCT_SYSTEM: "max_featured_posts_product_system",
    SOLUTIONS: "max_featured_posts_solutions",
    CASE_STUDIES: "max_featured_posts_case_studies",
  },
};

// Permission Constants (matching backend PERMISSIONS)
export const PERMISSIONS = {
  DASHBOARD: "dashboard",
  BANNER_MANAGEMENT: "banner_management",
  INFORMATION_MANAGEMENT: "information_management",
  CUSTOMER_CASE_MANAGEMENT: "customer_case_management",
  CORPORATE_HONOR_MANAGEMENT: "corporate_honor_management",
  DATA_MANAGEMENT: "data_management",
  LINK_MANAGEMENT: "link_management",
  PERMISSION_MANAGEMENT: "permission_management",
  OPERATION_RECORD: "operation_record",
  RECRUITMENT_MANAGEMENT: "recruitment_management",
} as const;

// Permission Labels (Chinese display names)
export const PERMISSION_LABELS = {
  [PERMISSIONS.DASHBOARD]: "仪表板",
  [PERMISSIONS.BANNER_MANAGEMENT]: "Banner管理",
  [PERMISSIONS.INFORMATION_MANAGEMENT]: "资讯管理",
  [PERMISSIONS.CUSTOMER_CASE_MANAGEMENT]: "客户案例管理",
  [PERMISSIONS.CORPORATE_HONOR_MANAGEMENT]: "企业荣誉管理",
  [PERMISSIONS.DATA_MANAGEMENT]: "数据管理",
  [PERMISSIONS.LINK_MANAGEMENT]: "链接管理",
  [PERMISSIONS.PERMISSION_MANAGEMENT]: "权限管理",
  [PERMISSIONS.OPERATION_RECORD]: "操作记录",
  [PERMISSIONS.RECRUITMENT_MANAGEMENT]: "招聘管理",
} as const;

// Permission Status Constants
export const PERMISSION_STATUS = {
  DISABLED: 0,
  ACTIVE: 1,
} as const;

// User Management Constants
export const USER_MANAGEMENT = {
  STATUS: {
    ACTIVE: "active",
    DISABLED: "disabled",
  },
  STATUS_LABELS: {
    active: "正常",
    disabled: "禁用",
  },
  STATUS_OPTIONS: [
    { value: "active", label: "正常" },
    { value: "disabled", label: "禁用" },
  ],
  FILTER_STATUS_OPTIONS: [
    { value: "all", label: "全部" },
    { value: "active", label: "激活" },
    { value: "disabled", label: "禁用" },
  ],
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },
} as const;

// Client Management Constants
export const CLIENT_MANAGEMENT = {
  STATUS: {
    PENDING: "pending", // Pending email verification
    ACTIVE: "active", // Active - verified and can login
    DISABLED: "disabled", // Disabled by admin
  },
  STATUS_LABELS: {
    pending: "待验证",
    active: "正常",
    disabled: "禁用",
  },
  STATUS_OPTIONS: [
    { value: "pending", label: "待验证" },
    { value: "active", label: "正常" },
    { value: "disabled", label: "禁用" },
  ],
  FILTER_STATUS_OPTIONS: [
    { value: "all", label: "全部" },
    { value: "pending", label: "待验证" },
    { value: "active", label: "正常" },
    { value: "disabled", label: "禁用" },
  ],
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },
  // Email verification settings
  EMAIL_VERIFICATION: {
    CODE_LENGTH: 6,
    CODE_EXPIRES_IN_MINUTES: 10, // 10 minutes
    RESEND_COOLDOWN: 60, // 60 seconds
    MAX_ATTEMPTS: 5, // Maximum verification attempts
  },
  // Password validation
  PASSWORD: {
    MIN_LENGTH: 8,
    ERROR_MESSAGE: "密码长度至少为8位",
  },
  // Verification code validation
  VERIFICATION_CODE: {
    LENGTH: 6,
    PATTERN: /^\d{6}$/,
    ERROR_MESSAGE: "验证码必须是6位数字",
  },
} as const;

// Operation Logs Constants
export const OPERATION_LOGS = {
  // Operation types
  OPERATION_TYPE: {
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    PUBLISH: "publish",
    UNPUBLISH: "unpublish",
    ENABLE: "enable",
    DISABLE: "disable",
  },

  // Operation type labels
  OPERATION_TYPE_LABELS: {
    create: "创建",
    update: "更新",
    delete: "删除",
    publish: "发布",
    unpublish: "取消发布",
    enable: "启用",
    disable: "禁用",
  },

  // Operation type options for filter
  OPERATION_TYPE_OPTIONS: [
    { value: "all", label: "全部操作" },
    { value: "create", label: "创建" },
    { value: "update", label: "更新" },
    { value: "delete", label: "删除" },
    { value: "publish", label: "发布" },
    { value: "unpublish", label: "取消发布" },
    { value: "enable", label: "启用" },
    { value: "disable", label: "禁用" },
  ],

  // Module types
  MODULE_TYPE: {
    LATEST_NEWS_POSTS: "latest_news_posts",
    LATEST_NEWS_CATEGORIES: "latest_news_categories",
    BANNERS: "banners",
    CASE_STUDIES_POSTS: "case_studies_posts",
    CASE_STUDIES_CATEGORIES: "case_studies_categories",
    CORPORATE_HONORS: "corporate_honors",
    CUSTOMERS: "customers",
    FRIEND_LINKS: "friend_links",
    USERS: "users",
    SYSTEM_SETTINGS: "system_settings",
  },

  // Module type labels
  MODULE_TYPE_LABELS: {
    latest_news_posts: "资讯文章管理",
    latest_news_categories: "分类管理",
    banners: "Banner管理",
    case_studies_posts: "案例研究管理",
    case_studies_categories: "案例研究分类管理",
    corporate_honors: "企业荣誉管理",
    customers: "客户数据管理",
    friend_links: "友情链接管理",
    users: "用户管理",
    system_settings: "系统设置",
  },

  // Module type options for filter
  MODULE_TYPE_OPTIONS: [
    { value: "all", label: "全部模块" },
    { value: "latest_news_posts", label: "资讯文章管理" },
    { value: "latest_news_categories", label: "分类管理" },
    { value: "banners", label: "Banner管理" },
    { value: "case_studies_posts", label: "案例研究管理" },
    { value: "case_studies_categories", label: "案例研究分类管理" },
    { value: "corporate_honors", label: "企业荣誉管理" },
    { value: "customers", label: "客户数据管理" },
    { value: "friend_links", label: "友情链接管理" },
    { value: "users", label: "用户管理" },
    { value: "system_settings", label: "系统设置" },
  ],

  // Operation status
  STATUS: {
    SUCCESS: "success",
    FAILED: "failed",
  },

  // Operation status labels
  STATUS_LABELS: {
    success: "成功",
    failed: "失败",
  },

  // Operation status with colors
  STATUS_CONFIG: {
    success: { label: "成功", color: "bg-green-100 text-green-800" },
    failed: { label: "失败", color: "bg-red-100 text-red-800" },
  },

  // Operation status options for filter
  STATUS_OPTIONS: [
    { value: "all", label: "全部状态" },
    { value: "success", label: "成功" },
    { value: "failed", label: "失败" },
  ],

  // Pagination settings
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // Sort options
  SORT_OPTIONS: [
    { value: "created_at", label: "操作时间" },
    { value: "user_name", label: "用户名称" },
    { value: "module", label: "系统模块" },
    { value: "operation_type", label: "操作类型" },
    { value: "status", label: "操作结果" },
  ],

  // Sort order options
  SORT_ORDER_OPTIONS: [
    { value: "desc", label: "降序" },
    { value: "asc", label: "升序" },
  ],

  // Date range presets (reuse customer presets)
  DATE_RANGE_PRESETS: CUSTOMER_CONFIG.DATE_RANGE_PRESETS,

  // Table columns configuration
  TABLE_COLUMNS: [
    { key: "operationDesc", label: "操作内容", sortable: false },
    { key: "module", label: "系统模块", sortable: true },
    { key: "userName", label: "用户名称", sortable: true },
    { key: "phoneNumber", label: "手机号", sortable: false },
    { key: "status", label: "操作结果", sortable: true },
    { key: "createdAt", label: "操作时间", sortable: true },
  ],

  // Export configuration
  EXPORT: {
    MAX_RECORDS: 10000,
    FILENAME_PREFIX: "operation_logs_",
    DATE_FORMAT: "YYYY-MM-DD_HH-mm-ss",
  },

  // Search configuration
  SEARCH: {
    PLACEHOLDER: "搜索用户名或手机号...",
    MIN_LENGTH: 2,
  },
} as const;

// Export specific operation logs sections for easier access
export const OPERATION_TYPE_LABELS = OPERATION_LOGS.OPERATION_TYPE_LABELS;
export const MODULE_TYPE_LABELS = OPERATION_LOGS.MODULE_TYPE_LABELS;
export const OPERATION_STATUS_CONFIG = OPERATION_LOGS.STATUS_CONFIG;
