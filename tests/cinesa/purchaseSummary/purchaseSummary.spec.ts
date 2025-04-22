import { test, expect } from '../../../fixtures/cinesa/playwright.fixtures';
import { PurchaseSummary } from '../../../pageObjectsManagers/cinesa/purchaseSummary/purchaseSummary.page';

test.describe('Purchase Summary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.cinesa.es/'); // Replace with the actual URL of the purchase summary page
  });
});
