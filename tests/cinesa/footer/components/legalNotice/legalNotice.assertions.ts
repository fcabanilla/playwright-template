import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertLegalNoticeNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Legal Notice page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
