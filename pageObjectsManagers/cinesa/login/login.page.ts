import { WebActions } from '../../../core/webactions/webActions';
import { LOGIN_SELECTORS } from './login.selectors';
import { loginTestData } from '../../../tests/cinesa/login/login.data';
import { allure } from 'allure-playwright';

/**
 * The Login Page Object Model.
 * Contains methods to interact with the login page.
 */
export class LoginPage {
  private readonly selectors = LOGIN_SELECTORS;

  constructor(private readonly webActions: WebActions) {}

  /**
   * Clicks the "Continuar como invitado" button.
   */
  async clickContinueAsGuest(): Promise<void> {
    await allure.step('Continue as guest', async () => {
      await this.webActions.waitForVisible(
        this.selectors.continueAsGuestButton,
        20000,
        'Wait for "Continue as Guest" button'
      );
      await this.webActions.click(
        this.selectors.continueAsGuestButton,
        'Click "Continue as Guest" button'
      );
    });
  }

  /**
   * Rellena los campos de email y password en el login con datos válidos.
   */
  async fillData() {
    await allure.step('Fill login form with valid credentials', async () => {
      await this.webActions.fill(
        this.selectors.emailInput,
        loginTestData.validCredentials.email
      );
      await this.webActions.fill(
        this.selectors.passwordInput,
        loginTestData.validCredentials.password
      );
    });
  }

  /**
   * Rellena los campos de email y password con credenciales inválidas.
   */
  async fillInvalidData() {
    await allure.step('Fill login form with invalid credentials', async () => {
      await this.webActions.fill(
        this.selectors.emailInput,
        loginTestData.invalidCredentials.email
      );
      await this.webActions.fill(
        this.selectors.passwordInput,
        loginTestData.invalidCredentials.password
      );
    });
  }

  /**
   * Hace click en el botón de submit del login.
   */
  async clickSubmit() {
    await allure.step('Click login submit button', async () => {
      await this.webActions.click(this.selectors.submitButton);
    });
  }
}
