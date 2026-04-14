/**
 * Shared Payment selectors — Cinesa checkout step 6 (Payment).
 *
 * MCP-verified from preprod Oasiz (2026-04-13).
 */

export interface PaymentSelectors {
  /** Page heading "Pago del pedido" */
  heading: string;
  /** Gift card section header (collapsible) */
  giftCardHeader: string;
  /** Gift card number input */
  giftCardNumberInput: string;
  /** Gift card PIN input */
  giftCardPinInput: string;
  /** Gift card "Pagar" button */
  giftCardPayButton: string;
  /** Gift card form container */
  giftCardFormContainer: string;
  /** Redsys main container div */
  redsysContainer: string;
  /** Redsys card option (selected state) */
  redsysCardOption: string;
  /** Redsys "Tarjeta de crédito" label */
  redsysCreditCardLabel: string;
  /** Order total amount */
  totalAmount: string;
  /** Management fees link */
  managementFeesLink: string;
  /** Countdown timer */
  countdownTimer: string;
  /** Stepper — current active step */
  stepperActive: string;
  /** Back button */
  backButton: string;
}

export const paymentSelectors: PaymentSelectors = {
  heading: 'h1',
  giftCardHeader: 'h3:has-text("tarjeta regalo")',
  giftCardNumberInput: 'input[aria-label="Número de la tarjeta"], spinbutton[aria-label="Número de la tarjeta"]',
  giftCardPinInput: 'input[aria-label="PIN"]',
  giftCardPayButton: '.v-gift-card-payment-form button:has-text("Pagar")',
  giftCardFormContainer: '.gift-card-payment-form-container',
  redsysContainer: '.redsys-connector-mainDiv-style',
  redsysCardOption: '.redsys-connector-innerDiv-style-card-selected',
  redsysCreditCardLabel: '.redsys-connector-main-title-label',
  totalAmount: '.v-order-totals__total-price',
  managementFeesLink: 'a[href*="gastos-de-gestion"]',
  countdownTimer: '#ticket-order-expiry-countdown',
  stepperActive: 'img[alt="Stepper On"]',
  backButton: '.v-showtime-summary__back-button, [class*="back"]',
};
