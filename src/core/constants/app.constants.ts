/**
 * Application-wide constants
 */

export const APP_CONFIG = {
  APP_NAME: 'SubmissionApp',
  VERSION: '0.0.1',
  ENVIRONMENT: __DEV__ ? 'development' : 'production',
};

export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000' : 'https://api.example.com',
  TIMEOUT: 30000,
};

export const STORAGE_KEYS = {
  USER: 'user',
  AUTH_TOKEN: 'auth_token',
  PREFERENCES: 'preferences',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
};
