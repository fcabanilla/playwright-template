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
  expectPasswordRuleState,
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

  async fillConfirmEmail(email: string): Promise<void> {
    await this.page.fill(SIGNUP_SELECTORS.confirmEmailInput, email);
  }

  async fillDateOfBirth(date: string): Promise<void> {
    await this.page.fill(SIGNUP_SELECTORS.dateOfBirthInput, date);
  }

  async fillMobileNumber(mobile: string): Promise<void> {
    await this.page.fill(SIGNUP_SELECTORS.mobileNumberInput, mobile);
  }

  async selectFavoriteCinema(cinema: string): Promise<void> {
    await this.page.waitForSelector(SIGNUP_SELECTORS.primarySiteDropdownButton, { state: 'visible', timeout: 10000 });
    await this.page.locator(SIGNUP_SELECTORS.primarySiteDropdownButton).scrollIntoViewIfNeeded();
    await this.page.click(SIGNUP_SELECTORS.primarySiteDropdownButton);
    await this.page.waitForSelector(SIGNUP_SELECTORS.favoriteCinemaDropdownList, { state: 'visible' });
    const itemSelector = SIGNUP_SELECTORS.favoriteCinemaDropdownItem(cinema);
    await this.page.click(itemSelector);
  }

  async fillNationalId(id: string): Promise<void> {
    await this.page.fill(SIGNUP_SELECTORS.nationalIdInput, id);
  }

  async clickAddPromoCodeButton(): Promise<void> {
    await this.page.click(SIGNUP_SELECTORS.promoCodeInput + ' ~ button');
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.fill(SIGNUP_SELECTORS.passwordInput, password);
  }

  async acceptTerms(): Promise<void> {
    await this.page.check(SIGNUP_SELECTORS.termsCheckbox);
  }

  async checkTermsAndConditionsCheckbox(): Promise<void> {
    await this.page.evaluate(() => {
      const checkbox = document.querySelector('#v-member-sign-up-form-field__terms-and-conditions-input') as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  async submit(): Promise<void> {
    await this.page.click(SIGNUP_SELECTORS.submitButton);
  }

  async fillData({
    name,
    lastName,
    email,
    birthDate,
    phone,
    favoriteCinema,
    id,
    password
  }: {
    name: string;
    lastName: string;
    email: string;
    birthDate: string;
    phone: string;
    favoriteCinema: string;
    id: string;
    password: string;
  }) {
    await this.fillFirstName(name);
    await this.fillLastName(lastName);
    await this.fillEmail(email);
    await this.fillConfirmEmail(email); // Confirmación de email debe ser igual al email
    await this.fillDateOfBirth(birthDate);
    await this.fillMobileNumber(phone);
    await this.selectFavoriteCinema(favoriteCinema);
    await this.fillNationalId(id);
    await this.fillPassword(password);
  }

  async clickRegister() {
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

  async validatePasswordFields(): Promise<void> {
    const page = this.page;

    await test.step('Validate all rules neutral at start', async () => {
      for (let i = 0; i < 5; i++) {
        await expectPasswordRuleState(page, i, 'neutral');
      }
    });

    await test.step('Validate only lowercase valid', async () => {
      await page.fill(SIGNUP_SELECTORS.passwordInput, 'a');
      await page.click(SIGNUP_SELECTORS.firstNameInput);
      await page.waitForTimeout(100);
      await expectPasswordRuleState(page, 0, 'invalid'); // mayúscula
      await expectPasswordRuleState(page, 1, 'valid');   // minúscula
      await expectPasswordRuleState(page, 2, 'invalid'); // número
      await expectPasswordRuleState(page, 3, 'invalid'); // especial
      await expectPasswordRuleState(page, 4, 'invalid'); // min 10
    });

    await test.step('Validate only uppercase valid', async () => {
      await page.fill(SIGNUP_SELECTORS.passwordInput, 'A');
      await page.click(SIGNUP_SELECTORS.firstNameInput);
      await page.waitForTimeout(100);
      await expectPasswordRuleState(page, 0, 'valid');
      await expectPasswordRuleState(page, 1, 'invalid');
      await expectPasswordRuleState(page, 2, 'invalid');
      await expectPasswordRuleState(page, 3, 'invalid');
      await expectPasswordRuleState(page, 4, 'invalid');
    });

    await test.step('Validate only number valid', async () => {
      await page.fill(SIGNUP_SELECTORS.passwordInput, '1');
      await page.click(SIGNUP_SELECTORS.firstNameInput);
      await page.waitForTimeout(100);
      await expectPasswordRuleState(page, 0, 'invalid');
      await expectPasswordRuleState(page, 1, 'invalid');
      await expectPasswordRuleState(page, 2, 'valid');
      await expectPasswordRuleState(page, 3, 'invalid');
      await expectPasswordRuleState(page, 4, 'invalid');
    });

    await test.step('Validate only special char valid', async () => {
      await page.fill(SIGNUP_SELECTORS.passwordInput, '@');
      await page.click(SIGNUP_SELECTORS.firstNameInput);
      await page.waitForTimeout(100);
      await expectPasswordRuleState(page, 0, 'invalid');
      await expectPasswordRuleState(page, 1, 'invalid');
      await expectPasswordRuleState(page, 2, 'invalid');
      await expectPasswordRuleState(page, 3, 'valid');
      await expectPasswordRuleState(page, 4, 'invalid');
    });

    await test.step('Validate only min 10 chars valid', async () => {
      await page.fill(SIGNUP_SELECTORS.passwordInput, 'abcdefghij');
      await page.click(SIGNUP_SELECTORS.firstNameInput);
      await page.waitForTimeout(100);
      await expectPasswordRuleState(page, 0, 'invalid');
      await expectPasswordRuleState(page, 1, 'valid');
      await expectPasswordRuleState(page, 2, 'invalid');
      await expectPasswordRuleState(page, 3, 'invalid');
      await expectPasswordRuleState(page, 4, 'valid');
    });

    await test.step('Validate all rules valid', async () => {
      await page.fill(SIGNUP_SELECTORS.passwordInput, 'Abcdef12@#');
      await page.click(SIGNUP_SELECTORS.firstNameInput);
      await page.waitForTimeout(100);
      for (let i = 0; i < 5; i++) {
        await expectPasswordRuleState(page, i, 'valid');
      }
    });
  }
}
