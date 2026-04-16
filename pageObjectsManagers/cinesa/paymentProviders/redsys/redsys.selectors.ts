export const redsysSelectors = {
  // Redsys usually runs in an iframe or dedicated page
  // Common Redsys production/test selectors
  cardNumber: '#card-number',
  expirationDate: '#card-expiration',
  cvv: '#card-cvv',
  // Use the ID directly as per HTML.
  // IMPORTANT: The button might be initially disabled or change class when valid.
  // HTML shows: <button class="btn btn-lg btn-accept validColor" type="button" id="divImgAceptar" ...>
  submitButton: '#divImgAceptar',

  // Alternative generic selectors if IDs change
  cardNumberInput: 'input[name="card_number"]',
  expiryInput: 'input[name="card_expiration_date"]',
  cvvInput: 'input[name="card_cvv"]',
  payButton: 'input[type="submit"][value="Pagar"]',

  // Feedback elements
  successMessage: '.success-message',
  errorMessage: '.error-message',

  // Redsys 3DS Simulator
  threeDSSimulator: {
    successRadio: 'input[name="option"][value="1"]',
    denyRadio: 'input[name="option"][value="2"]',
    cancelRadio: 'input[name="option"][value="3"]',
    submitButton:
      '#boton, input#boton, input.boton, input[type="button"][value="Enviar"], input[type="button"][value="Send"], input[value="Enviar"], input[value="Send"]',
    header: '#cabecera, #header',
    loading: '#loading',
  },

  // Merchant parameters (often hidden)
  merchantCode: 'input[name="Ds_Merchant_MerchantCode"]',
} as const;
