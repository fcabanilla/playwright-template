import { test } from '../../../fixtures/cinesa/playwright.fixtures';

test.describe('Bar', () => {

    test.beforeEach(async ({ page }) => {
    await page.goto('https://www.cinesa.es/');
  });

  test('Buy ticket with Classic menu - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    loginPage,
    barPage,
    purchaseSummary,
    paymentPage
  }) => {
    await cookieBanner.acceptCookies();
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
  });

  test('Buy multiple tickets with Classic menu - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    loginPage,
    barPage,
    purchaseSummary,
    paymentPage
  }) => {
    await cookieBanner.acceptCookies();
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
  });

  test('Buy ticket with Classic menu - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    loginPage,
    barPage,
    purchaseSummary,
    paymentPage
  }) => {
    await cookieBanner.acceptCookies();
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

  test('Buy multiple tickets with Classic menu - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    loginPage,
    barPage,
    purchaseSummary,
    paymentPage
  }) => {
    await cookieBanner.acceptCookies();
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
