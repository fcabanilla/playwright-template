import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertSalasPremiumNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Salas Premium page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
