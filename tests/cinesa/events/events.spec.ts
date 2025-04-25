import { test, expect } from '../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './events.data';
import { assertEventsNavigation } from './events.assertions';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Eventos Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, events }) => {
    await events.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Eventos page display and layout', async ({ page, events }, testInfo) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      events.clickEventos()
    ]);
    await newPage.waitForLoadState('networkidle');
    await takeScreenshot(newPage, testInfo, 'Eventos display and layout');
    await newPage.close();
  });

  test('Eventos page redirection test', async ({ page, events }) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      events.clickEventos()
    ]);
    await newPage.waitForLoadState('networkidle');
    await assertEventsNavigation(newPage, expectedUrl);
    await newPage.close();
  });

  test('validate new tab and link', async ({ page, events }) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      events.clickEventos()
    ]);
    await newPage.waitForLoadState('networkidle');
    await expect(newPage).toHaveURL(expectedUrl);
    await newPage.close();
  });
});
