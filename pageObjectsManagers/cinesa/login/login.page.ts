import { WebActions } from '../../../core/webactions/webActions';
import { LOGIN_SELECTORS } from './login.selectors';

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
    await this.webActions.waitForVisible(this.selectors.continueAsGuestButton, 10000);
    await this.webActions.click(this.selectors.continueAsGuestButton);
  }

  /**
   * Rellena los campos de email y password en el login.
   */
  async fillData() {
    const email = `${'matiasslpknt08'}@${'gmail.com'}`;
    const password = 'EstoEsUnaPrueba.1';
    await this.webActions.fill(this.selectors.emailInput, email);
    await this.webActions.fill(this.selectors.passwordInput, password);
  }

  /**
   * Hace click en el botón de submit del login.
   */
  async clickSubmit() {
    await this.webActions.click(this.selectors.submitButton);
  }
}
