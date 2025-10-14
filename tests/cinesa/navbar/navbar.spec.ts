import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { NavbarAssertions } from './navbar.assertions';
import { baseUrl, internalNavItems, externalNavItem } from './navbar.data';

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
    // baseUrl is imported from navbar.data

    // Use imported baseUrl

    // const { baseUrl } = getNavbarData();
    await navbar.clickLogo();
    await navbarAssertions.expectHomeUrl(baseUrl);
  });

  test('should click each navbar element and navigate accordingly DEMO test', async ({
    navbar,
  }) => {
    for (const item of internalNavItems) {
      // Ensure selectorKey is typed before indexing selectors
      const key = item.selectorKey as keyof typeof navbar.selectors;
      await navbarAssertions.expectNavClick(
        navbar.selectors[key],
        item.expectedUrl
      );
      await navbar.navigateToHome();
    }
    const externalKey =
      externalNavItem.selectorKey as keyof typeof navbar.selectors;
    await navbarAssertions.expectExternalNavClick(
      navbar.selectors[externalKey],
      externalNavItem.expectedUrl
    );
  });
});
