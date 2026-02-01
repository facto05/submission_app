/**
 * Utility functions for handling Result type
 */

import { Failure, Result, Success } from '../types';

export const isSuccess = <T>(result: Result<T>): result is Success<T> => {
  return result instanceof Success;
};

export const isFailure = <T>(result: Result<T>): result is Failure => {
  return result instanceof Failure;
};

export const successResult = <T>(data: T): Result<T> => {
  return new Success(data);
};

export const failureResult = (
  message: string,
  code?: string,
  exception?: Error
): Result<never> => {
  return new Failure(message, code, exception);
};

export const handleResult = <T, R>(
  result: Result<T>,
  onSuccess: (data: T) => R,
  onFailure: (error: Failure) => R
): R => {
  if (isSuccess(result)) {
    return onSuccess(result.data);
  } else {
    return onFailure(result);
  }
};
