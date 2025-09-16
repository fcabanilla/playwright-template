import { getCinesaConfig, CinesaEnvironment } from '../../../config/environments';
import { test, expect } from '../../../fixtures/cinesa/playwright.fixtures';
import { PurchaseSummary } from '../../../pageObjectsManagers/cinesa/purchaseSummary/purchaseSummary.page';

test.describe('Purchase Summary', () => {
  test.beforeEach(async ({ page, navbar }) => {
    await navbar.navigateToHome();
  });
});
