import { expect, Page } from '@playwright/test';
import { LOGIN_SELECTORS } from '../../../pageObjectsManagers/cinesa/login/login.selectors';

export async function expectLoginErrorVisible(page: Page) {
  await expect(page.locator(LOGIN_SELECTORS.loginError)).toBeVisible();
}

export async function expectEmailErrorVisible(page: Page) {
  await expect(page.locator(LOGIN_SELECTORS.emailInputError)).toBeVisible();
}

export async function expectPasswordErrorVisible(page: Page) {
  await expect(page.locator(LOGIN_SELECTORS.passwordInputError)).toBeVisible();
}
