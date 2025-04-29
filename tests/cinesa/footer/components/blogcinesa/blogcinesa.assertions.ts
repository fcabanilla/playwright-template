import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function assertBlogCinesaNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.test.step('Validating Blog de Cinesa page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
