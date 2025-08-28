import { test } from '../../../fixtures/uci/playwright.fixtures';
import { NavbarAssertions } from './navbar.assertions';
import { baseUrl, internalNavItems, testUrls } from './navbar.data';

test.describe('UCI Cinemas Navbar Tests', () => {
  let navbarAssertions: NavbarAssertions;

  test.beforeEach(async ({ page, navbar, promoModal, cookieBanner }) => {
    navbarAssertions = new NavbarAssertions(page);

    // 1. Navigate to the homepage
    await navbar.navigateToHome();

    // 2. Handle promotional modal FIRST (it blocks everything)
    await promoModal.waitAndCloseModal();

    // 3. Accept cookies after closing the modal
    await cookieBanner.acceptCookies();
  });

  test('should display navbar elements correctly', async () => {
    await navbarAssertions.expectNavbarElementsVisible();
  });

  test('should navigate to cinemas section', async ({ navbar }) => {
    await navbar.navigateToCinemas();
    await navbarAssertions.expectNavClick(testUrls.cinema);
  });

  test('should navigate to movies section', async ({ navbar }) => {
    await navbar.navigateToMovies();
    await navbarAssertions.expectNavClick(testUrls.film);
  });

  test('should navigate to experiences section', async ({ navbar }) => {
    await navbar.navigateToExperiences();
    await navbarAssertions.expectNavClick(testUrls.esperienze);
  });

  test('should navigate to membership section', async ({ navbar }) => {
    await navbar.navigateToMembership();
    await navbarAssertions.expectNavClick(testUrls.membership);
  });

  test('should click on logo and return to home', async ({ navbar }) => {
    // First navigate to another page
    await navbar.navigateToCinemas();
    await navbarAssertions.expectNavClick(testUrls.cinema);

    // Then click on the logo
    await navbar.clickLogo();
    await navbarAssertions.expectHomeUrl(baseUrl);
  });

  test('should handle promotional modal correctly', async () => {
    // The promotional modal is handled automatically in beforeEach
    await navbarAssertions.expectHomeUrl(baseUrl);
    await navbarAssertions.expectPromoModalClosed();
  });
});
