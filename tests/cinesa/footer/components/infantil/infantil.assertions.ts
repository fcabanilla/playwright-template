import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function assertInfantilNavigation(page: Page, expectedUrl: string): Promise<void> {
  await allure.step('Validating Infantil y Colegios page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}
