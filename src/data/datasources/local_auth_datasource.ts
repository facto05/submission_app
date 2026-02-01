/**
 * Local data source for Authentication (cached tokens with secure storage)
 */

import { Result } from '../../core/types';
import { failureResult, successResult } from '../../core/utils';
import { tokenStorage } from '../../core/utils/token_storage';
import { UserAuth, UserAuthEntity } from '../../domain/entities/auth';
import { logger } from '../../core/utils/logger';

export interface LocalAuthDataSourceInterface {
  saveAuth(auth: UserAuthEntity): Promise<Result<UserAuthEntity>>;
  getAuth(): Promise<Result<UserAuthEntity | null>>;
  clearAuth(): Promise<Result<void>>;
  isAuthExists(): Promise<Result<boolean>>;
}

export class LocalAuthDataSource implements LocalAuthDataSourceInterface {
  async saveAuth(auth: UserAuthEntity): Promise<Result<UserAuthEntity>> {
    try {
      // Save token securely
      const tokenSaved = await tokenStorage.saveToken(auth.token);

      if (!tokenSaved) {
        logger.warn('Failed to save token to secure storage');
        return failureResult(
          'Failed to save auth securely',
          'STORAGE_ERROR'
        );
      }

      logger.info('Auth saved with secure token storage');
      return successResult(auth);
    } catch (error) {
      logger.error('Failed to save auth locally', error);
      return failureResult(
        'Failed to save auth locally',
        'STORAGE_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async getAuth(): Promise<Result<UserAuthEntity | null>> {
    try {
      // Retrieve token from secure storage
      const token = await tokenStorage.getToken();

      if (!token) {
        logger.debug('No auth found in secure storage');
        return successResult(null);
      }

      // In production, also retrieve user info from secure storage
      // For now, returning with token only
      logger.debug('Auth retrieved from secure storage');
      return successResult({
        id: '', // Would be retrieved from secure storage or cache
        email: '', // Would be retrieved from secure storage or cache
        name: '', // Would be retrieved from secure storage or cache
        token,
      });
    } catch (error) {
      logger.error('Failed to retrieve auth', error);
      return failureResult(
        'Failed to retrieve auth',
        'STORAGE_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async clearAuth(): Promise<Result<void>> {
    try {
      // Clear token from secure storage
      const removed = await tokenStorage.removeToken();

      if (!removed) {
        logger.warn('Failed to clear token from secure storage');
      }

      logger.info('Auth cleared from secure storage');
      return successResult(undefined);
    } catch (error) {
      logger.error('Failed to clear auth', error);
      return failureResult(
        'Failed to clear auth',
        'STORAGE_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async isAuthExists(): Promise<Result<boolean>> {
    try {
      const exists = await tokenStorage.isTokenExists();
      logger.debug('Auth exists in secure storage:', exists);
      return successResult(exists);
    } catch (error) {
      logger.error('Error checking auth existence', error);
      return successResult(false);
    }
  }
}
