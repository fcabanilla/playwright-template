import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { getCinemasForEnvironment } from '../../../config/cinemas.config';
import { checkoutShowtimeSelectionCriteria } from './checkout.data';
import { getGiftCardData } from '../paymentPage/paymentPage.data';

const CINEMAS = getCinemasForEnvironment();

test.describe('Checkout Gift Card Tests', () => {
  test.describe.configure({ timeout: 180000 });

  test.beforeEach(async ({ navbar }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Checkout - Gift Card Payment');

    await navbar.navigateToHome();
  });

  for (const cinema of CINEMAS) {
    test(
      `Checkout · Gift Card · Full Purchase with Post-Payment Verification — ${cinema.name}`,
      {
        tag: [
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
          checkoutShowtimeSelectionCriteria
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
});
