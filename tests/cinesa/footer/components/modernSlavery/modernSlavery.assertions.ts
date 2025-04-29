import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function assertModernSlaveryNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.test.step('Validating Modern Slavery Declaration page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
