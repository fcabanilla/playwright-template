import { test } from '../../../fixtures/uci/playwright.fixtures';
import { baseUrl, testUrls } from './navbar.data';

test.describe(
  'UCI Cinemas Navbar Tests',
  {
    tag: ['@navbar', '@uci'],
  },
  () => {
    test.beforeEach(async ({ navbar, promoModal, cookieBanner }) => {
      // 1. Navigate to the homepage
      await navbar.navigateToHome();

      // 2. Handle promotional modal FIRST (it blocks everything)
      await promoModal.waitAndCloseModal();

      // 3. Accept cookies after closing the modal
      await cookieBanner.acceptCookies();
    });

    test(
      'should display navbar elements correctly',
      { tag: ['@smoke', '@fast', '@critical'] },
      async ({ navbarAssertions }) => {
        await navbarAssertions.expectNavbarElementsVisible();
      }
    );

    test(
      'should navigate to cinemas section',
      {
        tag: ['@navigation', '@fast', '@high'],
      },
      async ({ navbar, navbarAssertions }) => {
        await navbar.navigateToCinemas();
        await navbarAssertions.expectNavClick(testUrls.cinema);
      }
    );

    test(
      'should navigate to movies section',
      {
        tag: ['@navigation', '@slow', '@high'],
      },
      async ({ navbar, navbarAssertions }) => {
        await navbar.navigateToMovies();
        await navbarAssertions.expectNavClick(testUrls.film);
      }
    );

    test(
      'should navigate to experiences section',
      {
        tag: ['@navigation', '@slow', '@high'],
      },
      async ({ navbar, navbarAssertions }) => {
        await navbar.navigateToExperiences();
        await navbarAssertions.expectNavClick(testUrls.esperienze);
      }
    );

    test(
      'should navigate to membership section',
      {
        tag: ['@navigation', '@fast', '@medium'],
      },
      async ({ navbar, navbarAssertions }) => {
        await navbar.navigateToMembership();
        await navbarAssertions.expectNavClick(testUrls.membership);
      }
    );

    test(
      'should click on logo and return to home',
      {
        tag: ['@navigation', '@fast', '@critical'],
      },
      async ({ navbar, navbarAssertions }) => {
        // First navigate to another page
        await navbar.navigateToCinemas();
        await navbarAssertions.expectNavClick(testUrls.cinema);

        // Then click on the logo
        await navbar.clickLogo();
        await navbarAssertions.expectHomeUrl(baseUrl);
      }
    );

    test(
      'should handle promotional modal correctly',
      {
        tag: ['@modal', '@fast', '@medium'],
      },
      async ({ navbarAssertions }) => {
        // The promotional modal is handled automatically in beforeEach
        await navbarAssertions.expectHomeUrl(baseUrl);
        await navbarAssertions.expectPromoModalClosed();
      }
    );
  }
);
