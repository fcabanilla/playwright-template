/**
 * PRAETOR Login test data — environment-aware URLs and expected values.
 */
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);
const baseUrl = config.baseUrl;

/** Login page URL segments */
export const loginUrls = {
  loginPath: '/compra/inicio-de-sesion/',
  loginPattern: '**/compra/inicio-de-sesion/**',
} as const;

/** Expected login page elements */
export const loginExpected = {
  /** Three sections should be present */
  sections: ['login', 'register', 'guestCheckout'] as const,
} as const;

/** Base URL for dynamic URL construction */
export const loginBaseUrl = baseUrl;
