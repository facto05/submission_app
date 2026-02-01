/**
 * Service Locator / Dependency Injection Container
 * Centralized management of all application dependencies
 * 
 * Usage:
 * const loginUseCase = serviceLocator.get<LoginUseCase>('loginUseCase');
 */

import { RemoteUserDataSource } from '../data/datasources/remote_user_datasource';
import { LocalUserDataSource } from '../data/datasources/local_user_datasource';
import { UserRepositoryImpl } from '../data/repositories/user_repository_impl';
import { GetUserUseCase } from '../domain/usecases/get_user.usecase';
import { GetUserListUseCase } from '../domain/usecases/get_user_list.usecase';
import { RemoteAuthDataSource } from '../data/datasources/remote_auth_datasource';
import { LocalAuthDataSource } from '../data/datasources/local_auth_datasource';
import { AuthRepositoryImpl } from '../data/repositories/auth_repository_impl';
import { LoginUseCase } from '../domain/usecases/login.usecase';
import { LogoutUseCase } from '../domain/usecases/logout.usecase';

class ServiceLocator {
  private static instance: ServiceLocator;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.setupDependencies();
  }

  static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  private setupDependencies() {
    // ========== User Feature ==========
    // Data Sources
    this.registerSingleton('remoteUserDataSource', new RemoteUserDataSource());
    this.registerSingleton('localUserDataSource', new LocalUserDataSource());

    // Repositories
    const userRepository = new UserRepositoryImpl(
      this.get('remoteUserDataSource'),
      this.get('localUserDataSource')
    );
    this.registerSingleton('userRepository', userRepository);

    // Use Cases
    this.registerSingleton(
      'getUserUseCase',
      new GetUserUseCase(userRepository)
    );
    this.registerSingleton(
      'getUserListUseCase',
      new GetUserListUseCase(userRepository)
    );

    // ========== Auth Feature ==========
    // Data Sources
    this.registerSingleton('remoteAuthDataSource', new RemoteAuthDataSource());
    this.registerSingleton('localAuthDataSource', new LocalAuthDataSource());

    // Repositories
    const authRepository = new AuthRepositoryImpl(
      this.get('remoteAuthDataSource'),
      this.get('localAuthDataSource')
    );
    this.registerSingleton('authRepository', authRepository);

    // Use Cases
    this.registerSingleton(
      'loginUseCase',
      new LoginUseCase(authRepository)
    );
    this.registerSingleton(
      'logoutUseCase',
      new LogoutUseCase(authRepository)
    );
  }

  registerSingleton(key: string, instance: any): void {
    this.services.set(key, instance);
  }

  registerFactory(key: string, factory: () => any): void {
    this.services.set(key, factory);
  }

  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service '${key}' not found in ServiceLocator`);
    }
    return typeof service === 'function' ? service() : service;
  }

  reset(): void {
    this.services.clear();
    this.setupDependencies();
  }
}

export const serviceLocator = ServiceLocator.getInstance();
