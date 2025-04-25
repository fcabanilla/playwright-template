import { expect, Page } from '@playwright/test';
import { COUPONS_URL } from './coupons.data';

export function assertCouponsRedirection(page: Page): void {
	expect(page.url()).toBe(COUPONS_URL);
}