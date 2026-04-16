import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../core/allure/allureMetadata';
import { getCinemasForEnvironment } from '../../../config/cinemas.config';
import { getShowtimeSelectionForWorker } from '../../../config/showtimes.pool';

const CINEMAS = getCinemasForEnvironment();

test.describe('Checkout Smoke Tests', () => {
  test.describe.configure({ timeout: 180000 });

  test.beforeEach(async ({ navbar, promotionalModal }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Checkout - Purchase Flow');
    await enrichTestMetadata(testInfo);

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  for (const cinema of CINEMAS) {
    test(
      `Checkout · Smoke · Single Seat · Credit Card — ${cinema.name}`,
      {
        tag: [
          '@rerun-cf',
          '@lab-fail',
          '@preprod-fail',
          '@checkout',
          '@smoke',
          '@cinesa',
          '@e2e',
          '@booking',
          ...cinema.tags,
        ],
      },
      async ({
        navbar,
        cinema: cinemaPage,
        cinemaDetail,
        seatPicker,
        ticketPicker,
        loginPage,
        barPage,
        purchaseSummary,
        paymentPage,
        redsysPage,
        bookingConfirmation,
        bookingConfirmationAssertions,
        livingTicket,
        livingTicketAssertions,
      }) => {
        await allure.story(
          `Checkout smoke — single seat credit card — ${cinema.name}`
        );
        await allure.parameter('Cinema', cinema.name);
        await allure.parameter('Seats', '1');
        await allure.parameter('Payment Method', 'Credit Card (Redsys)');
        await allure.parameter('3DS Action', 'accept');

        // 1. Navigate to cinema and select film
        await navbar.navigateToCinemas();
        await cinemaPage[cinema.selectMethod]();
        await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(
          getShowtimeSelectionForWorker(test.info().parallelIndex)
        );

        // 2. Seat selection
        await seatPicker.selectLastAvailableSeat();
        await seatPicker.confirmSeats();

        // 3. Guest login
        await loginPage.clickContinueAsGuest();

        // 4. Ticket + Bar + Summary
        await ticketPicker.selectTicket();
        await barPage.skipBar();
        await purchaseSummary.acceptAndContinue();

        // 5. Payment via Credit Card + Redsys 3DS accept
        await paymentPage.payWithCreditCard();
        await redsysPage.completePayment(undefined, 'accept');

        // 6. Post-payment: Booking Confirmation
        await bookingConfirmation.waitForBookingConfirmationLoaded();
        await bookingConfirmationAssertions.expectBookingConfirmationUrl();
        await bookingConfirmationAssertions.expectBookingConfirmationBaseContent();
        await bookingConfirmationAssertions.expectCountdownContract();
        await bookingConfirmationAssertions.expectWebloyaltyContractIfPresent();

        // 7. Navigate to Living Ticket
        await bookingConfirmation.navigateToReviewTicketSafely();

        // 8. Living Ticket verification
        await livingTicket.waitForLoaded();
        await livingTicketAssertions.expectLivingTicketContract();
      }
    );
  }

  for (const cinema of CINEMAS) {
    test(
      `Checkout · Smoke · Multiple Seats · Credit Card — ${cinema.name}`,
      {
        tag: [
          '@rerun-cf',
          '@lab-fail',
          '@preprod-fail',
          '@checkout',
          '@smoke',
          '@cinesa',
          '@e2e',
          '@booking',
          ...cinema.tags,
        ],
      },
      async ({
        navbar,
        cinema: cinemaPage,
        cinemaDetail,
        seatPicker,
        ticketPicker,
        loginPage,
        barPage,
        purchaseSummary,
        paymentPage,
        redsysPage,
        bookingConfirmation,
        bookingConfirmationAssertions,
        livingTicket,
        livingTicketAssertions,
      }) => {
        await allure.story(
          `Checkout smoke — multiple seats credit card — ${cinema.name}`
        );
        await allure.parameter('Cinema', cinema.name);
        await allure.parameter('Seats', '2');
        await allure.parameter('Payment Method', 'Credit Card (Redsys)');
        await allure.parameter('3DS Action', 'accept');

        // 1. Navigate to cinema and select film
        await navbar.navigateToCinemas();
        await cinemaPage[cinema.selectMethod]();
        await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(
          getShowtimeSelectionForWorker(test.info().parallelIndex)
        );

        // 2. Seat selection (2 seats)
        const seatsToSelect = 2;
        await seatPicker.selectLastAvailableSeats(seatsToSelect);
        await seatPicker.confirmSeats();

        // 3. Guest login
        await loginPage.clickContinueAsGuest();

        // 4. Ticket + Bar + Summary
        await ticketPicker.selectTicket(seatsToSelect);
        await barPage.skipBar();
        await purchaseSummary.acceptAndContinue();

        // 5. Payment via Credit Card + Redsys 3DS accept
        await paymentPage.payWithCreditCard();
        await redsysPage.completePayment(undefined, 'accept');

        // 6. Post-payment: Booking Confirmation
        await bookingConfirmation.waitForBookingConfirmationLoaded();
        await bookingConfirmationAssertions.expectBookingConfirmationUrl();
        await bookingConfirmationAssertions.expectBookingConfirmationBaseContent();
        await bookingConfirmationAssertions.expectCountdownContract();
        await bookingConfirmationAssertions.expectWebloyaltyContractIfPresent();

        // 7. Navigate to Living Ticket
        await bookingConfirmation.navigateToReviewTicketSafely();

        // 8. Living Ticket verification
        await livingTicket.waitForLoaded();
        await livingTicketAssertions.expectLivingTicketContract();
      }
    );
  }
});
