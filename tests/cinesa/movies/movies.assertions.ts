import { expect, Page } from '@playwright/test';
import { MOVIES_URL } from './movies.data';

export function assertMoviesRedirection(page: Page): void {
	expect(page.url()).toBe(MOVIES_URL);
}

/**
 * Asserts that the movie title is displayed on the page.
 */
export async function assertMovieTitleDisplayed(page: Page, expectedTitle: string): Promise<void> {
  const movieTitleLocator = page.locator('.v-film-title__text');
  await movieTitleLocator.waitFor({ state: 'visible', timeout: 5000 });
  const actualTitle = await movieTitleLocator.innerText();
  expect(actualTitle).toBe(expectedTitle);
}
