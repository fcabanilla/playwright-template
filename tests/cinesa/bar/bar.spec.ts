import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';

test.describe('Bar - Servicios de Comida y Bebida', () => {
  test.beforeEach(async ({ navbar, cookieBanner, promotionalModal }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Bar & Food Services');
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test.describe('Menú Clásico - Cinema Oasiz', () => {
    test.beforeEach(async () => {
      await allure.story('Compra con Menú Clásico - Oasiz');
    });

    test(
      'Buy ticket with Classic menu - Oasiz',
      { tag: ['@bar', '@cinesa', '@e2e', '@booking', '@COMS-16857'] },
      async ({
        navbar,
        cinema,
        cinemaDetail,
        cookieBanner,
        seatPicker,
        ticketPicker,
        loginPage,
        barPage,
        purchaseSummary,
        paymentPage,
      }) => {
        await allure.parameter('Cinema', 'Oasiz');
        await allure.parameter('Menu Type', 'Classic');
        await allure.parameter('Tickets', '1');

        await navbar.navigateToCinemas();
        await cinema.selectOasizCinema();
        await cinemaDetail.selectNormalRandomFilmAndShowtime();
        await seatPicker.selectLastAvailableSeat();
        await seatPicker.confirmSeats();
        await loginPage.clickContinueAsGuest();
        await ticketPicker.selectTicket();
        await barPage.buyClassicMenuOasiz();
        await purchaseSummary.acceptAndContinue();
        await paymentPage.completePayment();
      }
    );

    test(
      'Buy multiple tickets with Classic menu - Oasiz',
      { tag: ['@bar', '@cinesa', '@e2e', '@booking', '@COMS-16858'] },
      async ({
        navbar,
        cinema,
        cinemaDetail,
        cookieBanner,
        seatPicker,
        ticketPicker,
        loginPage,
        barPage,
        purchaseSummary,
        paymentPage,
      }) => {
        const seatsToSelect = 4;
        await allure.parameter('Cinema', 'Oasiz');
        await allure.parameter('Menu Type', 'Classic');
        await allure.parameter('Tickets', seatsToSelect.toString());

        await navbar.navigateToCinemas();
        await cinema.selectOasizCinema();
        await cinemaDetail.selectNormalRandomFilmAndShowtime();
        await seatPicker.selectLastAvailableSeats(seatsToSelect);
        await seatPicker.confirmSeats();
        await loginPage.clickContinueAsGuest();
        await ticketPicker.selectTicket(seatsToSelect);
        await barPage.buyClassicMenuOasiz();
        await purchaseSummary.acceptAndContinue();
        await paymentPage.completePayment();
      }
    );
  });

  test.describe('Menú Clásico - Cinema Grancasa', () => {
    test.beforeEach(async () => {
      await allure.story('Compra con Menú Clásico - Grancasa');
    });

    test(
      'Buy ticket with Classic menu - Grancasa',
      { tag: ['@bar', '@cinesa', '@e2e', '@booking', '@grancasa'] },
      async ({
        navbar,
        cinema,
        cinemaDetail,
        cookieBanner,
        seatPicker,
        ticketPicker,
        loginPage,
        barPage,
        purchaseSummary,
        paymentPage,
      }) => {
        await allure.parameter('Cinema', 'Grancasa');
        await allure.parameter('Menu Type', 'Classic');
        await allure.parameter('Tickets', '1');

        await navbar.navigateToCinemas();
        await cinema.selectGrancasaCinema();
        await cinemaDetail.selectNormalRandomFilmAndShowtime();
        await seatPicker.selectLastAvailableSeat();
        await seatPicker.confirmSeats();
        await loginPage.clickContinueAsGuest();
        await ticketPicker.selectTicket();
        await barPage.buyClassicMenuGrancasa();
        await purchaseSummary.acceptAndContinue();
        await paymentPage.completePayment();
      }
    );

    test(
      'Buy multiple tickets with Classic menu - Grancasa',
      {
        tag: ['@bar', '@cinesa', '@e2e', '@booking', '@grancasa', '@multiple'],
      },
      async ({
        navbar,
        cinema,
        cinemaDetail,
        cookieBanner,
        seatPicker,
        ticketPicker,
        loginPage,
        barPage,
        purchaseSummary,
        paymentPage,
      }) => {
        const seatsToSelect = 4;
        await allure.parameter('Cinema', 'Grancasa');
        await allure.parameter('Menu Type', 'Classic');
        await allure.parameter('Tickets', seatsToSelect.toString());

        await navbar.navigateToCinemas();
        await cinema.selectGrancasaCinema();
        await cinemaDetail.selectNormalRandomFilmAndShowtime();
        await seatPicker.selectLastAvailableSeats(seatsToSelect);
        await seatPicker.confirmSeats();
        await loginPage.clickContinueAsGuest();
        await ticketPicker.selectTicket(seatsToSelect);
        await barPage.buyClassicMenuGrancasa();
        await purchaseSummary.acceptAndContinue();
        await paymentPage.completePayment();
      }
    );
  });
});
