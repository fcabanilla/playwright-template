import { test } from '../../../fixtures/cinesa/playwright.fixtures';

test.describe('Seat Picker', () => {
  test.beforeEach(async ({ page, seatPicker }) => {
    await page.goto('https://www.cinesa.es/');
  });

  test('Simulate a Full Purchase', async ({
    page,
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
    //const selectedCinema = await cinema.selectRandomCinema();
    const selectedCinema = await cinema.selectOasizCinema();
    console.log(`Selected cinema: ${selectedCinema}`);

    const { film, showtime } = await cinemaDetail.selectRandomFilmAndShowtime();
    console.log(`Selected film: ${film} at showtime: ${showtime}`);

    const selectedSeat = await seatPicker.selectLastAvailableSeat();
    console.log(
      `Selected seat: Row ${selectedSeat.row}, Seat ${selectedSeat.seatNumber}`
    );

    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    await ticketPicker.selectTicket();
    await barPage.skipBar();
    await purchaseSummary.acceptAndContinue();
    await paymentPage.completePayment();
  });
});
