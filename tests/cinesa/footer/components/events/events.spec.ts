import {
  test,
  expect,
} from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './events.data';
import { assertEventsNavigation } from './events.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Eventos Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, events }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await events.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test(
    'Eventos page display and layout',
    {
      tag: [
        '@footer',
        '@events',
        '@cinesa',
        '@display',
        '@medium',
        '@OCG-3287',
      ],
    },
    async ({ page, events }, testInfo) => {
      await allure.story('OCG-3287 - Eventos page display and layout');
      const context = page.context();
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        events.clickEventos(),
      ]);
      await newPage.waitForLoadState('networkidle');
      await takeScreenshot(newPage, testInfo, 'Eventos display and layout');
      await newPage.close();
    }
  );

  test(
    'Eventos page redirection test',
    {
      tag: [
        '@footer',
        '@events',
        '@cinesa',
        '@navigation',
        '@medium',
        '@OCG-3287',
      ],
    },
    async ({ page, events }) => {
      await allure.story('OCG-3287 - Eventos navigation and URL validation');
      const context = page.context();
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        events.clickEventos(),
      ]);
      await newPage.waitForLoadState('networkidle');
      await assertEventsNavigation(newPage, expectedUrl);
      await newPage.close();
    }
  );

  test(
    'validate new tab and link',
    {
      tag: [
        '@footer',
        '@events',
        '@cinesa',
        '@navigation',
        '@fast',
        '@OCG-3287',
      ],
    },
    async ({ page, events }) => {
      await allure.story('OCG-3287 - Eventos new tab and link validation');
      const context = page.context();
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        events.clickEventos(),
      ]);
      await newPage.waitForLoadState('networkidle');
      await expect(newPage).toHaveURL(expectedUrl);
      await newPage.close();
    }
  );
});
