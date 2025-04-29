import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function assertCinesaBusinessNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.test.step('Validating Cinesa Business page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
