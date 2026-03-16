/**
 * Centralized Configuration Exports
 *
 * This file provides a single entry point for importing
 * all configuration-related modules.
 */

// Cinema Configuration (Single Source of Truth)
export type { CinemaConfig } from './cinemas.config';
export { AVAILABLE_CINEMAS, getCinemasForEnvironment } from './cinemas.config';

// Environment Configuration
export type { CinesaEnvironment, UCIEnvironment } from './environments';
export { getCinesaConfig, getUCIConfig } from './environments';

// URL Configuration
export { getCinesaUrls, getUCIUrls } from './urls';

// Test Accounts Types
export type { TestAccount } from './testAccounts.types';
