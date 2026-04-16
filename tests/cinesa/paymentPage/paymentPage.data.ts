export interface PaymentData {
  cardNumber: string;
  pin: string;
}

/**
 * Returns gift card payment data from environment variables.
 * Throws only when actually called, so tests that don't need gift card
 * data are not affected by missing env vars.
 */
export function getGiftCardData(): PaymentData {
  const cardNumber = process.env.PAYMENT_GIFTCARD_NUMBER;
  const pin = process.env.PAYMENT_GIFTCARD_PIN;

  if (!cardNumber || !pin) {
    throw new Error(
      '[Payment Data] Missing required environment variables: PAYMENT_GIFTCARD_NUMBER and/or PAYMENT_GIFTCARD_PIN. ' +
        'Add them to your .env file (see .env.example).'
    );
  }

  return { cardNumber, pin };
}
