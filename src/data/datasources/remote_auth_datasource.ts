/**
 * Remote data source for Authentication API calls
 * Uses secure HTTP client with automatic token injection
 */

import axios from 'axios';
import { Result } from '../../core/types';
import { failureResult, successResult } from '../../core/utils';
import { createHttpClient, HttpClient } from '../../core/utils/network_client';
import { AuthCredentials, UserAuthEntity } from '../../domain/entities/auth';
import { logger } from '../../core/utils/logger';
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS } from '../../config/constants';

export interface RemoteAuthDataSourceInterface {
  login(credentials: AuthCredentials): Promise<Result<UserAuthEntity>>;
  logout(): Promise<Result<void>>;
  refreshToken(token: string): Promise<Result<UserAuthEntity>>;
}

export class RemoteAuthDataSource implements RemoteAuthDataSourceInterface {
  private httpClient: HttpClient;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.httpClient = createHttpClient(baseURL, API_CONFIG.TIMEOUT);
  }

  async login(credentials: AuthCredentials): Promise<Result<UserAuthEntity>> {
    try {
      logger.debug('Attempting login with dummyjson.com');

      // dummyjson.com expects username and password (not email)
      const response = await this.httpClient.post<any>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          username: credentials.email.split('@')[0], // Extract username from email
          password: credentials.password,
          expiresInMins: 60,
        },
        { includeToken: false } // Don't include token for login
      );

      if (response.status !== 200) {
        const errorMessage = (response.data as any)?.message || 'Login failed';
        logger.error('Login failed', { status: response.status });
        return failureResult(errorMessage, 'LOGIN_ERROR');
      }

      if (!response.data) {
        return failureResult('Invalid login response', 'LOGIN_ERROR');
      }

      // Map dummyjson response to UserAuthEntity
      const mappedData: UserAuthEntity = {
        id: response.data.id?.toString() || '',
        email: response.data.email || '',
        name: (response.data.firstName || '') + ' ' + (response.data.lastName || ''),
        username: response.data.username,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        gender: response.data.gender,
        image: response.data.image,
        token: {
          accessToken: response.data.accessToken || '',
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
        },
      };

      logger.info('Login successful');
      return successResult(mappedData);
    } catch (error) {
      logger.error('Login request failed', error);

      // Check if error is an Axios error with response
      if (axios.isAxiosError(error)) {
        // Handle specific HTTP error status codes
        if (error.response?.status === 400 || error.response?.status === 401) {
          const errorMessage =
            (error.response?.data as any)?.message ||
            'Invalid email or password';
          logger.error('Authentication failed', {
            status: error.response.status,
            message: errorMessage,
          });
          return failureResult(errorMessage, 'INVALID_CREDENTIALS');
        }

        // Handle other HTTP errors
        const errorMessage =
          (error.response?.data as any)?.message ||
          error.message ||
          'Login failed';
        logger.error('HTTP error during login', { status: error.response?.status });
        return failureResult(errorMessage, 'HTTP_ERROR');
      }

      // Handle network errors (timeout, connection refused, etc.)
      const isNetworkError =
        error instanceof Error &&
        (error.message.includes('Network') ||
          error.message.includes('timeout') ||
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ENOTFOUND'));

      if (isNetworkError) {
        logger.error('Network error during login');
        return failureResult(
          'Network connection error. Please check your internet connection.',
          'NETWORK_ERROR'
        );
      }

      // Fallback for unknown errors
      logger.error('Unknown error during login', error);
      return failureResult(
        'An error occurred. Please try again.',
        'UNKNOWN_ERROR'
      );
    }
  }

  async logout(): Promise<Result<void>> {
    try {
      logger.debug('Attempting logout');

      const response = await this.httpClient.post('/auth/logout');

      if (response.status !== 200) {
        logger.error('Logout failed', { status: response.status });
        return failureResult('Logout failed', 'LOGOUT_ERROR');
      }

      logger.info('Logout successful');
      return successResult(undefined);
    } catch (error) {
      logger.error('Logout request failed', error);
      return failureResult(
        'Network error',
        'NETWORK_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async refreshToken(refreshTokenValue: string): Promise<Result<UserAuthEntity>> {
    try {
      logger.debug('Attempting token refresh with DummyJSON');

      // Step 1: Refresh the access token using refresh token
      const refreshResponse = await this.httpClient.post<any>(
        API_ENDPOINTS.AUTH.REFRESH,
        {
          refreshToken: refreshTokenValue,
          expiresInMins: 60,
        },
        { includeToken: false } // Don't use token injection for refresh
      );

      if (refreshResponse.status !== 200) {
        const errorMessage = (refreshResponse.data as any)?.message || 'Token refresh failed';
        logger.error('Token refresh failed', { status: refreshResponse.status });
        return failureResult(errorMessage, 'REFRESH_ERROR');
      }

      if (!refreshResponse.data?.accessToken) {
        return failureResult('Invalid refresh response - no access token', 'REFRESH_ERROR');
      }

      // Step 2: Fetch user data with the new token
      // We need to manually set the auth header since we just got a new token
      try {
        const userResponse = await axios.get(
          `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.ME}`,
          {
            headers: {
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
            },
            timeout: API_CONFIG.TIMEOUT,
          }
        );

        // Map to UserAuthEntity
        const mappedData: UserAuthEntity = {
          id: userResponse.data?.id?.toString() || '',
          email: userResponse.data?.email || '',
          name:
            (userResponse.data?.firstName || '') +
            ' ' +
            (userResponse.data?.lastName || ''),
          username: userResponse.data?.username,
          firstName: userResponse.data?.firstName,
          lastName: userResponse.data?.lastName,
          gender: userResponse.data?.gender,
          image: userResponse.data?.image,
          token: {
            accessToken: refreshResponse.data.accessToken,
            refreshToken: refreshResponse.data.refreshToken,
            expiresIn: refreshResponse.data.expiresIn,
          },
        };

        logger.info('Token refresh successful with user data');
        return successResult(mappedData);
      } catch {
        // If user data fetch fails, return with just token data
        logger.warn('Could not fetch user data after refresh, returning token only');
        const mappedData: UserAuthEntity = {
          id: '',
          email: '',
          name: '',
          token: {
            accessToken: refreshResponse.data.accessToken,
            refreshToken: refreshResponse.data.refreshToken,
            expiresIn: refreshResponse.data.expiresIn,
          },
        };
        return successResult(mappedData);
      }
    } catch (error) {
      logger.error('Token refresh request failed', error);

      // Check if error is an Axios error with response
      if (axios.isAxiosError(error)) {
        // Handle specific HTTP error status codes
        if (error.response?.status === 400 || error.response?.status === 401) {
          const errorMessage =
            (error.response?.data as any)?.message ||
            'Invalid or expired refresh token';
          logger.error('Token refresh failed - unauthorized', {
            status: error.response.status,
          });
          return failureResult(errorMessage, 'INVALID_REFRESH_TOKEN');
        }

        // Handle other HTTP errors
        const errorMessage =
          (error.response?.data as any)?.message ||
          error.message ||
          'Token refresh failed';
        logger.error('HTTP error during token refresh', {
          status: error.response?.status,
        });
        return failureResult(errorMessage, 'HTTP_ERROR');
      }

      // Handle network errors
      const isNetworkError =
        error instanceof Error &&
        (error.message.includes('Network') ||
          error.message.includes('timeout') ||
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ENOTFOUND'));

      if (isNetworkError) {
        logger.error('Network error during token refresh');
        return failureResult(
          'Network connection error. Please check your internet connection.',
          'NETWORK_ERROR'
        );
      }

      // Fallback for unknown errors
      logger.error('Unknown error during token refresh', error);
      return failureResult(
        'Failed to refresh token. Please login again.',
        'UNKNOWN_ERROR'
      );
    }
  }
}
