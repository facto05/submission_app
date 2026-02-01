/**
 * Use case for user login
 */

import { Result, UseCase } from '../../core/types';
import { UserAuth, AuthCredentials } from '../entities/auth';
import { AuthRepository } from '../repositories/auth.repository';

export class LoginUseCase implements UseCase<AuthCredentials, Result<UserAuth>> {
  constructor(private authRepository: AuthRepository) {}

  async execute(credentials: AuthCredentials): Promise<Result<UserAuth>> {
    // Validate credentials
    if (!credentials.email || !credentials.password) {
      return {
        instanceof: Failure,
        message: 'Email and password are required',
        code: 'INVALID_CREDENTIALS',
      } as any;
    }

    if (!this.isValidEmail(credentials.email)) {
      return {
        instanceof: Failure,
        message: 'Invalid email format',
        code: 'INVALID_EMAIL',
      } as any;
    }

    try {
      return await this.authRepository.login(credentials);
    } catch (error) {
      throw error;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

class Failure {
  constructor(
    public readonly message: string,
    public readonly code?: string,
    public readonly exception?: Error
  ) {}
}
