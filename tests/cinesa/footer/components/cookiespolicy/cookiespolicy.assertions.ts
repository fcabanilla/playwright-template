import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertCookiesPolicyNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Cookies Policy page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
