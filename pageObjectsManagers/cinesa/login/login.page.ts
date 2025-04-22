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
}
