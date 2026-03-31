import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { getCinemasForEnvironment } from '../../../config/cinemas.config';
import { checkoutShowtimeSelectionCriteria } from './checkout.data';
import { getGiftCardData } from '../paymentPage/paymentPage.data';

const CINEMAS = getCinemasForEnvironment();

test.describe('Checkout E2E Tests', () => {
  test.describe.configure({ timeout: 180000 });

  test.beforeEach(async ({ navbar, promotionalModal }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Checkout - End to End');

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  test.describe('Single Seat Purchase', () => {
    test.beforeEach(async () => {
      await allure.story('E2E single seat purchase');
    });

    for (const cinema of CINEMAS) {
      test(
        `Checkout · E2E · Single Seat · Gift Card — ${cinema.name}`,
        {
          tag: [
            '@lab-pass',
            '@preprod-fail',
            '@checkout',
            '@e2e',
            '@cinesa',
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
        }) => {
          await allure.parameter('Cinema', cinema.name);
          await allure.parameter('Seats', '1');
          await allure.parameter('Payment Method', 'Gift Card');

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(
            checkoutShowtimeSelectionCriteria
          );
          await seatPicker.selectLastAvailableSeat();
          await seatPicker.confirmSeats();
          await loginPage.clickContinueAsGuest();
          await ticketPicker.selectTicket();
          await barPage.skipBar();
          await purchaseSummary.acceptAndContinue();
          const { cardNumber, pin } = getGiftCardData();
          await paymentPage.completePayment(cardNumber, pin);
        }
      );
    }
  });

  test.describe('Multiple Seats Purchase', () => {
    test.beforeEach(async () => {
      await allure.story('E2E multiple seats purchase');
    });

    for (const cinema of CINEMAS) {
      test(
        `Checkout · E2E · Multiple Seats · Gift Card — ${cinema.name}`,
        {
          tag: [
            '@lab-fail',
            '@preprod-fail',
            '@checkout',
            '@e2e',
            '@cinesa',
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
        }) => {
          await allure.parameter('Cinema', cinema.name);
          await allure.parameter('Seats', '4');
          await allure.parameter('Payment Method', 'Gift Card');

          const seatsToSelect = 4;

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(
            checkoutShowtimeSelectionCriteria
          );
          await seatPicker.selectLastAvailableSeats(seatsToSelect);
          await seatPicker.confirmSeats();
          await loginPage.clickContinueAsGuest();
          await ticketPicker.selectTicket(seatsToSelect);
          await barPage.skipBar();
          await purchaseSummary.acceptAndContinue();
          const { cardNumber, pin } = getGiftCardData();
          await paymentPage.completePayment(cardNumber, pin);
        }
      );
    }
  });
});
