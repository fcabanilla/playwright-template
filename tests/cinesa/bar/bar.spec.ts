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
    await barPage.buyClassicMenu();
    await purchaseSummary.acceptAndContinue();
    await paymentPage.completePayment();
  });
});
