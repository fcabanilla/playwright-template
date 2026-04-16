/**
 * Priority order for premium seat categories.
 * Lower number = higher priority (selected first as "premium/sofa" section).
 * The category ID matches the CSS class suffix: v-seat-picker-area--category-{id}
 */
export const SEAT_CATEGORY_PRIORITY: Record<string, number> = {
  '138-0000000002': 1, // Sofa (classic D-BOX rooms)
  '138-0000000005': 2, // VIP Bed (premium D-BOX rooms)
  '138-0000000010': 3, // LUXE Premium
  '138-0000000008': 4, // LUXE Plus
  '138-0000000006': 5, // Recliner Extra
  '138-0000000011': 6, // LUXE
};

/**
 * Selectors for the Seat Picker page.
 */
export const SEAT_PICKER_SELECTORS = {
  container: '.seat-picker-container',
  seatGeneric: '.v-seat-picker-seat',
  confirmSeatsButton: '.selected-seats-button',
  warningMessage: '.selected-seats-validation li',
  disabledConfirmButton: '.selected-seats-button[disabled]',
  wheelchairModal: 'aside.v-modal.wheelchair-modal[role="dialog"]',
  wheelchairModalAcceptButton: 'aside.v-modal.wheelchair-modal button.accept',
  wheelchairModalCancelButton: 'aside.wheelchair-modal .cancel',
  dboxModal: 'aside.v-modal[role="dialog"]',
  dboxModalAcceptButton: 'aside.v-modal button.btn--blue--medium',
  modalGeneric: 'aside.v-modal[role="dialog"]',
  modalAcceptButton:
    'aside.v-modal button:has-text("Aceptar"), aside.v-modal button:has-text("Accept"), aside.v-modal button:has-text("Continuar"), aside.v-modal button:has-text("Continue"), aside.v-modal button:has-text("I can\'t wait"), aside.v-modal button:has-text("No puedo esperar"), aside.v-modal button.btn--blue--medium',
  modalCloseButton:
    'aside.v-modal .v-modal__close, aside.v-modal button[aria-label*="close"], aside.v-modal button[aria-label*="cerrar"]',
  soldOutMessage:
    '.sold-out, .agotado, .no-availability, .sin-disponibilidad, [class*="sold"], [class*="agotad"], .error-message:has-text("agotad"), .error-message:has-text("disponib")',
  noSeatsAvailable: '.no-seats, .sin-asientos, [class*="no-seat"]',
  errorMessage: '.error, .mensaje-error, .alert-error, .notification--error',
  seatArea: '.v-seat-picker-area',
  pricingCard: '.pricing-card',
  pricingCardLabel: '.pricing-card__label',
  showtimeAttributeModal:
    'aside.v-modal--generic.showtime-attribute-modal[role="dialog"]',
  showtimeAttributeModalAcceptButton:
    'aside.v-modal--generic.showtime-attribute-modal button',
  showtimeAttributeModalCloseButton:
    'aside.v-modal--generic.showtime-attribute-modal .v-modal__close',
};
