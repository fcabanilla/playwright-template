import { test } from '../../../fixtures/uci/playwright.fixtures';

test.describe('UCI Films Page Tests', () => {
  test.beforeEach(async ({ navbar, promoModal, cookieBanner }) => {
    // Note: Films are accessed via cinema detail pages in UCI, not a dedicated films page
    await navbar.navigateToHome();

    // Handle promotional modal and cookies
    await promoModal.waitAndCloseModal();
    await cookieBanner.acceptCookies();
  });

  test('Verify films page loads with content @films @uci @smoke @fast @critical', async ({
    navbar,
    cinema,
    cinemaDetail,
    cinemasAssertions,
  }) => {
    await test.step('Navigate to cinemas and select first cinema', async () => {
      await navbar.navigateToCinemas();
      await cinema.selectFirstCinema();
    });

    await test.step('Assert cinema detail page has films content', async () => {
      await cinemasAssertions.assertCinemaDetailPageLoaded();
    });
  });

  test('Analyze films catalog availability @films @uci @content @fast @medium', async ({
    navbar,
    cinema,
    cinemaDetail,
    cinemasAssertions,
  }) => {
    await test.step('Navigate to first cinema', async () => {
      await navbar.navigateToCinemas();
      await cinema.selectFirstCinema();
    });

    await test.step('Assert films are available in cinema', async () => {
      await cinemasAssertions.assertCinemaHasFilms();
    });
  });

  test('Verify films page URL is correct @films @uci @navigation @fast @medium', async ({
    navbar,
    cinema,
    cinemaDetail,
  }) => {
    await test.step('Navigate to cinema to access films', async () => {
      await navbar.navigateToCinemas();
      await cinema.selectFirstCinema();
    });

    await test.step('Verify we are on a cinema detail page with films', async () => {
      // Use webActions to get URL
      const currentUrl = cinemaDetail.webActions.page.url();
      console.log(`Current URL after cinema selection: ${currentUrl}`);

      // Validate that we are on a cinema-related page (either /cinema or /cinema/specific-cinema)
      if (!currentUrl.includes('/cinema')) {
        throw new Error(
          `Expected to be on cinema page, but URL is: ${currentUrl}`
        );
      }

      // Check if films are present using getFilmNames method
      const filmNames = await cinemaDetail.getFilmNames();
      if (filmNames.length === 0) {
        throw new Error('Cinema page should show films');
      }

      console.log(`✅ Found ${filmNames.length} films on cinema page`);
    });
  });
});
