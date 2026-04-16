import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { expectedUrl } from './unlimitedConditions.data';
import { assertUnlimitedConditionsNavigation } from './unlimitedConditions.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('UNLIMITED CARD Conditions Tests', () => {
  test.beforeEach(async ({ footer }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');
    await enrichTestMetadata(testInfo);

    await footer.navigateToHome();
  });

  test('Footer · Unlimited Card Conditions · Display & Layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('UNLIMITED CARD Conditions page display and layout');
    await footer.clickCondicionesUnlimited();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(
      page,
      testInfo,
      'UNLIMITED CARD Conditions display and layout'
    );
  });

  test(
    'Footer · Unlimited Card Conditions · Navigate · Redirect',
    {
      tag: ['@footer', '@unlimitedconditions', '@cinesa', '@broken-prod'],
    },
    async ({ page, footer }) => {
      await allure.story(
        'UNLIMITED CARD Conditions navigation and URL validation'
      );
      await footer.clickCondicionesUnlimited();
      await page.waitForLoadState('networkidle');
      await assertUnlimitedConditionsNavigation(page, expectedUrl);
    }
  );
});
