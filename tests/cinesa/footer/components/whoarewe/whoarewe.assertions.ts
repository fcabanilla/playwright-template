import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function assertWhoAreWeNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.test.step('Validating Who Are We page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
