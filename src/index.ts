/**
 * Root Level Barrel Export
 * Central entry point for all app modules
 */

// Config
export { serviceLocator } from './config/service_locator';
export { AppConfig } from './config/app.config';

// Core
export * from './core';

// Domain
export * from './domain';

// Data
export * from './data';
