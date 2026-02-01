/**
 * Core types and global types used throughout the application
 */

export type Result<T> = Success<T> | Failure;

export class Success<T> {
  constructor(public readonly data: T) {}
}

export class Failure {
  constructor(
    public readonly message: string,
    public readonly code?: string,
    public readonly exception?: Error
  ) {}
}

export interface UseCase<Params, Result> {
  execute(params: Params): Promise<Result>;
}

export interface Repository {
  [key: string]: any;
}

export interface DataSource {
  [key: string]: any;
}

export interface AppState {
  isLoading: boolean;
  error: string | null;
  data: any;
}
