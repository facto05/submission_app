/**
 * HTTP Client with Secure Token Management
 * Handles API requests with automatic token injection using Axios
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenStorage } from './token_storage';
import { logger } from './logger';

export interface RequestOptions {
  includeToken?: boolean;
  headers?: Record<string, string>;
}

export interface HttpResponse<T> {
  data?: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string, timeout: number = 30000) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token interceptor
    this.setupInterceptors();
  }

  /**
   * Setup axios request/response interceptors
   */
  private setupInterceptors() {
    // Request interceptor to add token
    this.axiosInstance.interceptors.request.use(
      async config => {
        // Check if token should be included
        const includeToken =
          (config as any).includeToken !== false;

        if (includeToken) {
          try {
            const token = await tokenStorage.getAccessToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            logger.error('Error adding authorization header', error);
          }
        }

        return config;
      },
      error => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logger.warn('Unauthorized - token might be expired');
          // Could trigger token refresh here
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(
    path: string,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    try {
      logger.debug(`GET ${path}`);

      const config: AxiosRequestConfig = {
        headers: options?.headers,
        ...(options && { includeToken: options.includeToken }),
      };

      const response = await this.axiosInstance.get<T>(path, config);
      return this.formatResponse(response);
    } catch (error) {
      logger.error(`GET ${path} failed`, error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    body?: any,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    try {
      logger.debug(`POST ${path}`);

      const config: AxiosRequestConfig = {
        headers: options?.headers,
        ...(options && { includeToken: options.includeToken }),
      };

      const response = await this.axiosInstance.post<T>(path, body, config);
      return this.formatResponse(response);
    } catch (error) {
      logger.error(`POST ${path} failed`, error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    body?: any,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    try {
      logger.debug(`PUT ${path}`);

      const config: AxiosRequestConfig = {
        headers: options?.headers,
        ...(options && { includeToken: options.includeToken }),
      };

      const response = await this.axiosInstance.put<T>(path, body, config);
      return this.formatResponse(response);
    } catch (error) {
      logger.error(`PUT ${path} failed`, error);
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(
    path: string,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    try {
      logger.debug(`DELETE ${path}`);

      const config: AxiosRequestConfig = {
        headers: options?.headers,
        ...(options && { includeToken: options.includeToken }),
      };

      const response = await this.axiosInstance.delete<T>(path, config);
      return this.formatResponse(response);
    } catch (error) {
      logger.error(`DELETE ${path} failed`, error);
      throw error;
    }
  }

  /**
   * Format axios response to HttpResponse format
   */
  private formatResponse<T>(response: AxiosResponse<T>): HttpResponse<T> {
    const headers: Record<string, string> = {};
    Object.entries(response.headers).forEach(([key, value]) => {
      headers[key] = String(value);
    });

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers,
    };
  }
}

/**
 * Create HTTP client with base URL
 */
export const createHttpClient = (
  baseURL: string,
  timeout?: number
): HttpClient => {
  return new HttpClient(baseURL, timeout);
};
