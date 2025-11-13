import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './blogcinesa.data';
import { assertBlogCinesaNavigation } from './blogcinesa.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Blog de Cinesa Tests', () => {
  test.beforeEach(async ({ page, footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
  });

  test('Footer · Blog de Cinesa · Display & Layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Blog de Cinesa page display and layout');
    await footer.clickBlogDeCinesa();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Blog de Cinesa display and layout');
  });

  test('Footer · Blog de Cinesa · Navigate · Redirect', async ({
    page,
    footer,
  }) => {
    await allure.story('Blog de Cinesa navigation and URL validation');
    await footer.clickBlogDeCinesa();
    await page.waitForLoadState('networkidle');
    await assertBlogCinesaNavigation(page, expectedUrl);
  });
});
