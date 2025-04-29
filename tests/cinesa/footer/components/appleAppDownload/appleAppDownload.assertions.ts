import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function assertAppleAppDownloadNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.test.step('Validating Apple App Download page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
