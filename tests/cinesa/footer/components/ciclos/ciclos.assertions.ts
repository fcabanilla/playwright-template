import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertCiclosNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Ciclos page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
