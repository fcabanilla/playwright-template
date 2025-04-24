import { Page, test } from '@playwright/test';
import { SIGNUP_SELECTORS } from './signup.selectors';
import {
  expectEmailErrorVisible,
  expectConfirmEmailErrorVisible,
  expectFirstNameErrorVisible,
  expectLastNameErrorVisible,
  expectDateOfBirthErrorVisible,
  expectMobileNumberErrorVisible,
  expectNationalIdErrorVisible,
  expectPasswordErrorVisible,
  expectNoEmailErrors,
} from '../../../tests/cinesa/signup/signup.assertions';

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

  async validateMandatoryFields(): Promise<void> {
    const page = this.page;

    await test.step('Validate email mandatory', async () => {
      await page.click(SIGNUP_SELECTORS.emailInput);
      await page.waitForTimeout(100);
      await page.click(SIGNUP_SELECTORS.confirmEmailInput);
      await page.waitForTimeout(100);
      await expectEmailErrorVisible(page);
    });

    await test.step('Validate confirm email mandatory', async () => {
      await page.click(SIGNUP_SELECTORS.confirmEmailInput);
      await page.waitForTimeout(100);
      await page.click(SIGNUP_SELECTORS.firstNameInput);
      await page.waitForTimeout(100);
      await expectConfirmEmailErrorVisible(page);
    });

    await test.step('Validate first name mandatory', async () => {
      await page.click(SIGNUP_SELECTORS.firstNameInput);
      await page.waitForTimeout(100);
      await page.click(SIGNUP_SELECTORS.lastNameInput);
      await page.waitForTimeout(100);
      await expectFirstNameErrorVisible(page);
    });

    await test.step('Validate last name mandatory', async () => {
      await page.click(SIGNUP_SELECTORS.lastNameInput);
      await page.waitForTimeout(100);
      await page.click(SIGNUP_SELECTORS.dateOfBirthInput);
      await page.waitForTimeout(100);
      await expectLastNameErrorVisible(page);
    });

    await test.step('Validate date of birth mandatory', async () => {
      await page.click(SIGNUP_SELECTORS.dateOfBirthInput);
      await page.waitForTimeout(100);
      await page.click(SIGNUP_SELECTORS.mobileNumberInput);
      await page.waitForTimeout(100);
      await expectDateOfBirthErrorVisible(page);
    });

    await test.step('Validate mobile number mandatory', async () => {
      await page.click(SIGNUP_SELECTORS.mobileNumberInput);
      await page.waitForTimeout(100);
      await page.click(SIGNUP_SELECTORS.nationalIdInput);
      await page.waitForTimeout(100);
      await expectMobileNumberErrorVisible(page);
    });

    await test.step('Validate national id mandatory', async () => {
      await page.click(SIGNUP_SELECTORS.nationalIdInput);
      await page.waitForTimeout(100);
      await page.click(SIGNUP_SELECTORS.passwordInput);
      await page.waitForTimeout(100);
      await expectNationalIdErrorVisible(page);
    });

    await test.step('Validate password mandatory', async () => {
      await page.click(SIGNUP_SELECTORS.passwordInput);
      await page.waitForTimeout(100);
      await page.click(SIGNUP_SELECTORS.modalContainer);
      await page.waitForTimeout(100);
      await expectPasswordErrorVisible(page);
    });
  }

  async validateEmailFields(): Promise<void> {
    const page = this.page;

    await test.step('Validate email without @', async () => {
      await page.fill(SIGNUP_SELECTORS.emailInput, 'invalidemail.com');
      await page.click(SIGNUP_SELECTORS.confirmEmailInput);
      await page.waitForTimeout(100);
      await expectEmailErrorVisible(page);
    });

    await test.step('Validate email without domain', async () => {
      await page.fill(SIGNUP_SELECTORS.emailInput, 'user@');
      await page.click(SIGNUP_SELECTORS.confirmEmailInput);
      await page.waitForTimeout(100);
      await expectEmailErrorVisible(page);
    });

    await test.step('Validate email without dot after @', async () => {
      await page.fill(SIGNUP_SELECTORS.emailInput, 'user@mail');
      await page.click(SIGNUP_SELECTORS.confirmEmailInput);
      await page.waitForTimeout(100);
      await expectEmailErrorVisible(page);
    });

    await test.step('Validate email with dot but no TLD', async () => {
      await page.fill(SIGNUP_SELECTORS.emailInput, 'user@mail.');
      await page.click(SIGNUP_SELECTORS.confirmEmailInput);
      await page.waitForTimeout(100);
      await expectEmailErrorVisible(page);
    });

    await test.step('Validate valid email with random TLD', async () => {
      await page.fill(SIGNUP_SELECTORS.emailInput, 'user@mail.la');
      await page.fill(SIGNUP_SELECTORS.confirmEmailInput, 'user@mail.la');
      await page.click(SIGNUP_SELECTORS.firstNameInput);
      await page.waitForTimeout(100);
      await expectNoEmailErrors(page);
    });

    await test.step('Validate email confirmation mismatch', async () => {
      await page.fill(SIGNUP_SELECTORS.emailInput, 'test@example.com');
      await page.fill(SIGNUP_SELECTORS.confirmEmailInput, 'different@example.com');
      await page.click(SIGNUP_SELECTORS.firstNameInput);
      await page.waitForTimeout(100);
      await expectConfirmEmailErrorVisible(page);
    });
  }
}
