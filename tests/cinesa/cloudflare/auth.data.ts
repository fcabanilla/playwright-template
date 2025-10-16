import { getCinesaConfig, CinesaEnvironment } from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

// Timeout configuration for manual login flow
export const AUTH_TIMEOUTS = {
  manualLogin: 30 * 60 * 1000, // 30 minutes for manual login
  navbarDetection: 30 * 60 * 1000, // 30 minutes to detect navbar
} as const;

// Base URL based on environment
export const authUrl = config.baseUrl;

// StorageState file based on environment
export const getStorageStateFile = (environment: string): string => {
  if (environment === 'production') return 'loggedInState.json';
  return `loggedInState.${environment}.json`;
};

// Selector to detect successful user login
export const LOGIN_SUCCESS_SELECTOR = 'nav.header-nav';
