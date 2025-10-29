import { test } from '@playwright/test';
import { WebActions } from '../../../core/webactions/webActions';
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

/**
 * SignupPage - Manages signup form interactions
 * Follows ADR-0009: Uses WebActions abstraction, no direct Playwright API access.
 * 
 * All browser interactions delegated to WebActions:
 * - click, fill, waitForSelector → webActions methods
 * - evaluate() for JavaScript execution → webActions.evaluate()
 * - Dynamic waiting for error messages → webActions.waitForSelector()
 */
export class SignupPage {
  private readonly webActions: WebActions;

  constructor(webActions: WebActions) {
    this.webActions = webActions;
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.webActions.fill(SIGNUP_SELECTORS.firstNameInput, firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.webActions.fill(SIGNUP_SELECTORS.lastNameInput, lastName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.webActions.fill(SIGNUP_SELECTORS.emailInput, email);
  }

  async fillConfirmEmail(email: string): Promise<void> {
    await this.webActions.fill(SIGNUP_SELECTORS.confirmEmailInput, email);
  }

  async fillDateOfBirth(date: string): Promise<void> {
    await this.webActions.fill(SIGNUP_SELECTORS.dateOfBirthInput, date);
  }

  async fillMobileNumber(mobile: string): Promise<void> {
    await this.webActions.fill(SIGNUP_SELECTORS.mobileNumberInput, mobile);
  }

  async selectFavoriteCinema(cinema: string): Promise<void> {
    await this.webActions.waitForSelector(
      SIGNUP_SELECTORS.primarySiteDropdownButton,
      { timeout: 10000 }
    );
    await this.webActions.scrollIntoView(SIGNUP_SELECTORS.primarySiteDropdownButton);
    await this.webActions.click(SIGNUP_SELECTORS.primarySiteDropdownButton);
    await this.webActions.waitForSelector(SIGNUP_SELECTORS.favoriteCinemaDropdownList);
    const itemSelector = SIGNUP_SELECTORS.favoriteCinemaDropdownItem(cinema);
    await this.webActions.click(itemSelector);
  }

  async fillNationalId(id: string): Promise<void> {
    await this.webActions.fill(SIGNUP_SELECTORS.nationalIdInput, id);
  }

  async clickAddPromoCodeButton(): Promise<void> {
    await this.webActions.click(SIGNUP_SELECTORS.promoCodeInput + ' ~ button');
  }

  async fillPassword(password: string): Promise<void> {
    await this.webActions.fill(SIGNUP_SELECTORS.passwordInput, password);
  }

  async acceptTerms(): Promise<void> {
    await this.webActions.click(SIGNUP_SELECTORS.termsCheckbox);
  }

  async checkTermsAndConditionsCheckbox(): Promise<void> {
    await this.webActions.evaluate(() => {
      const checkbox = document.querySelector(
        '#v-member-sign-up-form-field__terms-and-conditions-input'
      ) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  async submit(): Promise<void> {
    await this.webActions.click(SIGNUP_SELECTORS.submitButton);
  }

  async fillData({
    name,
    lastName,
    email,
    birthDate,
    phone,
    favoriteCinema,
    id,
    password,
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
    await this.fillConfirmEmail(email);
    await this.fillDateOfBirth(birthDate);
    await this.fillMobileNumber(phone);
    await this.selectFavoriteCinema(favoriteCinema);
    await this.fillNationalId(id);
    await this.fillPassword(password);
  }

  async clickRegister() {
    await this.webActions.click(SIGNUP_SELECTORS.submitButton);
  }

  async validateMandatoryFields(): Promise<void> {
    const page = this.webActions.getPage();

    await test.step('Validate email mandatory', async () => {
      await this.webActions.click(SIGNUP_SELECTORS.emailInput);
      await this.webActions.click(SIGNUP_SELECTORS.confirmEmailInput);
      // Assertion auto-waits for element to be visible
      await expectEmailErrorVisible(page);
    });

    await test.step('Validate confirm email mandatory', async () => {
      await this.webActions.click(SIGNUP_SELECTORS.confirmEmailInput);
      await this.webActions.click(SIGNUP_SELECTORS.firstNameInput);
      // Assertion auto-waits for element to be visible
      await expectConfirmEmailErrorVisible(page);
    });

    await test.step('Validate first name mandatory', async () => {
      await this.webActions.click(SIGNUP_SELECTORS.firstNameInput);
      await this.webActions.click(SIGNUP_SELECTORS.lastNameInput);
      // Assertion auto-waits for element to be visible
      await expectFirstNameErrorVisible(page);
    });

    await test.step('Validate last name mandatory', async () => {
      await this.webActions.click(SIGNUP_SELECTORS.lastNameInput);
      await this.webActions.click(SIGNUP_SELECTORS.dateOfBirthInput);
      // Assertion auto-waits for element to be visible
      await expectLastNameErrorVisible(page);
    });

    await test.step('Validate date of birth mandatory', async () => {
      await this.webActions.click(SIGNUP_SELECTORS.dateOfBirthInput);
      await this.webActions.click(SIGNUP_SELECTORS.mobileNumberInput);
      // Assertion auto-waits for element to be visible
      await expectDateOfBirthErrorVisible(page);
    });

    await test.step('Validate mobile number mandatory', async () => {
      await this.webActions.click(SIGNUP_SELECTORS.mobileNumberInput);
      await this.webActions.click(SIGNUP_SELECTORS.nationalIdInput);
      // Assertion auto-waits for element to be visible
      await expectMobileNumberErrorVisible(page);
    });

    await test.step('Validate national id mandatory', async () => {
      await this.webActions.click(SIGNUP_SELECTORS.nationalIdInput);
      await this.webActions.click(SIGNUP_SELECTORS.passwordInput);
      // Assertion auto-waits for element to be visible
      await expectNationalIdErrorVisible(page);
    });

    await test.step('Validate password mandatory', async () => {
      await this.webActions.click(SIGNUP_SELECTORS.passwordInput);
      await this.webActions.click(SIGNUP_SELECTORS.nationalIdInput);
      // Assertion auto-waits for element to be visible
      await expectPasswordErrorVisible(page);
    });
  }

  async validateEmailFields(): Promise<void> {
    const page = this.webActions.getPage();

    await test.step('Validate email without @', async () => {
      await this.webActions.fill(
        SIGNUP_SELECTORS.emailInput,
        'invalidemail.com'
      );
      await this.webActions.click(SIGNUP_SELECTORS.confirmEmailInput);
      // Assertion auto-waits for element to be visible
      await expectEmailErrorVisible(page);
    });

    await test.step('Validate email without domain', async () => {
      await this.webActions.fill(SIGNUP_SELECTORS.emailInput, 'user@');
      await this.webActions.click(SIGNUP_SELECTORS.confirmEmailInput);
      // Assertion auto-waits for element to be visible
      await expectEmailErrorVisible(page);
    });

    await test.step('Validate email without dot after @', async () => {
      await this.webActions.fill(SIGNUP_SELECTORS.emailInput, 'user@mail');
      await this.webActions.click(SIGNUP_SELECTORS.confirmEmailInput);
      // Assertion auto-waits for element to be visible
      await expectEmailErrorVisible(page);
    });

    await test.step('Validate email with dot but no TLD', async () => {
      await this.webActions.fill(SIGNUP_SELECTORS.emailInput, 'user@mail.');
      await this.webActions.click(SIGNUP_SELECTORS.confirmEmailInput);
      // Assertion auto-waits for element to be visible
      await expectEmailErrorVisible(page);
    });

    await test.step('Validate valid email with random TLD', async () => {
      await this.webActions.fill(SIGNUP_SELECTORS.emailInput, 'user@mail.la');
      await this.webActions.fill(
        SIGNUP_SELECTORS.confirmEmailInput,
        'user@mail.la'
      );
      await this.webActions.click(SIGNUP_SELECTORS.firstNameInput);
      // Assertion auto-waits for elements to be hidden
      await expectNoEmailErrors(page);
    });

    await test.step('Validate email confirmation mismatch', async () => {
      await this.webActions.fill(
        SIGNUP_SELECTORS.emailInput,
        'test@example.com'
      );
      await this.webActions.fill(
        SIGNUP_SELECTORS.confirmEmailInput,
        'different@example.com'
      );
      await this.webActions.click(SIGNUP_SELECTORS.firstNameInput);
      // Assertion auto-waits for element to be visible
      await expectConfirmEmailErrorVisible(page);
    });
  }

  async validatePasswordFields(): Promise<void> {
    const page = this.webActions.getPage();

    await test.step('Validate all rules neutral at start', async () => {
      for (let i = 0; i < 5; i++) {
        await expectPasswordRuleState(page, i, 'neutral');
      }
    });

    await test.step('Validate only lowercase valid', async () => {
      await this.webActions.fill(SIGNUP_SELECTORS.passwordInput, 'a');
      await this.webActions.click(SIGNUP_SELECTORS.firstNameInput);
      // Assertions auto-wait for password rules to update
      await expectPasswordRuleState(page, 0, 'invalid'); // mayúscula
      await expectPasswordRuleState(page, 1, 'valid'); // minúscula
      await expectPasswordRuleState(page, 2, 'invalid'); // número
      await expectPasswordRuleState(page, 3, 'invalid'); // especial
      await expectPasswordRuleState(page, 4, 'invalid'); // min 10
    });

    await test.step('Validate only uppercase valid', async () => {
      await this.webActions.fill(SIGNUP_SELECTORS.passwordInput, 'A');
      await this.webActions.click(SIGNUP_SELECTORS.firstNameInput);
      // Assertions auto-wait for password rules to update
      await expectPasswordRuleState(page, 0, 'valid');
      await expectPasswordRuleState(page, 1, 'invalid');
      await expectPasswordRuleState(page, 2, 'invalid');
      await expectPasswordRuleState(page, 3, 'invalid');
      await expectPasswordRuleState(page, 4, 'invalid');
    });

    await test.step('Validate only number valid', async () => {
      await this.webActions.fill(SIGNUP_SELECTORS.passwordInput, '1');
      await this.webActions.click(SIGNUP_SELECTORS.firstNameInput);
      // Assertions auto-wait for password rules to update
      await expectPasswordRuleState(page, 0, 'invalid');
      await expectPasswordRuleState(page, 1, 'invalid');
      await expectPasswordRuleState(page, 2, 'valid');
      await expectPasswordRuleState(page, 3, 'invalid');
      await expectPasswordRuleState(page, 4, 'invalid');
    });

    await test.step('Validate only special char valid', async () => {
      await this.webActions.fill(SIGNUP_SELECTORS.passwordInput, '@');
      await this.webActions.click(SIGNUP_SELECTORS.firstNameInput);
      // Assertions auto-wait for password rules to update
      await expectPasswordRuleState(page, 0, 'invalid');
      await expectPasswordRuleState(page, 1, 'invalid');
      await expectPasswordRuleState(page, 2, 'invalid');
      await expectPasswordRuleState(page, 3, 'valid');
      await expectPasswordRuleState(page, 4, 'invalid');
    });

    await test.step('Validate only min 10 chars valid', async () => {
      await this.webActions.fill(SIGNUP_SELECTORS.passwordInput, 'abcdefghij');
      await this.webActions.click(SIGNUP_SELECTORS.firstNameInput);
      // Assertions auto-wait for password rules to update
      await expectPasswordRuleState(page, 0, 'invalid');
      await expectPasswordRuleState(page, 1, 'valid');
      await expectPasswordRuleState(page, 2, 'invalid');
      await expectPasswordRuleState(page, 3, 'invalid');
      await expectPasswordRuleState(page, 4, 'valid');
    });

    await test.step('Validate all rules valid', async () => {
      await this.webActions.fill(SIGNUP_SELECTORS.passwordInput, 'Abcdef12@#');
      await this.webActions.click(SIGNUP_SELECTORS.firstNameInput);
      // Assertions auto-wait for password rules to update
      for (let i = 0; i < 5; i++) {
        await expectPasswordRuleState(page, i, 'valid');
      }
    });
  }
}
