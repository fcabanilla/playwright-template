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
  modalAcceptButton: 'aside.v-modal button:has-text("Aceptar"), aside.v-modal button:has-text("Accept"), aside.v-modal button:has-text("Continuar"), aside.v-modal button:has-text("Continue"), aside.v-modal button.btn--blue--medium',
  modalCloseButton: 'aside.v-modal .v-modal__close, aside.v-modal button[aria-label*="close"], aside.v-modal button[aria-label*="cerrar"]',
  soldOutMessage: '.sold-out, .agotado, .no-availability, .sin-disponibilidad, [class*="sold"], [class*="agotad"], .error-message:has-text("agotad"), .error-message:has-text("disponib")',
  noSeatsAvailable: '.no-seats, .sin-asientos, [class*="no-seat"]',
  errorMessage: '.error, .mensaje-error, .alert-error, .notification--error',
  sofaSection: '.v-seat-picker-area--category-138-0000000002',
  showtimeAttributeModal: 'aside.v-modal--generic.showtime-attribute-modal[role="dialog"]',
  showtimeAttributeModalAcceptButton: 'aside.v-modal--generic.showtime-attribute-modal button',
  showtimeAttributeModalCloseButton: 'aside.v-modal--generic.showtime-attribute-modal .v-modal__close',
};
