import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertModernSlaveryNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Modern Slavery Declaration page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
