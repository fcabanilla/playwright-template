import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertCodeOfConductNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Code of Conduct page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
