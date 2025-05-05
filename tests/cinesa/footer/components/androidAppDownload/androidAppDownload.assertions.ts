import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function assertAndroidAppDownloadNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.test.step('Validating Android App Download page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
