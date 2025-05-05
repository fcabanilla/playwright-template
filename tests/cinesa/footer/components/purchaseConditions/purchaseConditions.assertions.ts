import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function assertPurchaseConditionsNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.test.step('Validating Purchase Conditions page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
