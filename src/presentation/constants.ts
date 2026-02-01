/**
 * Presentation Constants
 * Constants used across presentation layer
 */

export const PRESENTATION_SCREEN_NAMES = {
  LOGIN: 'Login',
  HOME: 'Home',
  PROFILE: 'Profile',
  SPLASH: 'Splash',
} as const;

export const PRESENTATION_ERROR_MESSAGES = {
  VALIDATION: 'Please fill in all required fields',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  LOGIN_FAILED: 'Login failed. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

export const PRESENTATION_SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logout successful',
  UPDATE: 'Updated successfully',
} as const;

export const PRESENTATION_ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;
