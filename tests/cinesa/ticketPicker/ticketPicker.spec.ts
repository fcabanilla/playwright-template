import { test, expect } from '../../../fixtures/cinesa/playwright.fixtures';

test.describe('Ticket Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.cinesa.es/');
  });
});
