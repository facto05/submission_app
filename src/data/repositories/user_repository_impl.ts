/**
 * User Repository Implementation
 */

import { Result } from '../../core/types';
import { successResult, failureResult, isSuccess } from '../../core/utils';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User, UserEntity } from '../../domain/entities/user';
import { RemoteUserDataSource } from '../datasources/remote_user_datasource';
import { LocalUserDataSource } from '../datasources/local_user_datasource';

export class UserRepositoryImpl extends UserRepository {
  constructor(
    private remoteDataSource: RemoteUserDataSource,
    private localDataSource: LocalUserDataSource
  ) {
    super();
  }

  async getUser(id: string): Promise<Result<User>> {
    try {
      // Try remote first, fallback to local
      const remoteResult = await this.remoteDataSource.getUser(id);
      if (isSuccess(remoteResult)) {
        const user = new User(remoteResult.data);
        return successResult(user);
      }

      // Fallback to local
      const localResult = await this.localDataSource.getUser(id);
      if (isSuccess(localResult)) {
        const user = new User(localResult.data);
        return successResult(user);
      }

      return failureResult('User not found');
    } catch (error) {
      throw error;
    }
  }

  async getUserList(): Promise<Result<User[]>> {
    try {
      // Try remote first
      const remoteResult = await this.remoteDataSource.getUserList();
      if (isSuccess(remoteResult)) {
        const users = remoteResult.data.map(entity => new User(entity));
        return successResult(users);
      }

      // Fallback to local
      const localResult = await this.localDataSource.getUserList();
      if (isSuccess(localResult)) {
        const users = localResult.data.map(entity => new User(entity));
        return successResult(users);
      }

      return failureResult('Failed to fetch users');
    } catch (error) {
      throw error;
    }
  }

  async saveUser(user: User): Promise<Result<User>> {
    try {
      const userData: UserEntity = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      };

      // Save to remote
      const remoteResult = await this.remoteDataSource.createUser(userData);

      // Also save locally
      if (isSuccess(remoteResult)) {
        await this.localDataSource.saveUser(remoteResult.data);
        return successResult(new User(remoteResult.data));
      }

      return failureResult('Failed to save user');
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string): Promise<Result<void>> {
    try {
      // Delete from remote
      const remoteResult = await this.remoteDataSource.deleteUser(id);

      // Also delete locally
      if (isSuccess(remoteResult)) {
        await this.localDataSource.deleteUser(id);
      }

      return remoteResult;
    } catch (error) {
      throw error;
    }
  }
}
