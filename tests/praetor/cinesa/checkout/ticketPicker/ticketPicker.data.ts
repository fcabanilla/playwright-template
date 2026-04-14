/**
 * PRAETOR TicketPicker test data — environment-aware URLs and expected values.
 */
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

export const checkoutBaseUrl = config.baseUrl;

/** URL patterns for ticket picker step */
export const ticketPickerUrls = {
  ticketPage: '**/compra/tus-entradas/**',
} as const;

/** Expected ticket picker behavior */
export const ticketPickerExpected = {
  /** Minimum number of ticket rows expected */
  minTicketRows: 1,
  /** A selectable ticket type should be present (lab may show regional promotions) */
  primaryTicketPatterns: [
    /adult/i,
    /normal/i,
    /general/i,
    /entrada/i,
    /dimecres/i,
    /cinema/i,
    /pack/i,
    /infantil/i,
    /joven/i,
    /senior/i,
  ],
} as const;
