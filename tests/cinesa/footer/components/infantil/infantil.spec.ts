import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { expectedUrl } from './infantil.data';
import { assertInfantilNavigation } from './infantil.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Infantil y Colegios Tests', () => {
  test.beforeEach(async ({ page, footer }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');
    await enrichTestMetadata(testInfo);

    await footer.navigateToHome();
  });

  test(
    'Footer · Infantil y Colegios · Display & Layout',
    {
      tag: ['@footer', '@infantil', '@cinesa'],
    },
    async ({ page, footer }, testInfo) => {
      await allure.story('Infantil y Colegios page display and layout');
      await footer.clickInfantilYColegios();
      await page.waitForLoadState('networkidle');
      await takeScreenshot(
        page,
        testInfo,
        'Infantil y Colegios display and layout'
      );
    }
  );

  test(
    'Footer · Infantil y Colegios · Navigate · Redirect',
    {
      tag: ['@footer', '@infantil', '@cinesa', '@broken-prod'],
    },
    async ({ page, footer }) => {
      await allure.story('Infantil y Colegios navigation and URL validation');
      await footer.clickInfantilYColegios();
      await page.waitForLoadState('networkidle');
      await assertInfantilNavigation(page, expectedUrl);
    }
  );
});
