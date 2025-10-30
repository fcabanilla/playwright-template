import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertWorkWithUsNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Work With Us page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
