import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './infantil.data';
import { assertInfantilNavigation } from './infantil.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Infantil y Colegios Tests', () => {
  test.beforeEach(async ({ page, infantil }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await infantil.navigateToHome();
  });

  test(
    'Footer · Infantil y Colegios · Display & Layout',
    {
      tag: ['@footer', '@infantil', '@cinesa'],
    },
    async ({ page, infantil }, testInfo) => {
      await allure.story('Infantil y Colegios page display and layout');
      await infantil.clickInfantilYColegios();
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
    async ({ page, infantil }) => {
      await allure.story('Infantil y Colegios navigation and URL validation');
      await infantil.clickInfantilYColegios();
      await page.waitForLoadState('networkidle');
      await assertInfantilNavigation(page, expectedUrl);
    }
  );
});
