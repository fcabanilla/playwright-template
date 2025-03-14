import { test } from '@playwright/test';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookieBanner';
import { Navbar } from '../../pageObjectsManagers/cinesa/navbar';
import {
  assertNavbarElementsVisible,
  assertHomeUrl,
  assertNavClick,
  assertExternalNavClick,
} from './navbar.assertions';
import { baseUrl, internalNavItems, externalNavItem } from './navbar.data';

test.describe('Cinesa Navbar Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al home y aceptar cookies
    const navbar = new Navbar(page);
    const cookieBanner = new CookieBanner(page);

    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('should display all navbar elements', async ({ page }) => {
    const navbar = new Navbar(page);
    await assertNavbarElementsVisible(page, navbar.selectors);
  });

  test('should click logo and stay on home', async ({ page }) => {
    const navbar = new Navbar(page);
    await navbar.clickLogo();
    await assertHomeUrl(page, baseUrl);
  });

  test('should click each navbar element and navigate accordingly', async ({
    page,
  }) => {
    const navbar = new Navbar(page);

    // Validación para enlaces internos
    for (const item of internalNavItems) {
      await assertNavClick(
        page,
        navbar.selectors[item.selectorKey],
        item.expectedUrl
      );
      // Navegar de vuelta a la home para el siguiente check
      await navbar.navigateToHome();
    }

    // Validación para enlace externo ('bonos')
    await assertExternalNavClick(
      page,
      navbar.selectors[externalNavItem.selectorKey],
      externalNavItem.expectedUrl
    );
  });
});
