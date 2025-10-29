// src/common/config/index.ts

// Export all constants
export * from './constants';

// Export app configuration
export * from './app.config';

// Re-export for easier imports
export {
  USER_STATUS,
  CLIENT_STATUS,
  BANNER_STATUS,
  FRIEND_LINK_STATUS,
  CLIENT_MANAGEMENT,
  EMAIL_CONFIG,
} from './constants';
export { appConfig, AppConfig } from './app.config';
