import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { PROGRAMS_URL } from './programs.data';

/**
 * Asserts that the current URL matches the Programs page URL.
 * @param page - Playwright Page object
 */
export async function assertProgramsRedirection(page: Page): Promise<void> {
  await allure.test.step('Verify Programs page redirection', async () => {
    expect(page.url()).toBe(PROGRAMS_URL);
  });
}
