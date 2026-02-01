/**
 * Application-wide Constants
 * Centralized configuration and constants
 */

// ============================================================================
// API Configuration
// ============================================================================
export const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    SEARCH: '/users/search',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
  },
} as const;

// ============================================================================
// Storage Keys
// ============================================================================
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@app_access_token',
  REFRESH_TOKEN: '@app_refresh_token',
  USER_DATA: '@app_user_data',
  THEME: '@app_theme',
  AUTH_STATE: '@app_auth_state',
} as const;

// ============================================================================
// Error Messages
// ============================================================================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
  HTTP_ERROR: 'Server error. Please try again later.',
  INVALID_REFRESH_TOKEN: 'Session expired. Please login again.',
} as const;

// ============================================================================
// Validation Rules
// ============================================================================
export const VALIDATION = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_LENGTH: 5,
    MAX_LENGTH: 255,
    ERROR_MESSAGE: 'Please enter a valid email address.',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 255,
    ERROR_MESSAGE: 'Password must be at least 6 characters.',
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    ERROR_MESSAGE: 'Name must be between 2 and 100 characters.',
  },
} as const;

// ============================================================================
// UI Timings
// ============================================================================
export const UI_TIMINGS = {
  ANIMATION_DURATION: 300, // milliseconds
  TRANSITION_DURATION: 500, // milliseconds
  DEBOUNCE_DELAY: 300, // milliseconds
  TOAST_DURATION: 3000, // milliseconds
  LONG_PRESS_DURATION: 500, // milliseconds
} as const;

// ============================================================================
// Pagination
// ============================================================================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// ============================================================================
// Feature Flags
// ============================================================================
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_ANALYTICS: false,
  ENABLE_CRASH_REPORTING: false,
} as const;

// ============================================================================
// Logging
// ============================================================================
export const LOGGING = {
  ENABLE_CONSOLE_LOG: __DEV__,
  ENABLE_NETWORK_LOG: __DEV__,
  ENABLE_REDUX_LOG: __DEV__,
} as const;


export default {
  API_CONFIG,
  API_ENDPOINTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  VALIDATION,
  UI_TIMINGS,
  PAGINATION,
  FEATURE_FLAGS,
  LOGGING,
};
