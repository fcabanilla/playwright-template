// tests/cinesa/navbar.spec.ts
import { test } from '../../fixtures/cinesa/playwright.fixtures';
import {
  assertNavbarElementsVisible,
  assertHomeUrl,
  assertNavClick,
  assertExternalNavClick,
} from './navbar.assertions';
import { baseUrl, internalNavItems, externalNavItem } from './navbar.data';

test.describe('Cinesa Navbar Tests', () => {
  test.beforeEach(async ({ navbar, cookieBanner }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('should display all navbar elements', async ({ navbar, page }) => {
    await assertNavbarElementsVisible(page, navbar.selectors);
  });

  test('should click logo and stay on home', async ({ navbar, page }) => {
    await navbar.clickLogo();
    await assertHomeUrl(page, baseUrl);
  });

  test('should click each navbar element and navigate accordingly', async ({
    navbar,
    page,
  }) => {
    for (const item of internalNavItems) {
      await assertNavClick(
        page,
        navbar.selectors[item.selectorKey],
        item.expectedUrl
      );
      await navbar.navigateToHome();
    }
    await assertExternalNavClick(
      page,
      navbar.selectors[externalNavItem.selectorKey],
      externalNavItem.expectedUrl
    );
  });
});
