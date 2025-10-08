import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { NavbarAssertions } from './navbar.assertions';
import { getNavbarData } from './navbar.data';

test.describe('Cinesa Navbar Tests', () => {
  let navbarAssertions: NavbarAssertions;

  test.beforeEach(async ({ page, navbar, cookieBanner }) => {
    navbarAssertions = new NavbarAssertions(page);
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('should display all navbar elements', async () => {
    await navbarAssertions.expectNavbarElementsVisible();
  });

  test('should click logo and stay on home', async ({ navbar }) => {
    const { baseUrl } = getNavbarData();
    await navbar.clickLogo();
    await navbarAssertions.expectHomeUrl(baseUrl);
  });

  test('should click each navbar element and navigate accordingly DEMO test', async ({
    navbar,
  }) => {
    const { internalNavItems, externalNavItem } = getNavbarData();
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
