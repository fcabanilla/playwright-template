import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertExperiencesRedirection } from './experiences.assertions';

test.describe('Cinesa Experiences Tests', () => {
  test('Experiences page display and layout', async ({ page, navbar, cookieBanner }, testInfo) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToExperiences();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Experiences page display and layout');
  });

  test('Cinesa Experiences page redirection test', async ({ page, navbar, cookieBanner }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToExperiences();
    await page.waitForLoadState('networkidle');
    assertExperiencesRedirection(page);
  });
});