import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { Navbar } from '../../../pageObjectsManagers/cinesa/navbar/navbar.page';
import { NavbarAssertions } from './navbar.assertions';
import { baseUrl, internalNavItems, externalNavItem } from './navbar.data';

test.describe('Cinesa Navbar Tests', () => {
  let navbar: Navbar;
  let navbarAssertions: NavbarAssertions;

  test.beforeEach(async ({ page, cookieBanner }) => {
    navbar = new Navbar(page);
    navbarAssertions = new NavbarAssertions(page);
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('should display all navbar elements', async () => {
    await navbarAssertions.expectNavbarElementsVisible();
  });

  test('should click logo and stay on home', async () => {
    await navbar.clickLogo();
    await navbarAssertions.expectHomeUrl(baseUrl);
  });

  test('should click each navbar element and navigate accordingly', async () => {
    for (const item of internalNavItems) {
      await navbarAssertions.expectNavClick(
        navbar.selectors[item.selectorKey],
        item.expectedUrl
      );
      await navbar.navigateToHome();
    }
    await navbarAssertions.expectExternalNavClick(
      navbar.selectors[externalNavItem.selectorKey],
      externalNavItem.expectedUrl
    );
  });
});
