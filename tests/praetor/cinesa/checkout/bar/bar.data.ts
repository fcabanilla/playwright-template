/**
 * PRAETOR Bar test data — environment-aware URLs and expected values.
 */
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

export const checkoutBaseUrl = config.baseUrl;

/** URL patterns for bar step */
export const barUrls = {
  barPage: '**/compra/productos-de-bar/**',
  purchaseSummary: '**/compra/resumen/**',
} as const;
