/**
 * Sample User entity for domain layer
 */

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export class User implements UserEntity {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
    this.createdAt = user.createdAt;
  }

  isValid(): boolean {
    return !!this.id && !!this.email && !!this.name;
  }
}
