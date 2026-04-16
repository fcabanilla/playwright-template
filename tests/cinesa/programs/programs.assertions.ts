import { expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import { PROGRAMS_URL } from './programs.data';

/**
 * Asserts that the current URL matches the Programs page URL.
 * @param page - Playwright Page object
 */
export async function assertProgramsRedirection(page: Page): Promise<void> {
  await allure.step('Verify Programs page redirection', async () => {
    expect(page.url()).toBe(PROGRAMS_URL);
  });
}
