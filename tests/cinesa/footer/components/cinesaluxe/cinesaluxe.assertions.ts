import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertCinesaLuxeNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Cinesa Luxe page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
