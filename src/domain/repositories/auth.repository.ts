/**
 * Abstract repository for Authentication
 */

import { Result } from '../../core/types';
import { UserAuth, AuthCredentials } from '../entities/auth';

export abstract class AuthRepository {
  abstract login(credentials: AuthCredentials): Promise<Result<UserAuth>>;
  abstract logout(): Promise<Result<void>>;
  abstract getCurrentUser(): Promise<Result<UserAuth | null>>;
  abstract refreshToken(): Promise<Result<UserAuth>>;
  abstract isAuthenticated(): Promise<Result<boolean>>;
}
