import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertMoviesRedirection } from './movies.assertions';

test.describe('Cinesa Movies Tests', () => {
  test('Movies page display and layout', async ({ page, navbar, cookieBanner }, testInfo) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    await takeScreenshot(page, testInfo, 'Movies page display and layout');
  });

  test('Cinesa Movies page redirection test', async ({ page, navbar, cookieBanner }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    assertMoviesRedirection(page);
  });
});
