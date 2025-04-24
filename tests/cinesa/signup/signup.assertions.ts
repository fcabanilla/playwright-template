import { expect, Page } from '@playwright/test';
import { SIGNUP_SELECTORS } from '../../../pageObjectsManagers/cinesa/signup/signup.selectors';

export async function expectEmailErrorVisible(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.emailInputError)).toBeVisible();
}

export async function expectConfirmEmailErrorVisible(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.confirmEmailInputError)).toBeVisible();
}

export async function expectFirstNameErrorVisible(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.firstNameInputError)).toBeVisible();
}

export async function expectLastNameErrorVisible(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.lastNameInputError)).toBeVisible();
}

export async function expectDateOfBirthErrorVisible(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.dateOfBirthInputError)).toBeVisible();
}

export async function expectMobileNumberErrorVisible(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.mobileNumberInputError)).toBeVisible();
}

export async function expectNationalIdErrorVisible(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.nationalIdInputError)).toBeVisible();
}

export async function expectPasswordErrorVisible(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.passwordInputError)).toBeVisible();
}

export async function expectPasswordErrorRule(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.passwordInputError)).toBeVisible();
}

export async function expectPasswordValid(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.passwordInputError)).toBeHidden();
}

export async function expectNoEmailErrors(page: Page) {
  await expect(page.locator(SIGNUP_SELECTORS.emailInputError)).toBeHidden();
  await expect(page.locator(SIGNUP_SELECTORS.confirmEmailInputError)).toBeHidden();
}

/**
 * Valida el estado visual de una regla de contraseña por índice.
 * @param page Playwright Page
 * @param ruleIndex Índice de la regla (0: mayúscula, 1: minúscula, 2: número, 3: especial, 4: min 10)
 * @param expected 'neutral' | 'valid' | 'invalid'
 */
export async function expectPasswordRuleState(page: Page, ruleIndex: number, expected: 'neutral' | 'valid' | 'invalid') {
  const ruleLocator = page.locator(
    `${SIGNUP_SELECTORS.passwordInputError} ul.v-password-rule-checker-rule-list > li.v-password-rule-checker-rule`
  ).nth(ruleIndex);

  if (expected === 'valid') {
    await expect(ruleLocator).toHaveClass(/v-password-rule-checker-rule--status-valid/);
    await expect(ruleLocator.locator('svg.v-icon--check')).toBeVisible();
  } else if (expected === 'invalid') {
    await expect(ruleLocator).toHaveClass(/v-password-rule-checker-rule--status-invalid/);
    await expect(ruleLocator.locator('svg.v-icon--cross')).toBeVisible();
  } else {
    await expect(ruleLocator).not.toHaveClass(/v-password-rule-checker-rule--status-valid/);
    await expect(ruleLocator).not.toHaveClass(/v-password-rule-checker-rule--status-invalid/);
  }
}
