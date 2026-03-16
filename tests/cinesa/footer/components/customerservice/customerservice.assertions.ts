import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertCustomerServiceNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Customer Service page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
