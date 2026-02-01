/**
 * Abstract repository for User
 */

import { Result } from '../../core/types';
import { User } from '../entities/user';

export abstract class UserRepository {
  abstract getUser(id: string): Promise<Result<User>>;
  abstract getUserList(): Promise<Result<User[]>>;
  abstract saveUser(user: User): Promise<Result<User>>;
  abstract deleteUser(id: string): Promise<Result<void>>;
}
