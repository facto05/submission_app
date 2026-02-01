/**
 * Use case for fetching user
 */

import { Result, UseCase } from '../../core/types';
import { User } from '../entities/user';
import { UserRepository } from '../repositories/user.repository';

export interface GetUserParams {
  userId: string;
}

export class GetUserUseCase implements UseCase<GetUserParams, Result<User>> {
  constructor(private userRepository: UserRepository) {}

  async execute(params: GetUserParams): Promise<Result<User>> {
    try {
      return await this.userRepository.getUser(params.userId);
    } catch (error) {
      throw error;
    }
  }
}
