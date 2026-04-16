/**
 * Checkout test data
 *
 * Centralized criteria for film/showtime selection and checkout configuration.
 */

export interface CheckoutShowtimeSelectionCriteria {
  requiredFormat: 'normal' | 'dbox' | 'any';
  preferredRooms: string[];
}

/**
 * Default showtime selection criteria for checkout tests.
 *
 * Targets normal format showtimes in standard rooms (Sala 1-12) to ensure
 * predictable pricing and avoid special-format surcharges during payment tests.
 */
export const checkoutShowtimeSelectionCriteria: CheckoutShowtimeSelectionCriteria =
  {
    requiredFormat: 'normal',
    preferredRooms: [
      'Sala 1',
      'Sala 2',
      'Sala 3',
      'Sala 4',
      'Sala 5',
      'Sala 6',
      'Sala 7',
      'Sala 8',
      'Sala 9',
      'Sala 10',
      'Sala 11',
      'Sala 12',
    ],
  };
