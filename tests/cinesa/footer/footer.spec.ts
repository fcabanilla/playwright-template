import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import {
  assertFooterCoreElementsVisible,
  assertFooterElementsVisible,
  assertNavigateToBlog,
  assertFooterCompanyNavigation,
  assertFooterSocialMediaLinks,
  assertFooterLegalLinks,
  assertFooterAppLinks,
} from './footer.assertions';

test.describe('Cinesa Footer Tests', () => {
  test.beforeEach(async ({ page, footer, cookieBanner }) => {
    await footer.navigateToHome();

    const acceptButton = page.locator('#onetrust-accept-btn-handler');
    if (await acceptButton.isVisible()) {
      await cookieBanner.acceptAllCookies();
    }
  });

  test('@smoke @critical @footer @cinesa should display essential footer navigation elements', async ({ page, footer }) => {
    await assertFooterCoreElementsVisible(page, footer.selectors);
  });

  test('@regression @footer @cinesa should display all footer elements comprehensively', async ({ page, footer }) => {
    await assertFooterElementsVisible(page, footer.selectors);
  });

  test('@smoke @footer @navigation @cinesa should navigate to blog and validate URL', async ({ page, footer }) => {
    await assertNavigateToBlog(page, footer.selectors);
  });

  test('@smoke @footer @company @cinesa should navigate to company pages', async ({ page, footer }) => {
    await assertFooterCompanyNavigation(page, footer.selectors);
  });

  test('@fast @footer @social @cinesa should display all social media links', async ({ page, footer }) => {
    await assertFooterSocialMediaLinks(page, footer.selectors);
  });

  test('@medium @footer @legal @cinesa should display legal documentation links', async ({ page, footer }) => {
    await assertFooterLegalLinks(page, footer.selectors);
  });

  test('@medium @footer @apps @cinesa should display mobile app download links', async ({ page, footer }) => {
    await assertFooterAppLinks(page, footer.selectors);
  });
});
