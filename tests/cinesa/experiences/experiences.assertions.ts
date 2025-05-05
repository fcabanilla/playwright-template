import { expect, Page } from '@playwright/test';
import { EXPERIENCES_URL } from './experiences.data';

export function assertExperiencesRedirection(page: Page): void {
	expect(page.url()).toBe(EXPERIENCES_URL);
}
