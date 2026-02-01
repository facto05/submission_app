/**
 * Local data source for User (cached/local storage)
 */

import { Result } from '../../core/types';
import { failureResult, successResult } from '../../core/utils';
import { UserEntity } from '../../domain/entities/user';

export interface LocalUserDataSourceInterface {
  getUser(id: string): Promise<Result<UserEntity>>;
  getUserList(): Promise<Result<UserEntity[]>>;
  saveUser(user: UserEntity): Promise<Result<UserEntity>>;
  deleteUser(id: string): Promise<Result<void>>;
}

export class LocalUserDataSource implements LocalUserDataSourceInterface {
  private storageKey = 'users';

  async getUser(id: string): Promise<Result<UserEntity>> {
    try {
      // Implement with AsyncStorage or similar
      return successResult({
        id: '1',
        name: 'Local User',
        email: 'user@local.com',
        createdAt: new Date(),
      });
    } catch (error) {
      return failureResult(
        'Failed to fetch local user',
        'LOCAL_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async getUserList(): Promise<Result<UserEntity[]>> {
    try {
      // Implement with AsyncStorage or similar
      return successResult([]);
    } catch (error) {
      return failureResult(
        'Failed to fetch local user list',
        'LOCAL_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async saveUser(user: UserEntity): Promise<Result<UserEntity>> {
    try {
      // Implement with AsyncStorage or similar
      return successResult(user);
    } catch (error) {
      return failureResult(
        'Failed to save user locally',
        'LOCAL_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async deleteUser(id: string): Promise<Result<void>> {
    try {
      // Implement with AsyncStorage or similar
      return successResult(undefined);
    } catch (error) {
      return failureResult(
        'Failed to delete local user',
        'LOCAL_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }
}
