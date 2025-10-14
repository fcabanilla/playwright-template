import { Page } from '@playwright/test';
import { LOGIN_SELECTORS } from './login.selectors';
import { WebActions } from '../../../core/webactions/webActions';

/**
 * The Login Page Object Model.
 * Following ADR-0009: Page Objects delegate to WebActions, never access Playwright API directly
 */
export class LoginPage {
  private readonly webActions: WebActions;

  constructor(page: Page) {
    this.webActions = new WebActions(page);
  }

  /**
   * Clicks the "Continuar como invitado" button.
   */
  async clickContinueAsGuest(): Promise<void> {
    await this.webActions.click(LOGIN_SELECTORS.continueAsGuestButton);
  }

  /**
   * Rellena los campos de email y password en el login.
   *
   * @param email - Email address (from testAccounts or custom)
   * @param password - Password (from testAccounts or custom)
   *
   * @example
   * // Using test accounts from config
   * import { cinesaTestAccounts } from '../../../config/testAccounts';
   * const account = cinesaTestAccounts.valid.loyalty;
   * await loginPage.fillData(account.email, account.password);
   *
   * @example
   * // Using custom credentials
   * await loginPage.fillData('user@example.com', 'SecurePassword123!');
   */
  async fillData(email: string, password: string) {
    await this.webActions.fill(LOGIN_SELECTORS.emailInput, email);
    await this.webActions.fill(LOGIN_SELECTORS.passwordInput, password);
  }

  /**
   * Hace click en el botón de submit del login.
   */
  async clickSubmit(): Promise<void> {
    await this.webActions.clickWithOverlayHandling(
      LOGIN_SELECTORS.submitButton
    );
  }

  /**
   * Wait for login process to complete
   */
  async waitForLoginComplete(): Promise<void> {
    await this.webActions.waitForLoad();
    await this.webActions.wait(2000);
  }
}
