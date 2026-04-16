/**
 * Shared checkout selectors — barrel export.
 *
 * Single import point for all checkout component selectors and types.
 *
 * Usage:
 *   import { seatPickerSelectors, SeatPickerSelectors } from '../../core/selectors/checkout';
 *   import { barSelectors, BarSelectors } from '../../core/selectors/checkout';
 */

// SeatPicker
export {
  seatPickerSelectors,
  type SeatPickerSelectors,
} from './seatPicker.selectors';
export {
  type SeatType,
  type SeatState,
  type SeatCategory,
  type SeatInfo,
  SEAT_CATEGORIES,
} from './seatPicker.types';

// Bar
export { barSelectors, type BarSelectors } from './bar.selectors';
export { type MenuItemInfo } from './bar.types';

// TicketPicker
export {
  ticketPickerSelectors,
  type TicketPickerSelectors,
} from './ticketPicker.selectors';
export { type TicketTypeInfo } from './ticketPicker.types';

// Login
export { loginSelectors, type LoginSelectors } from './login.selectors';

// PurchaseSummary
export {
  purchaseSummarySelectors,
  type PurchaseSummarySelectors,
} from './purchaseSummary.selectors';
export {
  type CustomerDetails,
  type OrderSummaryItem,
  DEFAULT_GUEST_DETAILS,
} from './purchaseSummary.types';

// Payment
export {
  paymentSelectors,
  type PaymentSelectors,
} from './payment.selectors';
