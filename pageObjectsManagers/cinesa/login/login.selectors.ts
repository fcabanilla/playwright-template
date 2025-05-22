/**
 * Selectors for the Login page.
 */
export const LOGIN_SELECTORS = {
  continueAsGuestButton: 'button.v-button--color-secondary.btn--transparent--bordered--medium',
  emailInput: '#v-member-sign-in-form-field__email-input',
  passwordInput: '#v-member-sign-in-form-field__password-input',
  submitButton: 'button[type="submit"].v-form__submit-button',
  emailInputError: '#v-member-sign-in-form-field__email-input_help-text',
  passwordInputError: '#v-member-sign-in-form-field__password-input_help-text',
  loginError: '.v-member-sign-in-form-field--password .v-input-wrapper + .v-input-help-text, .v-form__error-message',
};
