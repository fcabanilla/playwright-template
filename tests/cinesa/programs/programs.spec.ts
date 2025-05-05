import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { ProgramsPage } from '../../../pageObjectsManagers/cinesa/programs/programs.page';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertProgramsRedirection } from './programs.assertions';

test.describe('Programs Page', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('TC: https://se-ocg.atlassian.net/browse/COMS-16804', async () => {});
  });

  test('Programs unlimited display and layout from URL', async ({ page, unlimitedProgramsPage, cookieBanner }) => {
    await test.step('Navigate to Programs page', async () => {
      await page.goto('https://www.cinesa.es/unlimited/informacion/');
    });
    await cookieBanner.acceptCookies();
    await unlimitedProgramsPage.waitForProgramsUnlimitedPage();
    await takeScreenshot(page, test.info());
  });

  test('Programs unlimited display and layout from home page', async ({ page, unlimitedProgramsPage, cookieBanner, navbar }) => {
    await test.step('Navigate to Home page', async () => {
      await page.goto('https://www.cinesa.es/');
    });
    await cookieBanner.acceptCookies();
    await navbar.navigateToPrograms();

    const programsPage = new ProgramsPage(page);
    await programsPage.waitForProgramsPage();
    await programsPage.clickUnlimitedButton();

    await unlimitedProgramsPage.waitForProgramsPage();
    await takeScreenshot(page, test.info());
  });

  test('Programs page display and layout', async ({ page, navbar, cookieBanner }, testInfo) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToPrograms();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Programs page display and layout');
  });

  test('Cinesa Programs page redirection test', async ({ page, navbar, cookieBanner }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToPrograms();
    await page.waitForLoadState('networkidle');
    assertProgramsRedirection(page);
  });
});
