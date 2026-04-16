/**
 * Shared PurchaseSummary selectors — Cinesa checkout step 5 (Order Review).
 *
 * MCP-verified from preprod Oasiz (2026-04-13).
 */

export interface PurchaseSummarySelectors {
  /** Page heading "Resumen de tu compra" */
  heading: string;
  /** Customer details — First name input */
  firstNameInput: string;
  /** Customer details — Last name input */
  lastNameInput: string;
  /** Customer details — Email input */
  emailInput: string;
  /** Customer details — Phone input */
  phoneInput: string;
  /** Privacy policy + terms checkbox wrapper (clickable div) */
  termsCheckboxWrapper: string;
  /** Privacy policy + terms checkbox input */
  termsCheckboxInput: string;
  /** Main "Continuar" button */
  continueButton: string;
  /** Order total amount */
  totalAmount: string;
  /** Savings amount ("Te has ahorrado") */
  savingsAmount: string;
  /** Ticket summary list items */
  ticketSummaryItems: string;
  /** Edit tickets button */
  editTicketsButton: string;
  /** Email confirmation modal */
  emailConfirmationModal: string;
  /** Email confirmation modal — Confirm button */
  emailConfirmationConfirmButton: string;
  /** Management fees text */
  managementFees: string;
  /** Countdown timer */
  countdownTimer: string;
  /** Stepper — current active step */
  stepperActive: string;
}

export const purchaseSummarySelectors: PurchaseSummarySelectors = {
  heading: 'h1',
  firstNameInput: '#v-customer-details-form-field__given-name-input',
  lastNameInput: '#v-customer-details-form-field__family-name-input',
  emailInput: '#v-customer-details-form-field__email-input',
  phoneInput: '#v-customer-details-form-field__phone-number-input',
  termsCheckboxWrapper: '.v-checkbox-input__button',
  termsCheckboxInput: 'input[value="accept-terms-and-conditions"]',
  continueButton: 'button.v-button--color-primary.v-button--size-large',
  totalAmount: '.order-totals .v-order-totals__total-price, [class*="total"] >> text=/\\d+,\\d+\\s*€/',
  savingsAmount: '.order-totals .v-order-totals__savings-price',
  ticketSummaryItems: '.v-order-summary-item',
  editTicketsButton: 'button:has-text("Entradas")',
  emailConfirmationModal: '.email-confirmation-modal',
  emailConfirmationConfirmButton: '.email-confirmation-modal button.v-button--color-primary',
  managementFees: '[class*="management-fee"], [class*="gastos"]',
  countdownTimer: '#ticket-order-expiry-countdown',
  stepperActive: 'img[alt="Stepper On"]',
};
