import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { expectedUrl } from './workwithus.data';
import { assertWorkWithUsNavigation } from './workwithus.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Work With Us Tests', () => {
  test.beforeEach(async ({ page, footer }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');
    await enrichTestMetadata(testInfo);

    await footer.navigateToHome();
  });

  test('Footer · Work With Us · Display & Layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Work With Us page display and layout');
    await footer.clickTrabajaConNosotros();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Work With Us display and layout');
  });

  test('Footer · Work With Us · Navigate · Redirect', async ({
    page,
    footer,
  }) => {
    await allure.story('Work With Us navigation and URL validation');
    await footer.clickTrabajaConNosotros();
    await page.waitForLoadState('networkidle');
    await assertWorkWithUsNavigation(page, expectedUrl);
  });
});
