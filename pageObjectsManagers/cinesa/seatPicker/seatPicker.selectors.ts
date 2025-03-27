/**
 * URL for the seat picker page.
 */
// export const url = 'https://www.cinesa.es/compra/butacas/?showtimeId=131-27406';
export const url = 'https://www.cinesa.es/';

/**
 * Represents the available seat types.
 */
export type SeatType = 'normal' | 'vip' | 'wheelchair';
// Nuevo tipo que se usará en el POM
export type SeatState = 'available' | 'selected' | 'unavailable' | 'unknown';

// Definición de estados (centralizados)
const availableState = 'false';
const selectedState = 'true';
const unavailableState = 'unavailable';

/**
 * Expected legend items for the seat picker (in Spanish).
 * These values are used for assertion purposes.
 */
export const expectedLegendItems: string[] = [
  'Seleccionada',
  'No disponible',
  'VIP',
  'Espacio Silla Ruedas',
  'Acompañante',
  'Bloqueada',
];

/**
 * Selectors for the Seat Picker component.
 */
export const SEAT_PICKER_SELECTORS = {
  // Main container of the seat picker
  container: '.seat-picker-container',
  // Rows of seats
  row: '.seat-picker-row',
  // Seats according to type
  seatNormal: '.v-seat-picker-seat--normal',
  seatVip: '.v-seat-picker-seat--vip-available',
  seatWheelchair: '.v-seat-picker-seat--wheelchair',
  // Legend container for the seat picker
  legend: '.seat-picker-legend',
  // Expected legend items (used in assertions)
  expectedLegendItems,
  // Selector for the ticket picker button
  ticketPickerButton: 'button[data-test="ticket-picker"]',
  // Attribute used to identify a seat; update here if it changes in the front-end
  seatAttribute: 'data-seat-id',
  // Nuevos estados para ser usados en el POM
  availableState,
  selectedState,
  unavailableState,
};
