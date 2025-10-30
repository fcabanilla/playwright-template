import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertBlogCinesaNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Blog de Cinesa page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
