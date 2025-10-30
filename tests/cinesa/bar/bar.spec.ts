import { test } from '../../../fixtures/cinesa/playwright.fixtures';

test.describe('Bar', () => {
  test.beforeEach(async ({ navbar, cookieBanner, promotionalModal }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
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
      await navbar.navigateToCinemas();
      await cinema.selectOasizCinema();
      await cinemaDetail.selectNormalRandomFilmAndShowtime();
      const seatsToSelect = 4;
      await seatPicker.selectLastAvailableSeats(seatsToSelect);
      await seatPicker.confirmSeats();
      await loginPage.clickContinueAsGuest();
      await ticketPicker.selectTicket(seatsToSelect);
      await barPage.buyClassicMenuOasiz();
      await purchaseSummary.acceptAndContinue();
      await paymentPage.completePayment();
    }
  );

  test('Buy ticket with Classic menu - Grancasa', 
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
  });

  test('Buy multiple tickets with Classic menu - Grancasa', 
    { tag: ['@bar', '@cinesa', '@e2e', '@booking', '@grancasa', '@multiple'] },
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
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    const seatsToSelect = 4;
    await seatPicker.selectLastAvailableSeats(seatsToSelect);
    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    await ticketPicker.selectTicket(seatsToSelect);
    await barPage.buyClassicMenuGrancasa();
    await purchaseSummary.acceptAndContinue();
    await paymentPage.completePayment();
  });
});
