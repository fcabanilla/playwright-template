import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertAndroidAppDownloadNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Android App Download page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
