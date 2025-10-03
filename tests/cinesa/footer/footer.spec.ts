import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import {
  assertFooterElementsVisible,
  assertNavigateToBlog,
} from './footer.assertions';

test.describe('Cinesa Footer Tests', () => {
  test.beforeEach(async ({ page, footer, cookieBanner }) => {
    await footer.navigateToHome();

    const acceptButton = page.locator('#onetrust-accept-btn-handler');
    if (await acceptButton.isVisible()) {
      await cookieBanner.acceptCookies();
    }
  });

  test('should display all footer elements', async ({ page, footer }) => {
    await assertFooterElementsVisible(page, footer.selectors);
  });

  test('should navigate to Cinesa blog page and validate URL', async ({ page, footer }) => {
    await assertNavigateToBlog(page, footer.selectors);
  });
});
