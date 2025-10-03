import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { Navbar } from '../../../pageObjectsManagers/cinesa/navbar/navbar.page';
import { NavbarAssertions } from './navbar.assertions';
import { getNavbarData } from './navbar.data';
import { setupCloudflareContextAndPage } from '../../../core/webactions/setupCloudflareContextAndPage';
import type { BrowserContext, Page } from '@playwright/test';

test.describe('Cinesa Navbar Tests - Cloudflare Safe', () => {
  let context: BrowserContext;
  let page: Page;
  let navbarAssertions: NavbarAssertions;

  test.beforeEach(async ({ browser }) => {
    ({ context, page } = await setupCloudflareContextAndPage(browser));
    navbarAssertions = new NavbarAssertions(page);
  });

  test('@smoke @critical @navbar @cinesa should display all navbar elements safely', async () => {
    await navbarAssertions.expectNavbarElementsVisible();
    await context.close();
  });

  test('@fast @navbar @cinesa should click logo and stay on home safely', async ({
    navbar,
  }) => {
    const { baseUrl } = getNavbarData();
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
