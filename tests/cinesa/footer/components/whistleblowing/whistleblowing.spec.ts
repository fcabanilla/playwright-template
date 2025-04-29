import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './whistleblowing.data';
import { assertWhistleblowingNavigation } from './whistleblowing.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Whistleblowing Policy Tests', () => {
  test.beforeEach(async ({ cookieBanner, whistleblowing }) => {
    await whistleblowing.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Whistleblowing Policy display and layout', async ({ page, footer }, testInfo) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickPoliticaDenuncia()  // (Optionally, later update method name if desired)
    ]);
    await newPage.waitForLoadState('networkidle');
    await takeScreenshot(newPage, testInfo, 'Whistleblowing Policy display and layout');
    await newPage.close();
  });

  test('Whistleblowing Policy redirection test', async ({ page, footer }) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickPoliticaDenuncia()
    ]);
    await newPage.waitForLoadState('networkidle');
    await assertWhistleblowingNavigation(newPage, expectedUrl);
    await newPage.close();
  });
});
