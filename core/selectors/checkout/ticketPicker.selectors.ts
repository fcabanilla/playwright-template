/**
 * Shared TicketPicker selectors — Cinesa checkout step 3 (Entradas).
 *
 * MCP-verified from lab + preprod Oasiz.
 */

export interface TicketPickerSelectors {
  ticketRow: string;
  ticketDescription: string;
  ticketTitle: string;
  ticketPrice: string;
  quantityInput: string;
  incrementButton: string;
  decrementButton: string;
  confirmButton: string;
  promoAccordionHeader: string;
  promoAccordionContent: string;
  promoInput: string;
  promoComboButton: string;
  promoComboOptionText: string;
  promoContinueButton: string;
  glassesModal: string;
  glassesModalSelectButton: string;
  glassesModalPrimaryButton: string;
  glassesModalFooterButton: string;
  glassesModalAnyButton: string;
}

export const ticketPickerSelectors: TicketPickerSelectors = {
  ticketRow: '.v-ticket-picker-table-row',
  ticketDescription: '.v-ticket-picker-table-row-details__description',
  ticketTitle:
    '.v-ticket-picker-table-row__item .v-ticket-picker-table-row-details__description',
  ticketPrice: '.v-ticket-picker-table-row__current-price',
  quantityInput: '.v-number-input__input',
  incrementButton: '.v-number-input__button--plus',
  decrementButton: '.v-number-input__button--minus',
  confirmButton:
    '.order-totals-button-container .v-button, .order-totals-button',
  promoAccordionHeader: '[data-testid="accordion-header"]',
  promoAccordionContent: '.accordion-plus.open .accordion-plus__content',
  promoInput: '#v-ticket-redemption-code-form-field__code-input',
  promoComboButton:
    '#v-ticket-redemption-code-form-field__type-input-button',
  promoComboOptionText: '.v-dropdown-list .v-dropdown-option__text',
  promoContinueButton: '.v-form__submit-button',
  glassesModal: 'aside.v-modal.glasses-modal[role="dialog"]',
  glassesModalSelectButton:
    'aside.v-modal.glasses-modal[role="dialog"] button:has-text("Seleccionar")',
  glassesModalPrimaryButton:
    'aside.v-modal.glasses-modal[role="dialog"] .v-modal-footer .v-button--color-primary',
  glassesModalFooterButton:
    'aside.v-modal.glasses-modal[role="dialog"] .v-modal-footer button',
  glassesModalAnyButton:
    'aside.v-modal.glasses-modal[role="dialog"] button',
} as const;
