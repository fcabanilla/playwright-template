import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../core/allure/allureMetadata';
import { getCinemasForEnvironment } from '../../../config/cinemas.config';
import { getShowtimeSelectionForWorker } from '../../../config/showtimes.pool';
import { getGiftCardData } from '../paymentPage/paymentPage.data';

const CINEMAS = getCinemasForEnvironment();
const OASIZ_CINEMA = CINEMAS.find((cinema) => cinema.name === 'Oasiz');

test.describe('Checkout Gift Card Tests', () => {
  test.describe.configure({ timeout: 180000 });

  test.beforeEach(async ({ navbar, promotionalModal }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Checkout - Gift Card Payment');
    await enrichTestMetadata(testInfo);

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  for (const cinema of CINEMAS) {
    test(
      `Checkout · Gift Card · Full Purchase with Post-Payment Verification — ${cinema.name}`,
      {
        tag: [
          '@rerun-cf',
          '@lab-fail',
          '@preprod-broken',
          '@checkout',
          '@giftcard',
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
        bookingConfirmation,
        bookingConfirmationAssertions,
        livingTicket,
        livingTicketAssertions,
      }) => {
        await allure.story(
          `Gift card full purchase with post-payment — ${cinema.name}`
        );
        await allure.parameter('Cinema', cinema.name);
        await allure.parameter('Seats', '1');
        await allure.parameter('Payment Method', 'Gift Card (100% coverage)');

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

        // 5. Payment via Gift Card (100% coverage → "Pagar ahora")
        const { cardNumber, pin } = getGiftCardData();
        await paymentPage.completeGiftCardPayment(cardNumber, pin);

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

  test(
    'Checkout · Gift Card · Nine Seats · Full Purchase with Post-Payment Verification — Oasiz',
    {
      tag: [
        '@lab-fail',
        '@checkout',
        '@giftcard',
        '@cinesa',
        '@e2e',
        '@booking',
        '@oasiz',
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
      test.skip(
        (process.env.TEST_ENV || 'production') !== 'lab',
        'This scenario is targeted to lab only'
      );
      test.skip(
        !OASIZ_CINEMA,
        'Oasiz is not available in the current environment'
      );

      const seatsToSelect = 9;

      await allure.story(
        'Gift card full purchase with post-payment verification - nine seats - Oasiz'
      );
      await allure.parameter('Cinema', 'Oasiz');
      await allure.parameter('Seats', String(seatsToSelect));
      await allure.parameter(
        'Payment Method',
        'Gift Card with automatic Credit Card fallback'
      );
      await allure.parameter('Environment Target', 'lab');

      await navbar.navigateToCinemas();
      await cinemaPage[OASIZ_CINEMA!.selectMethod]();
      await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(
        getShowtimeSelectionForWorker(test.info().parallelIndex)
      );

      await seatPicker.selectLastAvailableSeats(seatsToSelect);
      await seatPicker.confirmSeats();

      await loginPage.clickContinueAsGuest();

      await ticketPicker.selectTicket(seatsToSelect);
      await barPage.skipBar();
      await purchaseSummary.acceptAndContinue();

      const { cardNumber, pin } = getGiftCardData();
      await paymentPage.completePayment(cardNumber, pin);

      const isFullGiftCardCoverage =
        await paymentPage.isGiftCardCoveringFullAmount();

      if (isFullGiftCardCoverage) {
        await paymentPage.clickCompleteOrder();
      } else {
        await paymentPage.payWithCreditCard();
        await redsysPage.completePayment(undefined, 'accept');
      }

      await bookingConfirmation.waitForBookingConfirmationLoaded();
      await bookingConfirmationAssertions.expectBookingConfirmationUrl();
      await bookingConfirmationAssertions.expectBookingConfirmationBaseContent();
      await bookingConfirmationAssertions.expectCountdownContract();
      await bookingConfirmationAssertions.expectWebloyaltyContractIfPresent();

      await bookingConfirmation.navigateToReviewTicketSafely();

      await livingTicket.waitForLoaded();
      await livingTicketAssertions.expectLivingTicketContract();
    }
  );
});
