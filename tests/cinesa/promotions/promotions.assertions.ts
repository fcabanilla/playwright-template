import { expect, Page } from '@playwright/test';
import { PROMOTIONS_URL } from './promotions.data';

export function assertPromotionsRedirection(page: Page): void {
	expect(page.url()).toBe(PROMOTIONS_URL);
}
