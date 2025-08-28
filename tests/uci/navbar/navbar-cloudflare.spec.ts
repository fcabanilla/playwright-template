import { test } from '../../../fixtures/uci/playwright.fixtures';
import { Navbar } from '../../../pageObjectsManagers/uci/navbar/navbar.page';
import { NavbarAssertions } from './navbar.assertions';
import { baseUrl } from './navbar.data';

test.describe('UCI Navbar Tests - Cloudflare Safe', () => {
  let navbarAssertions: NavbarAssertions;

  test.beforeEach(async ({ page, navbar, cookieBanner }) => {
    navbarAssertions = new NavbarAssertions(page);

    // Use Cloudflare-safe navigation
    const success = await navbar.navigateToHomeWithCloudflareHandling();
    if (!success) {
      throw new Error('Failed to navigate past Cloudflare protection');
    }

    await cookieBanner.acceptCookies();
  });

  test('@smoke @critical @navbar @uci should display all navbar elements safely', async () => {
    await navbarAssertions.expectNavbarElementsVisible();
  });

  test('@fast @navbar @uci should click logo and stay on home safely', async ({
    navbar,
  }) => {
    await navbar.clickLogo();
    await navbarAssertions.expectHomeUrl(baseUrl);
  });
});
