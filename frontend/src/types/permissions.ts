// Permission enum matching backend exactly
export enum Permission {
  MANAGE_CASE_STUDIES = "manage_case_studies",
  MANAGE_LATEST_NEWS = "manage_latest_news",
  MANAGE_BANNERS = "manage_banners",
  MANAGE_RECRUITMENTS = "manage_recruitments",
  MANAGE_USERS = "manage_users",
  MANAGE_PERMISSIONS = "manage_permissions",
  MANAGE_FRIENDLY_LINKS = "manage_friendly_links",
  MANAGE_OPERATION_LOGS = "manage_operation_logs",
  MANAGE_CORPORATE_HONORS = "manage_corporate_honors",
  MANAGE_DATA = "manage_data",
  MANAGE_SYSTEM_SETTINGS = "manage_system_settings",
}

export type PermissionType = `${Permission}`;
