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
