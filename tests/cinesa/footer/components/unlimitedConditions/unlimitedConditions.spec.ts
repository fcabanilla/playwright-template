import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './unlimitedConditions.data';
import { assertUnlimitedConditionsNavigation } from './unlimitedConditions.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('UNLIMITED CARD Conditions Tests', () => {
  test.beforeEach(async ({ footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
  });

  test('UNLIMITED CARD Conditions page display and layout', async ({
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
    'UNLIMITED CARD Conditions page redirection test',
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
