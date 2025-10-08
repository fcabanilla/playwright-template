import { test } from '../../../fixtures/cinesa/playwright.fixtures';

test.describe('Purchase Summary', () => {
  test.beforeEach(async ({ page, navbar }) => {
    await navbar.navigateToHome();
  });
});
