import { test } from '../../../fixtures/uci/playwright.fixtures';

test.describe(
  'UCI Cinemas Navigation Tests',
  {
    tag: ['@cinemas', '@uci', '@smoke'],
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
      'should navigate to cinemas and verify list is visible',
      {
        tag: ['@smoke', '@fast', '@critical'],
      },
      async ({ navbar, cinemasAssertions }) => {
        // Navigate to cinemas section
        await navbar.navigateToCinemas();

        // Verify cinema list is visible using assertions
        await cinemasAssertions.assertCinemasListVisible();
      }
    );

    test(
      'should select first cinema and verify detail page loads',
      {
        tag: ['@smoke', '@medium', '@critical'],
      },
      async ({ navbar, cinema, cinemasAssertions }) => {
        // Navigate to cinemas section
        await navbar.navigateToCinemas();

        // Select first available cinema and verify detail page loads
        await cinema.selectFirstCinema();
        await cinemasAssertions.assertCinemaDetailPageLoaded();

        // Verify cinema has films available
        await cinemasAssertions.assertCinemaHasFilms();
      }
    );

    test(
      'should complete cinema selection flow',
      {
        tag: ['@smoke', '@slow', '@high'],
      },
      async ({ navbar, cinemasAssertions }) => {
        // Navigate to cinemas section
        await navbar.navigateToCinemas();

        // Execute complete cinema selection flow with assertions
        await cinemasAssertions.assertCinemaSelectionFlow();
      }
    );
  }
);
