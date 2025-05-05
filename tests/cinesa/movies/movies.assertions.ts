import { expect, Page } from '@playwright/test';
import { MOVIES_URL } from './movies.data';

export function assertMoviesRedirection(page: Page): void {
	expect(page.url()).toBe(MOVIES_URL);
}
