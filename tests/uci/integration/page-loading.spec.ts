import { test } from '../../../fixtures/uci/playwright.fixtures';

/**
 * Integration tests for page loading validation
 * These tests focus on page accessibility and structure
 * without requiring specific content availability
 */
test.describe('UCI Page Loading Integration Tests', () => {
  test.beforeEach(async ({ navbar }) => {
    console.log('Navigating to UCI Cinemas home');
    await navbar.navigateToHome();
  });

  test('should validate films page structure loads correctly', async ({
    films,
  }) => {
    // Navigate to films page
    await films.navigateToFilms();

    // Verify page loads by checking URL contains film path
    const currentUrl = await films.getCurrentUrl();
    if (!currentUrl.includes('/film')) {
      throw new Error(
        `Expected URL to contain '/film', but got: ${currentUrl}`
      );
    }

    console.log('✅ Films page structure validated');
  });

  test('should validate cinemas page structure loads correctly', async ({
    navbar,
    cinemasAssertions,
  }) => {
    // Navigate to cinemas
    await navbar.navigateToCinemas();

    // Verify cinemas list loads
    await cinemasAssertions.assertCinemasListVisible();

    console.log('✅ Cinemas page structure validated');
  });

  test('should validate cinema detail page accessibility', async ({
    navbar,
    cinema,
    cinemasAssertions,
  }) => {
    // Navigate to cinemas and select first one
    await navbar.navigateToCinemas();
    const cinemaNames = await cinema.getCinemaNames();

    if (cinemaNames.length > 0) {
      await cinema.selectFirstCinema();

      // Verify detail page loads (accessibility, not films content)
      await cinemasAssertions.assertCinemaDetailPageLoaded();

      console.log(`✅ Cinema detail page accessible: ${cinemaNames[0]}`);
    }
  });

  test('should validate complete navigation flow', async ({
    navbar,
    cinemasAssertions,
  }) => {
    // Test complete navigation sequence
    await navbar.navigateToCinemas();
    await cinemasAssertions.assertCinemasListVisible();

    await navbar.navigateToMovies();
    await navbar.navigateToExperiences();
    await navbar.navigateToMembership();
    await navbar.clickLogo(); // Return home

    console.log('✅ Complete navigation flow validated');
  });
});
