/**
 * PRAETOR E2E test data — checkout flow URLs and expected values.
 *
 * Uses PREPROD_OASIZ_SHOWTIMES for active sessions.
 */
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../../../config/environments';
import { PREPROD_OASIZ_SHOWTIMES } from '../seatPicker/seatPicker.data';

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

/** Showtime allocation per E2E test — avoids seat contention between workers */
export const E2E_SHOWTIMES = {
  /** Bar E2E single seat */
  barSingleSeat: PREPROD_OASIZ_SHOWTIMES.bar,
  /** Bar E2E multiple seats */
  barMultipleSeats: PREPROD_OASIZ_SHOWTIMES.reserve1,
  /** Checkout E2E (credit card) */
  checkoutCreditCard: PREPROD_OASIZ_SHOWTIMES.checkout,
  /** Checkout E2E (gift card) */
  checkoutGiftCard: PREPROD_OASIZ_SHOWTIMES.reserve2,
  /** SeatPicker complete purchase */
  seatPickerComplete: PREPROD_OASIZ_SHOWTIMES.seatPicker,
  /** Over capacity test */
  overCapacity: PREPROD_OASIZ_SHOWTIMES.reserve3,
  /** D-BOX test */
  dbox: PREPROD_OASIZ_SHOWTIMES.dbox,
  /** iSense reserve */
  isense: PREPROD_OASIZ_SHOWTIMES.isense,
} as const;

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
