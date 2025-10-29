export enum Permission {
  MANAGE_CASE_STUDIES = 'manage_case_studies',
  MANAGE_LATEST_NEWS = 'manage_latest_news',
  MANAGE_BANNERS = 'manage_banners',
  MANAGE_RECRUITMENTS = 'manage_recruitments',
  MANAGE_USERS = 'manage_users',
  MANAGE_PERMISSIONS = 'manage_permissions',
  MANAGE_FRIENDLY_LINKS = 'manage_friendly_links',
  MANAGE_OPERATION_LOGS = 'manage_operation_logs',
  MANAGE_CORPORATE_HONORS = 'manage_corporate_honors',
  MANAGE_DATA = 'manage_data',
  MANAGE_SYSTEM_SETTINGS = 'manage_system_settings',
}

export const PERMISSION_LABELS: Record<Permission, string> = {
  [Permission.MANAGE_CASE_STUDIES]: '客户案例管理',
  [Permission.MANAGE_LATEST_NEWS]: '资讯管理',
  [Permission.MANAGE_BANNERS]: 'Banner管理',
  [Permission.MANAGE_RECRUITMENTS]: '招聘管理',
  [Permission.MANAGE_USERS]: '用户管理',
  [Permission.MANAGE_PERMISSIONS]: '权限管理',
  [Permission.MANAGE_FRIENDLY_LINKS]: '链接管理',
  [Permission.MANAGE_OPERATION_LOGS]: '操作记录',
  [Permission.MANAGE_CORPORATE_HONORS]: '企业荣誉管理',
  [Permission.MANAGE_DATA]: '数据管理',
  [Permission.MANAGE_SYSTEM_SETTINGS]: '系统设置',
};

export const PERMISSIONS = [
  {
    name: PERMISSION_LABELS.manage_banners,
    value: Permission.MANAGE_BANNERS,
  },
  {
    name: PERMISSION_LABELS.manage_latest_news,
    value: Permission.MANAGE_LATEST_NEWS,
  },
  {
    name: PERMISSION_LABELS.manage_case_studies,
    value: Permission.MANAGE_CASE_STUDIES,
  },
  {
    name: PERMISSION_LABELS.manage_corporate_honors,
    value: Permission.MANAGE_CORPORATE_HONORS,
  },
  {
    name: PERMISSION_LABELS.manage_data,
    value: Permission.MANAGE_DATA,
  },
  {
    name: PERMISSION_LABELS.manage_friendly_links,
    value: Permission.MANAGE_FRIENDLY_LINKS,
  },
  {
    name: PERMISSION_LABELS.manage_users,
    value: Permission.MANAGE_USERS,
  },
  {
    name: PERMISSION_LABELS.manage_permissions,
    value: Permission.MANAGE_PERMISSIONS,
  },
  {
    name: PERMISSION_LABELS.manage_operation_logs,
    value: Permission.MANAGE_OPERATION_LOGS,
  },
  {
    name: PERMISSION_LABELS.manage_recruitments,
    value: Permission.MANAGE_RECRUITMENTS,
  },
  {
    name: PERMISSION_LABELS.manage_system_settings,
    value: Permission.MANAGE_SYSTEM_SETTINGS,
  },
];
