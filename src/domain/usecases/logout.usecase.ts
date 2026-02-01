/**
 * Use case for user logout
 */

import { Result, UseCase } from '../../core/types';
import { AuthRepository } from '../repositories/auth.repository';

export class LogoutUseCase implements UseCase<void, Result<void>> {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<Result<void>> {
    try {
      return await this.authRepository.logout();
    } catch (error) {
      throw error;
    }
  }
}
