import { Page } from '@playwright/test';
import { LOGIN_SELECTORS } from './login.selectors';

/**
 * The Login Page Object Model.
 * Contains methods to interact with the login page.
 */
export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Clicks the "Continuar como invitado" button.
   */
  async clickContinueAsGuest(): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.continueAsGuestButton).click();
  }

  /**
   * Rellena los campos de email y password en el login.
   */
  async fillData() {
    const email = `${'matiasslpknt08'}@${'gmail.com'}`;
    const password = 'EstoEsUnaPrueba.1';
    await this.page.fill(LOGIN_SELECTORS.emailInput, email);
    await this.page.fill(LOGIN_SELECTORS.passwordInput, password);
  }

  /**
   * Hace click en el botón de submit del login.
   */
  async clickSubmit() {
    await this.page.click(LOGIN_SELECTORS.submitButton);
  }
}
