import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './unlimitedConditions.data';
import { assertUnlimitedConditionsNavigation } from './unlimitedConditions.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('UNLIMITED CARD Conditions Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('UNLIMITED CARD Conditions page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickCondicionesUnlimited();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'UNLIMITED CARD Conditions display and layout');
  });

  test('UNLIMITED CARD Conditions page redirection test', async ({ page, footer }) => {
    await footer.clickCondicionesUnlimited();
    await page.waitForLoadState('networkidle');
    await assertUnlimitedConditionsNavigation(page, expectedUrl);
  });
});