import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertPurchaseConditionsNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Purchase Conditions page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
