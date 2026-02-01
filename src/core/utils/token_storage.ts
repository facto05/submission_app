/**
 * Token Storage Service
 * Specialized service for secure token management
 */

import { secureStorage } from './secure_storage';
import { logger } from './logger';
import { AuthTokenEntity } from '../../domain/entities/auth';

export interface TokenStorageInterface {
  saveToken(token: AuthTokenEntity): Promise<boolean>;
  getToken(): Promise<AuthTokenEntity | null>;
  removeToken(): Promise<boolean>;
  isTokenExists(): Promise<boolean>;
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
}

export class TokenStorage implements TokenStorageInterface {
  private readonly tokenKey = 'auth_token';
  private readonly accessTokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';

  async saveToken(token: AuthTokenEntity): Promise<boolean> {
    try {
      // Save complete token object
      const tokenJson = JSON.stringify(token);
      const result = await secureStorage.setItem(this.tokenKey, tokenJson);

      if (result) {
        // Also save individual tokens for quick access
        await secureStorage.setItem(this.accessTokenKey, token.accessToken);
        if (token.refreshToken) {
          await secureStorage.setItem(this.refreshTokenKey, token.refreshToken);
        }
        logger.info('Token saved securely');
        return true;
      }

      logger.warn('Failed to save token securely');
      return false;
    } catch (error) {
      logger.error('Error saving token', error);
      return false;
    }
  }

  async getToken(): Promise<AuthTokenEntity | null> {
    try {
      const tokenJson = await secureStorage.getItem(this.tokenKey);

      if (!tokenJson) {
        logger.debug('No token found');
        return null;
      }

      const token: AuthTokenEntity = JSON.parse(tokenJson);

      // Validate token structure
      if (!token.accessToken) {
        logger.warn('Invalid token structure');
        await this.removeToken();
        return null;
      }

      logger.debug('Token retrieved successfully');
      return token;
    } catch (error) {
      logger.error('Error retrieving token', error);
      await this.removeToken(); // Clear invalid token
      return null;
    }
  }

  async removeToken(): Promise<boolean> {
    try {
      await secureStorage.removeItem(this.tokenKey);
      await secureStorage.removeItem(this.accessTokenKey);
      await secureStorage.removeItem(this.refreshTokenKey);
      logger.info('Token removed securely');
      return true;
    } catch (error) {
      logger.error('Error removing token', error);
      return false;
    }
  }

  async isTokenExists(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      logger.error('Error checking token existence', error);
      return false;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(this.accessTokenKey);
    } catch (error) {
      logger.error('Error retrieving access token', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(this.refreshTokenKey);
    } catch (error) {
      logger.error('Error retrieving refresh token', error);
      return null;
    }
  }
}

// Export singleton instance
export const tokenStorage = new TokenStorage();
