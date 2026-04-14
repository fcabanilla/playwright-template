import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import { loginSelectors, LoginSelectors } from '../../../../../core/selectors/checkout';
import { WebActions } from '../../../../../core/webactions/webActions';

/**
 * PRAETOR Login Page Object — Cinesa checkout step 2 (Registro).
 *
 * MCP-verified from lab `/compra/inicio-de-sesion/` (2026-03-31).
 * Primary flow: guest checkout (no account needed for PRAETOR tests).
 */
export class PraetorLogin {
  private readonly webActions: WebActions;
  private readonly selectors: LoginSelectors;

  constructor(page: Page) {
    this.webActions = new WebActions(page);
    this.selectors = loginSelectors;
  }

  /** Wait for login page to be ready */
  async waitForLoginPage(): Promise<void> {
    await allure.step('Wait for login page', async () => {
      await this.webActions.waitForVisible(
        this.selectors.guestCheckoutButton,
        15000,
        'guestCheckoutButton'
      );
    });
  }

  /** Continue as guest — primary PRAETOR path */
  async continueAsGuest(): Promise<void> {
    await allure.step('Continue as guest', async () => {
      await this.webActions.click(
        this.selectors.guestCheckoutButton,
        'guestCheckoutButton'
      );
    });
  }

  /** Login with email and password */
  async login(email: string, password: string): Promise<void> {
    await allure.step('Login with credentials', async () => {
      await this.webActions.fill(
        this.selectors.emailInput,
        email,
        'emailInput'
      );
      await this.webActions.fill(
        this.selectors.passwordInput,
        password,
        'passwordInput'
      );
      await this.webActions.click(this.selectors.loginButton, 'loginButton');
    });
  }

  /**
   * Try to continue as guest — handles optional login step.
   *
   * In some lab configurations the login/registration step is skipped
   * and the flow proceeds directly from seat selection to ticket picker.
   * This method waits briefly for the login page and, if it appears,
   * clicks "Continuar como invitado". Otherwise it returns silently.
   */
  async tryLoginAsGuest(waitMs = 5000): Promise<void> {
    await allure.step('Try login as guest (optional step)', async () => {
      try {
        await this.webActions.waitForVisible(
          this.selectors.guestCheckoutButton,
          waitMs,
          'guestCheckoutButton'
        );
        await this.webActions.click(
          this.selectors.guestCheckoutButton,
          'guestCheckoutButton'
        );
      } catch {
        // Login step was skipped — continue
      }
    });
  }

  /** Check if guest checkout button is visible */
  async isGuestCheckoutVisible(): Promise<boolean> {
    return await allure.step('Check guest checkout visibility', async () => {
      return await this.webActions.isVisible(
        this.selectors.guestCheckoutButton
      );
    });
  }

  /** Check if login form is visible */
  async isLoginFormVisible(): Promise<boolean> {
    return await allure.step('Check login form visibility', async () => {
      return await this.webActions.isVisible(this.selectors.emailInput);
    });
  }

  /** Check if register button is visible */
  async isRegisterButtonVisible(): Promise<boolean> {
    return await allure.step('Check register button visibility', async () => {
      return await this.webActions.isVisible(this.selectors.registerButton);
    });
  }
}
