import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertPrivacyPolicyNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Privacy Policy page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
