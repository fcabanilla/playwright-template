import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertCinesaBusinessNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Cinesa Business page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
