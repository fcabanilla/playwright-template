/**
 * Authenticated Checkout Tests — Organic flow with pre-authenticated session.
 *
 * Uses Cinesa authenticated fixtures (navbar, cinema, cinemaDetail + auth storageState)
 * to follow the organic user journey: Home → Cinemas → Select Cinema → Select Showtime
 * → Seats → (login auto-skipped) → Tickets → Bar → Summary → Payment.
 *
 * Prerequisites:
 * ```bash
 * # 1. Generate consent state
 * TEST_ENV=preprod npx playwright test --project=setup
 *
 * # 2. Ensure authenticated state exists
 * # state/authenticated.preprod.es.json (manual or via auth-login-setup)
 *
 * # 3. Run authenticated checkout tests
 * TEST_ENV=preprod npx playwright test tests/praetor/cinesa/checkout/authenticatedCheckout/ --project=Cinesa --headed --workers=1
 * ```
 */
import {
  test,
  expect,
} from '../../../../../fixtures/cinesa/playwright.authenticated.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { AuthenticatedCheckoutAssertions } from './authenticatedCheckout.assertions';
import { getShowtimeSelectionForWorker } from '../../../../../config/showtimes.pool';

let assertions: AuthenticatedCheckoutAssertions;

test.describe.skip('Authenticated Checkout · E2E · Organic Flow · Oasiz Preprod', () => {
  // Skipped: auth token expired — needs manual re-login or auth-login-setup --headed
  test.describe.configure({ timeout: 180_000 });

  test.beforeEach(async ({ page, navbar, promotionalModal }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Checkout - Authenticated');
    await enrichTestMetadata(testInfo);
    assertions = new AuthenticatedCheckoutAssertions(page);

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  test(
    'Authenticated Checkout · E2E · Full flow to payment — Oasiz',
    {
      tag: [
        '@authenticated',
        '@checkout',
        '@e2e',
        '@cinesa',
        '@smoke',
        '@oasiz',
      ],
      annotation: {
        type: 'feature',
        description:
          'Validates full checkout flow with authenticated session (login step auto-skipped)',
      },
    },
    async ({
      navbar,
      cinema: cinemaPage,
      cinemaDetail,
      seatPicker,
      ticketPicker,
      barPage,
      purchaseSummary,
    }) => {
      await allure.story(
        'Authenticated checkout — Organic flow to payment',
      );
      await allure.parameter('Cinema', 'Oasiz');
      await allure.parameter('Login', 'Pre-authenticated (skip)');

      // Organic navigation: Cinemas → Oasiz → Select film + showtime
      await navbar.navigateToCinemas();
      await cinemaPage.selectOasizCinema();
      await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(
        getShowtimeSelectionForWorker(test.info().parallelIndex),
      );

      // Seat selection
      await seatPicker.selectLastAvailableSeat();
      await seatPicker.confirmSeats();

      // Login step: skipped automatically for authenticated users
      // (no loginPage interaction — checkout detects session and advances)

      // Ticket selection → Bar → Summary → Payment
      await ticketPicker.selectTicket();
      await barPage.skipBar();
      await purchaseSummary.acceptAndContinue();

      // Assertions
      await assertions.expectOnPaymentPage();
      await assertions.expectPaymentHeading();
      await assertions.expectRedsysVisible();
    },
  );

  test(
    'Authenticated Checkout · E2E · Verify user data pre-filled in summary — Oasiz',
    {
      tag: ['@authenticated', '@checkout', '@e2e', '@cinesa', '@oasiz'],
      annotation: {
        type: 'feature',
        description:
          'Validates that logged-in user data is pre-filled in purchase summary',
      },
    },
    async ({
      navbar,
      cinema: cinemaPage,
      cinemaDetail,
      seatPicker,
      ticketPicker,
      barPage,
      purchaseSummary,
    }) => {
      await allure.story(
        'Authenticated checkout — User data pre-filled in summary',
      );
      await allure.parameter('Cinema', 'Oasiz');
      await allure.parameter('Login', 'Pre-authenticated (skip)');

      // Organic navigation: Cinemas → Oasiz → Select film + showtime
      await navbar.navigateToCinemas();
      await cinemaPage.selectOasizCinema();
      await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(
        getShowtimeSelectionForWorker(test.info().parallelIndex),
      );

      // Seat selection
      await seatPicker.selectLastAvailableSeat();
      await seatPicker.confirmSeats();

      // Login step: auto-skipped for authenticated users

      // Ticket selection → Bar → Summary (stop here)
      await ticketPicker.selectTicket();
      await barPage.skipBar();

      // Assertions on summary page
      await assertions.expectOnPurchaseSummary();
      await assertions.expectSummaryFormVisible();
      await assertions.expectUserDataPreFilled();
    },
  );
});
