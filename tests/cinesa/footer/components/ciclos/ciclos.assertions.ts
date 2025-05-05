import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function assertCiclosNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.test.step('Validating Ciclos page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
