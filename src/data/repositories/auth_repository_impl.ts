/**
 * Authentication Repository Implementation
 */

import { Result } from '../../core/types';
import { failureResult, successResult } from '../../core/utils';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { UserAuth, AuthCredentials, UserAuthEntity } from '../../domain/entities/auth';
import { RemoteAuthDataSource } from '../datasources/remote_auth_datasource';
import { LocalAuthDataSource } from '../datasources/local_auth_datasource';

export class AuthRepositoryImpl extends AuthRepository {
  constructor(
    private remoteDataSource: RemoteAuthDataSource,
    private localDataSource: LocalAuthDataSource
  ) {
    super();
  }

  async login(credentials: AuthCredentials): Promise<Result<UserAuth>> {
    try {
      // Try to login via remote API
      const remoteResult = await this.remoteDataSource.login(credentials);

      if (remoteResult instanceof Error || 'message' in remoteResult) {
        return remoteResult;
      }

      // Save auth locally
      await this.localDataSource.saveAuth(remoteResult.data);

      return successResult(
        new UserAuth(remoteResult.data)
      );
    } catch (error) {
      return failureResult(
        'Login failed',
        'LOGIN_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async logout(): Promise<Result<void>> {
    try {
      // Call logout API
      await this.remoteDataSource.logout();

      // Clear local auth
      const clearResult = await this.localDataSource.clearAuth();

      return clearResult instanceof Error || 'message' in clearResult
        ? clearResult
        : successResult(undefined);
    } catch (error) {
      return failureResult(
        'Logout failed',
        'LOGOUT_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async getCurrentUser(): Promise<Result<UserAuth | null>> {
    try {
      const localResult = await this.localDataSource.getAuth();

      if (localResult instanceof Error || 'message' in localResult) {
        return failureResult('Failed to get current user');
      }

      if (!localResult.data) {
        return successResult(null);
      }

      return successResult(new UserAuth(localResult.data));
    } catch (error) {
      return failureResult('Failed to get current user');
    }
  }

  async refreshToken(): Promise<Result<UserAuth>> {
    try {
      const authResult = await this.localDataSource.getAuth();

      if (authResult instanceof Error || 'message' in authResult) {
        return failureResult('No auth found');
      }

      if (!authResult.data?.token) {
        return failureResult('No token found');
      }

      const refreshResult = await this.remoteDataSource.refreshToken(
        authResult.data.token.accessToken
      );

      if (refreshResult instanceof Error || 'message' in refreshResult) {
        return refreshResult;
      }

      await this.localDataSource.saveAuth(refreshResult.data);

      return successResult(new UserAuth(refreshResult.data));
    } catch (error) {
      return failureResult('Token refresh failed');
    }
  }

  async isAuthenticated(): Promise<Result<boolean>> {
    try {
      const authResult = await this.localDataSource.getAuth();

      if (authResult instanceof Error || 'message' in authResult) {
        return successResult(false);
      }

      if (!authResult.data) {
        return successResult(false);
      }

      const userAuth = new UserAuth(authResult.data);
      return successResult(userAuth.isAuthenticated());
    } catch (error) {
      return successResult(false);
    }
  }
}
