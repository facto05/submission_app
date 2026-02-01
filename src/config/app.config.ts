/**
 * App configuration file
 */

export const AppConfig = {
  // API Configuration
  api: {
    baseURL: __DEV__ ? 'http://localhost:3000/api' : 'https://api.example.com',
    timeout: 30000,
  },

  // Feature Flags
  features: {
    enableAnalytics: !__DEV__,
    enableErrorReporting: !__DEV__,
    enableDebugMenu: __DEV__,
  },

  // App Information
  app: {
    name: 'SubmissionApp',
    version: '0.0.1',
    buildNumber: 1,
  },

  // Storage Configuration
  storage: {
    usersCacheKey: 'users_cache',
    cacheExpirationMs: 5 * 60 * 1000, // 5 minutes
  },
};
