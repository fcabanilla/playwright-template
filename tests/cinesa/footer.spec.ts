import { test, expect } from '@playwright/test';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookieBanner';
import { Footer } from '../../pageObjectsManagers/cinesa/footer';
import {
  assertFooterElementsVisible,
  assertNavigateToBlog,
} from './footer.assertions';

test.describe('Cinesa Footer Tests', () => {
  let footer: Footer;
  let cookieBanner: CookieBanner;

  test.beforeEach(async ({ page }) => {
    footer = new Footer(page);
    cookieBanner = new CookieBanner(page);

    await footer.navigateToHome();

    // Aceptar cookies si es necesario
    const acceptButton = page.locator('#onetrust-accept-btn-handler');
    if (await acceptButton.isVisible()) {
      await cookieBanner.acceptCookies();
    }
  });

  test('should display all footer elements', async ({ page }) => {
    await assertFooterElementsVisible(page, footer.selectors);
  });

  test('should navigate to Cinesa blog page and validate URL', async ({ page }) => {
    await assertNavigateToBlog(page, footer.selectors);
  });
});
