import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './modernSlavery.data';
import { assertModernSlaveryNavigation } from './modernSlavery.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Modern Slavery Declaration Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Modern Slavery Declaration display and layout', async ({ page, footer }, testInfo) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickEsclavitudModerna()
    ]);
    await newPage.waitForLoadState('networkidle');
    await takeScreenshot(newPage, testInfo, 'Modern Slavery Declaration display and layout');
    await newPage.close();
  });

  test('Modern Slavery Declaration redirection test', async ({ page, footer }) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickEsclavitudModerna()
    ]);
    await newPage.waitForLoadState('networkidle');
    await assertModernSlaveryNavigation(newPage, expectedUrl);
    await newPage.close();
  });
});
