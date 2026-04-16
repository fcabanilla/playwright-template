/**
 * PRAETOR E2E test data — checkout flow URLs and expected values.
 *
 * Uses PREPROD_OASIZ_SHOWTIMES for active sessions.
 */
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../../../config/environments';
import { PREPROD_OASIZ_SHOWTIMES, deferredRecord } from '../seatPicker/seatPicker.data';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);
const baseUrl = config.baseUrl;

/** Checkout flow URLs */
export const checkoutUrls = {
  seatPicker: (showtimeId: string) =>
    `${baseUrl}/compra/butacas/?showtimeId=${showtimeId}`,
  login: `**/compra/inicio-de-sesion/**`,
  tickets: `**/compra/tus-entradas/**`,
  bar: `**/compra/productos-de-bar/**`,
  purchaseSummary: `**/compra/resumen-de-tu-compra/**`,
  payment: `**/compra/pago-del-pedido/**`,
} as const;

/** Showtime allocation per E2E test — deferred until first access */
export const E2E_SHOWTIMES = deferredRecord(() => ({
  barSingleSeat: PREPROD_OASIZ_SHOWTIMES.bar,
  barMultipleSeats: PREPROD_OASIZ_SHOWTIMES.reserve1,
  checkoutCreditCard: PREPROD_OASIZ_SHOWTIMES.checkout,
  checkoutGiftCard: PREPROD_OASIZ_SHOWTIMES.reserve2,
  seatPickerComplete: PREPROD_OASIZ_SHOWTIMES.seatPicker,
  overCapacity: PREPROD_OASIZ_SHOWTIMES.reserve3,
  dbox: PREPROD_OASIZ_SHOWTIMES.dbox,
  isense: PREPROD_OASIZ_SHOWTIMES.isense,
}));

/** Base URL for constructing showtime URLs */
export const checkoutBaseUrl = baseUrl;

/** Expected values for E2E assertions */
export const e2eExpected = {
  /** Purchase summary heading */
  summaryHeading: 'Resumen de tu compra',
  /** Payment heading */
  paymentHeading: 'Pago del pedido',
  /** Redsys label */
  redsysCreditCard: 'Tarjeta de crédito',
  /** Gift card section title substring */
  giftCardTitle: 'tarjeta regalo',
} as const;
