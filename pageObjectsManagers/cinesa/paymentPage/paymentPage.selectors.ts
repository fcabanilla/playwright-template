export const paymentPageSelectors = {
  root: '#vista-payment',

  giftCard: {
    // Accordion item that contains the "Gift Card" text specifically
    accordionItem:
      '.payment-method-accordion-item:has(span:text("Gift Card")), .accordion-plus:has(.generic-header:has-text("tarjeta regalo"))',

    // Header inside that specific item
    header:
      '.payment-method-accordion-item:has(span:text("Gift Card")) .accordion-plus__header, .accordion-plus:has(.generic-header:has-text("tarjeta regalo")) .accordion-plus__header',

    // Expandable content (to verify visibility)
    content:
      '.payment-method-accordion-item:has(span:text("Gift Card")) .accordion-plus__content, .accordion-plus:has(.generic-header:has-text("tarjeta regalo")) .accordion-plus__content',

    // Specific inputs (using stable IDs)
    cardNumberInput: '#v-gift-card-payment-form-field__card-number-input',
    pinInput: '#v-gift-card-payment-form-field__pin-input',

    // Button to ADD the gift card (inside the gift card form)
    addButton:
      '.payment-method-accordion-item:has(span:text("Gift Card")) button[type="submit"], form.v-gift-card-payment-form button[type="submit"]',
  },

  mainPayment: {
    // Final payment button (outside the gift card accordion)
    payButton: '#payment-button-submit',
    // Robust fallback: submit button NOT inside a payment-method accordion or gift card form
    payButtonFallback:
      'button.v-order-payment-form-connector__payment-button, button.v-form__submit-button:not(div.payment-method-accordion-item button):not(form.v-gift-card-payment-form button)',
    // "Pagar ahora" button shown when gift card covers 100% of the order
    completeOrderButton: 'button.v-order-payment-form__complete-order',
  },
} as const;
