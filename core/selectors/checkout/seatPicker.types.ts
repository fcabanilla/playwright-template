/**
 * Shared SeatPicker types — derived from MCP DOM exploration.
 *
 * Seat elements are `<a>` tags with class `.v-seat-picker-seat`.
 * Type comes from BEM modifier on the element class.
 * State from BEM modifier + aria-pressed attribute.
 * Position from aria-label pattern: "<Type> <row>-<seatNum>".
 */

/** Seat type as indicated by CSS class BEM modifier */
export type SeatType =
  | 'normal'
  | 'sofa-left'
  | 'sofa-right'
  | 'companion'
  | 'wheelchair';

/** Seat state as indicated by CSS class BEM modifier */
export type SeatState = 'available' | 'selected' | 'unavailable';

/** Seat area category — maps to pricing tier */
export interface SeatCategory {
  id: string;
  label: string;
  price: string;
}

/** Parsed seat info from DOM */
export interface SeatInfo {
  ariaLabel: string;
  seatType: SeatType;
  seatState: SeatState;
  row: number;
  seatNumber: number;
  isSelected: boolean;
}

/** Known seat categories from Oasiz */
export const SEAT_CATEGORIES: Record<string, string> = {
  '138-0000000011': 'LUXE',
  '138-0000000006': 'Recliner Extra',
  '138-0000000010': 'LUXE Premium',
  '138-0000000008': 'LUXE Plus',
  '138-0000000002': 'Sofa',
  '138-0000000005': 'VIP Bed',
};
