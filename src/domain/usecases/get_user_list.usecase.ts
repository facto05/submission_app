/**
 * Use case for fetching user list
 */

import { Result, UseCase } from '../../core/types';
import { User } from '../entities/user';
import { UserRepository } from '../repositories/user.repository';

export class GetUserListUseCase implements UseCase<void, Result<User[]>> {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<Result<User[]>> {
    try {
      return await this.userRepository.getUserList();
    } catch (error) {
      throw error;
    }
  }
}
