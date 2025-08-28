import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { Navbar } from '../../../pageObjectsManagers/cinesa/navbar/navbar.page';
import { NavbarAssertions } from './navbar.assertions';
import { baseUrl } from './navbar.data';

test.describe('Cinesa Navbar Tests - Cloudflare Safe', () => {
  let navbarAssertions: NavbarAssertions;

  test.beforeEach(async ({ page, navbar, cookieBanner }) => {
    navbarAssertions = new NavbarAssertions(page);

    // Use Cloudflare-safe navigation for Cinesa
    const success = await navbar.navigateToHomeWithCloudflareHandling();
    if (!success) {
      throw new Error(
        'Failed to navigate past Cloudflare protection on Cinesa'
      );
    }

    await cookieBanner.acceptCookies();
  });

  test('@smoke @critical @navbar @cinesa should display all navbar elements safely', async () => {
    await navbarAssertions.expectNavbarElementsVisible();
  });

  test('@fast @navbar @cinesa should click logo and stay on home safely', async ({
    navbar,
  }) => {
    await navbar.clickLogo();
    await navbarAssertions.expectHomeUrl(baseUrl);
  });

  test('@fast @navbar @cinesa should navigate to cinemas section safely', async ({
    navbar,
  }) => {
    await navbar.navigateToCinemas();
    // Add URL expectation here based on Cinesa's URL structure
  });

  test('@fast @navbar @cinesa should navigate to movies section safely', async ({
    navbar,
  }) => {
    await navbar.navigateToMovies();
    // Add URL expectation here based on Cinesa's URL structure
  });
});
