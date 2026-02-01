/**
 * Remote data source for User API calls
 */

import { Result } from '../../core/types';
import { failureResult, successResult } from '../../core/utils';
import { UserEntity } from '../../domain/entities/user';
import { API_CONFIG, API_ENDPOINTS } from '../../config/constants';

export interface RemoteUserDataSourceInterface {
  getUser(id: string): Promise<Result<UserEntity>>;
  getUserList(): Promise<Result<UserEntity[]>>;
  createUser(user: UserEntity): Promise<Result<UserEntity>>;
  updateUser(user: UserEntity): Promise<Result<UserEntity>>;
  deleteUser(id: string): Promise<Result<void>>;
}

export class RemoteUserDataSource implements RemoteUserDataSourceInterface {
  // Base URL: DummyJSON API
  private baseURL = API_CONFIG.BASE_URL;

  async getUser(id: string): Promise<Result<UserEntity>> {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.USERS.DETAIL(id)}`);
      if (!response.ok) {
        return failureResult('Failed to fetch user');
      }
      const data = await response.json();
      return successResult(data);
    } catch (error) {
      return failureResult(
        'Network error',
        'NETWORK_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async getUserList(): Promise<Result<UserEntity[]>> {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.USERS.LIST}`);
      if (!response.ok) {
        return failureResult('Failed to fetch user list');
      }
      const data = await response.json();
      // DummyJSON returns { users: [...], total, skip, limit }
      return successResult(data.users || []);
    } catch (error) {
      return failureResult(
        'Network error',
        'NETWORK_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async createUser(user: UserEntity): Promise<Result<UserEntity>> {
    try {
      const response = await fetch(`${this.baseURL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        return failureResult('Failed to create user');
      }
      const data = await response.json();
      return successResult(data);
    } catch (error) {
      return failureResult(
        'Network error',
        'NETWORK_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async updateUser(user: UserEntity): Promise<Result<UserEntity>> {
    try {
      const response = await fetch(`${this.baseURL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        return failureResult('Failed to update user');
      }
      const data = await response.json();
      return successResult(data);
    } catch (error) {
      return failureResult(
        'Network error',
        'NETWORK_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async deleteUser(id: string): Promise<Result<void>> {
    try {
      const response = await fetch(`${this.baseURL}/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        return failureResult('Failed to delete user');
      }
      return successResult(undefined);
    } catch (error) {
      return failureResult(
        'Network error',
        'NETWORK_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }
}
