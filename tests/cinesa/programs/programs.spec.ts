import { test } from '../../../fixtures/cinesa/playwright.fixtures';

test.describe('Programs Page', () => {
  test('Take screenshot of Programs page', async ({ page, programsPage, cookieBanner }) => {
    await test.step('Navigate to Programs page', async () => {
      await page.goto('https://www.cinesa.es/unlimited/informacion/');
    });

    await cookieBanner.acceptCookies();
    await programsPage.waitForProgramsPage();
    await programsPage.takeScreenshot(test.info());
  });
});
