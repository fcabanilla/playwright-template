import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { expectedUrl } from './codeOfConduct.data';
import { assertCodeOfConductNavigation } from './codeOfConduct.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Code of Conduct Tests', () => {
  test.beforeEach(async ({ footer }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');
    await enrichTestMetadata(testInfo);

    await footer.navigateToHome();
  });

  test(
    'Footer · Code of Conduct · Display & Layout',
    {
      tag: ['@footer', '@codeofconduct', '@cinesa', '@broken-prod'],
    },
    async ({ page, footer }, testInfo) => {
      await allure.story('Code of Conduct page display and layout');
      await footer.clickCodigoConducta();
      await page.waitForLoadState('networkidle');
      await takeScreenshot(
        page,
        testInfo,
        'Code of Conduct display and layout'
      );
    }
  );

  test('Footer · Code of Conduct · Navigate · Redirect', async ({
    page,
    footer,
  }) => {
    await allure.story('Code of Conduct navigation and URL validation');
    await footer.clickCodigoConducta();
    await page.waitForLoadState('networkidle');
    await assertCodeOfConductNavigation(page, expectedUrl);
  });
});
