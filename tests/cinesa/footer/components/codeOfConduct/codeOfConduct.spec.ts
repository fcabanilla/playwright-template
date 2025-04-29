import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './codeOfConduct.data';
import { assertCodeOfConductNavigation } from './codeOfConduct.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Code of Conduct Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Code of Conduct page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickCodigoConducta();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Code of Conduct display and layout');
  });

  test('Code of Conduct page redirection test', async ({ page, footer }) => {
    await footer.clickCodigoConducta();
    await page.waitForLoadState('networkidle');
    await assertCodeOfConductNavigation(page, expectedUrl);
  });
});
