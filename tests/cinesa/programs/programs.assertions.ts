import { expect, Page } from '@playwright/test';
import { PROGRAMS_URL } from './programs.data';

export function assertProgramsRedirection(page: Page): void {
	expect(page.url()).toBe(PROGRAMS_URL);
}
