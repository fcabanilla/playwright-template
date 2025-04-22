import { Page } from '@playwright/test';
import { SIGNUP_SELECTORS } from './signup.selectors';

export class SignupPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.page.fill(SIGNUP_SELECTORS.firstNameInput, firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.page.fill(SIGNUP_SELECTORS.lastNameInput, lastName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.fill(SIGNUP_SELECTORS.emailInput, email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.fill(SIGNUP_SELECTORS.passwordInput, password);
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.page.fill(SIGNUP_SELECTORS.confirmPasswordInput, password);
  }

  async acceptTerms(): Promise<void> {
    await this.page.check(SIGNUP_SELECTORS.termsCheckbox);
  }

  async submit(): Promise<void> {
    await this.page.click(SIGNUP_SELECTORS.submitButton);
  }

}
