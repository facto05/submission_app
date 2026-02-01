/**
 * Secure Storage Service
 * Handles secure storage of sensitive data like tokens
 * Uses AsyncStorage for persistent storage across app restarts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

export interface SecureStorageInterface {
  setItem(key: string, value: string): Promise<boolean>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
}

/**
 * AsyncStorage-based persistent storage
 * Data persists across app restarts
 * Works on both iOS and Android
 */
export class AsyncSecureStorage implements SecureStorageInterface {
  private prefix = 'secure_';

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async setItem(key: string, value: string): Promise<boolean> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      await AsyncStorage.setItem(prefixedKey, value);
      logger.debug(`Stored to AsyncStorage: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Failed to store to AsyncStorage: ${key}`, error);
      return false;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const value = await AsyncStorage.getItem(prefixedKey);
      logger.debug(`Retrieved from AsyncStorage: ${key}`, !!value);
      return value;
    } catch (error) {
      logger.error(`Failed to retrieve from AsyncStorage: ${key}`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      await AsyncStorage.removeItem(prefixedKey);
      logger.debug(`Removed from AsyncStorage: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Failed to remove from AsyncStorage: ${key}`, error);
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      // Only clear items with our prefix
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToRemove = allKeys.filter(key => key.startsWith(this.prefix));
      
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
      
      logger.debug('Cleared all AsyncStorage secure data');
      return true;
    } catch (error) {
      logger.error('Failed to clear AsyncStorage', error);
      return false;
    }
  }
}

/**
 * In-memory storage fallback
 * Used for testing or when AsyncStorage is not available
 */
class InMemorySecureStorage implements SecureStorageInterface {
  private store: Map<string, string> = new Map();

  async setItem(key: string, value: string): Promise<boolean> {
    try {
      this.store.set(key, value);
      logger.debug(`Stored in memory: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Failed to store in memory: ${key}`, error);
      return false;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const value = this.store.get(key) || null;
      logger.debug(`Retrieved from memory: ${key}`, !!value);
      return value;
    } catch (error) {
      logger.error(`Failed to retrieve from memory: ${key}`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      const deleted = this.store.delete(key);
      logger.debug(`Removed from memory: ${key}`, deleted);
      return deleted;
    } catch (error) {
      logger.error(`Failed to remove from memory: ${key}`, error);
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      this.store.clear();
      logger.debug('Cleared all in-memory storage');
      return true;
    } catch (error) {
      logger.error('Failed to clear in-memory storage', error);
      return false;
    }
  }
}

/**
 * Factory function to get appropriate secure storage implementation
 */
export const getSecureStorage = (): SecureStorageInterface => {
  // Use AsyncStorage for persistent storage
  return new AsyncSecureStorage();
  
  // For testing/fallback, use in-memory:
  // return new InMemorySecureStorage();
};

// Export singleton instance
export const secureStorage = getSecureStorage();
