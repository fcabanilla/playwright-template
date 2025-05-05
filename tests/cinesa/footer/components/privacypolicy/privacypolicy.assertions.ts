import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function assertPrivacyPolicyNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.test.step('Validating Privacy Policy page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
