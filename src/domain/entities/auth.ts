/**
 * Authentication entity for domain layer
 */

export interface AuthTokenEntity {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AddressEntity {
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface CompanyEntity {
  name?: string;
  department?: string;
  title?: string;
}

export interface UserAuthEntity {
  id: string;
  email: string;
  name: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  image?: string;
  address?: AddressEntity;
  company?: CompanyEntity;
  token: AuthTokenEntity;
}

export class AuthToken implements AuthTokenEntity {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;

  constructor(auth: AuthTokenEntity) {
    this.accessToken = auth.accessToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }

  isValid(): boolean {
    return !!this.accessToken;
  }

  isExpired(): boolean {
    if (!this.expiresIn) return false;
    return Date.now() > this.expiresIn;
  }
}

export class UserAuth implements UserAuthEntity {
  id: string;
  email: string;
  name: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  image?: string;
  address?: AddressEntity;
  company?: CompanyEntity;
  token: AuthTokenEntity;

  constructor(auth: UserAuthEntity) {
    this.id = auth.id;
    this.email = auth.email;
    this.name = auth.name;
    this.username = auth.username;
    this.firstName = auth.firstName;
    this.lastName = auth.lastName;
    this.gender = auth.gender;
    this.phone = auth.phone;
    this.image = auth.image;
    this.address = auth.address;
    this.company = auth.company;
    this.token = auth.token;
  }

  isAuthenticated(): boolean {
    return !!this.id && !!this.token && new AuthToken(this.token).isValid();
  }
}
