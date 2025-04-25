import { expect, Page } from '@playwright/test';
import { CINEMAS_URL } from './cinemas.data';

export function assertCinemasRedirection(page: Page): void {
	expect(page.url()).toBe(CINEMAS_URL);
}
