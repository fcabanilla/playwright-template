import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { expectedUrl } from './transparency.data';
import { assertTransparencyNavigation } from './transparency.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Transparency Tests', () => {
  test.beforeEach(async ({ page, footer }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');
    await enrichTestMetadata(testInfo);

    await footer.navigateToHome();
  });

  test(
    'Footer · Transparency · Display & Layout',
    {
      tag: ['@footer', '@transparency', '@cinesa', '@broken-prod'],
    },
    async ({ page, footer }, testInfo) => {
      await allure.story('Transparency page display and layout');
      await footer.clickTransparencia();
      await page.waitForLoadState('networkidle');
      await takeScreenshot(page, testInfo, 'Transparency display and layout');
    }
  );

  test(
    'Footer · Transparency · Navigate · Redirect',
    {
      tag: ['@footer', '@transparency', '@cinesa', '@broken-prod'],
    },
    async ({ page, footer }) => {
      await allure.story('Transparency navigation and URL validation');
      await footer.clickTransparencia();
      await page.waitForLoadState('networkidle');
      await assertTransparencyNavigation(page, expectedUrl);
    }
  );
});
