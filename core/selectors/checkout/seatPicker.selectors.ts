/**
 * Shared SeatPicker selectors — single source of truth for all platforms.
 *
 * Seat elements are `<a>` tags with class `.v-seat-picker-seat`.
 * Types: --normal, --sofa-left, --sofa-right, --companion, --wheelchair
 * States: --available, --selected, --unavailable (+ --house for blocked)
 * aria-label format: "<Type> <row>-<seatNum>"
 * aria-pressed: "true" when selected, "false" otherwise
 *
 * MCP-verified from lab Oasiz (2026-03-31) + preprod Oasiz (2026-04-13).
 */

export interface SeatPickerSelectors {
  /** Any seat element */
  seat: string;
  /** Available seats (any type) */
  seatAvailable: string;
  /** Currently selected seats */
  seatSelected: string;
  /** Unavailable/blocked seats */
  seatUnavailable: string;
  /** Wheelchair space seats */
  seatWheelchair: string;
  /** Companion seats */
  seatCompanion: string;
  /** Normal (non-sofa) seats */
  seatNormal: string;
  /** Sofa-left seats */
  seatSofaLeft: string;
  /** Sofa-right seats */
  seatSofaRight: string;
  /** Confirm/continue button */
  confirmButton: string;
  /** Seat area container (category grouping) */
  seatArea: string;
  /** Pricing card elements */
  pricingCard: string;
  /** Pricing card label */
  pricingCardLabel: string;
  /** Pricing card price */
  pricingCardPrice: string;
  /** Page heading "Elige tus asientos" */
  heading: string;
  /** Validation warning message */
  validationMessage: string;
  /** Wheelchair confirmation modal */
  wheelchairModal: string;
  /** Wheelchair modal accept button */
  wheelchairModalAccept: string;
  /** Wheelchair modal cancel button */
  wheelchairModalCancel: string;
  /** Generic modal (promotional popup, attribute modal, etc.) */
  genericModal: string;
  /** Generic modal accept/continue button (multi-language) */
  genericModalAccept: string;
  /** Generic modal close button */
  genericModalClose: string;
  /** Screen element in seat map */
  screen: string;
}

export const seatPickerSelectors: SeatPickerSelectors = {
  seat: '.v-seat-picker-seat',
  seatAvailable: '.v-seat-picker-seat--available',
  seatSelected: '.v-seat-picker-seat--selected',
  seatUnavailable: '.v-seat-picker-seat--unavailable',
  seatWheelchair: '.v-seat-picker-seat--wheelchair',
  seatCompanion: '.v-seat-picker-seat--companion',
  seatNormal: '.v-seat-picker-seat--normal',
  seatSofaLeft: '.v-seat-picker-seat--sofa-left',
  seatSofaRight: '.v-seat-picker-seat--sofa-right',
  confirmButton: '.selected-seats-button',
  seatArea: '.v-seat-picker-area',
  pricingCard: '.pricing-card',
  pricingCardLabel: '.pricing-card__label',
  pricingCardPrice: '.pricing-card__price',
  heading: 'h1',
  validationMessage: '.selected-seats-validation li',
  wheelchairModal: 'aside.v-modal.wheelchair-modal[role="dialog"]',
  wheelchairModalAccept:
    'aside.v-modal.wheelchair-modal button:has-text("Continuar"), aside.v-modal.wheelchair-modal button:has-text("Continue")',
  wheelchairModalCancel:
    'aside.v-modal.wheelchair-modal button:has-text("Cancelar"), aside.v-modal.wheelchair-modal button:has-text("Cancel")',
  genericModal: 'aside.v-modal[role="dialog"]',
  genericModalAccept:
    'aside.v-modal button:has-text("Aceptar"), aside.v-modal button:has-text("Accept"), aside.v-modal button:has-text("Continuar"), aside.v-modal button:has-text("Continue"), aside.v-modal button:has-text("I can\'t wait"), aside.v-modal button:has-text("No puedo esperar"), aside.v-modal button.btn--blue--medium',
  genericModalClose:
    'aside.v-modal .v-modal__close, aside.v-modal button[aria-label*="close"], aside.v-modal button[aria-label*="cerrar"], aside.v-modal button[aria-label*="Cerrar"]',
  screen: '.v-seat-picker-screen',
};
