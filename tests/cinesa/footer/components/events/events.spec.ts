import {
  test,
  expect,
} from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import {
  enrichTestMetadata,
  linkJiraTickets,
} from '../../../../../core/allure/allureMetadata';
import { expectedUrl } from './events.data';
import { assertEventsNavigation } from './events.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Eventos Tests', () => {
  test.beforeEach(async ({ page, footer }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');
    await enrichTestMetadata(testInfo);

    await footer.navigateToHome();
  });

  test(
    'Footer · Eventos · Display & Layout',
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
    async ({ page, footer }, testInfo) => {
      await allure.story('OCG-3287 - Eventos page display and layout');
      await linkJiraTickets('OCG-3287 - Eventos page display and layout');
      const context = page.context();
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        footer.clickEventos(),
      ]);
      await newPage.waitForLoadState('networkidle');
      await takeScreenshot(newPage, testInfo, 'Eventos display and layout');
      await newPage.close();
    }
  );

  test(
    'Footer · Eventos · Navigate · Redirect',
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
    async ({ page, footer }) => {
      await allure.story('OCG-3287 - Eventos navigation and URL validation');
      await linkJiraTickets('OCG-3287 - Eventos navigation and URL validation');
      const context = page.context();
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        footer.clickEventos(),
      ]);
      await newPage.waitForLoadState('networkidle');
      await assertEventsNavigation(newPage, expectedUrl);
      await newPage.close();
    }
  );

  test(
    'Footer · Eventos · Validate · New tab & link',
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
    async ({ page, footer }) => {
      await allure.story('OCG-3287 - Eventos new tab and link validation');
      await linkJiraTickets('OCG-3287 - Eventos new tab and link validation');
      const context = page.context();
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        footer.clickEventos(),
      ]);
      await newPage.waitForLoadState('networkidle');
      await expect(newPage).toHaveURL(expectedUrl);
      await newPage.close();
    }
  );
});
