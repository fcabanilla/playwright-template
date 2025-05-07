import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { assertWarningMessageDisplayed, assertConfirmButtonDisabled } from './seatPicker.assertions';

test.describe('Seat Picker', () => {
  test.beforeEach(async ({ page, seatPicker }) => {
    await page.goto('https://www.cinesa.es/');
  });

  test('Simulate a Full Purchase', async ({
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
    const selectedCinema = await cinema.selectOasizCinema();
    console.log(`Selected cinema: ${selectedCinema}`);

    const { film, showtime } = await cinemaDetail.selectNormalRandomFilmAndShowtime();
    console.log(`Selected film: ${film} at showtime: ${showtime}`);

    const selectedSeat = await seatPicker.selectLastAvailableSeat();
    console.log(
      `Selected seat: Row ${selectedSeat.row}, Seat ${selectedSeat.seatNumber}, type: ${selectedSeat.seatType}, state: ${selectedSeat.seatState}, aria-label: ${selectedSeat.ariaLabel}`
    );

    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    await ticketPicker.selectTicket();
    await barPage.skipBar();
    await purchaseSummary.acceptAndContinue();
    await paymentPage.completePayment();
  });

  test('Simulate a Full Purchase with multiple seats', async ({
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
    const selectedCinema = await cinema.selectOasizCinema();
    console.log(`Selected cinema: ${selectedCinema}`);

    const { film, showtime } = await cinemaDetail.selectNormalRandomFilmAndShowtime();
    console.log(`Selected film: ${film} at showtime: ${showtime}`);

    const seatsToSelect = 4;
    const selectedSeats = await seatPicker.selectLastAvailableSeats(seatsToSelect);
    selectedSeats.forEach((seat, index) => {
      console.log(
        `Selected seat ${index + 1}: Row ${seat.row}, Seat ${seat.seatNumber}, type: ${seat.seatType}, state: ${seat.seatState}, aria-label: ${seat.ariaLabel}`
      );
    });

    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    await ticketPicker.selectTicket(seatsToSelect);
    await barPage.skipBar();
    await purchaseSummary.acceptAndContinue();
    await paymentPage.completePayment();
  });

  test('Attempt to select seats leaving an empty space between selection', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5620', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    const selectedCinema = await cinema.selectOasizCinema();
    console.log(`Selected cinema: ${selectedCinema}`);

    const { film, showtime } = await cinemaDetail.selectNormalRandomFilmAndShowtime();
    console.log(`Selected film: ${film} at showtime: ${showtime}`);

    const selectedSeats = await seatPicker.selectSeatsWithEmptySpaceBetween();
    selectedSeats.forEach((seat, index) => {
      console.log(
        `Selected seat ${index + 1}: Row ${seat.row}, Seat ${seat.seatNumber}, type: ${seat.seatType}, state: ${seat.seatState}, aria-label: ${seat.ariaLabel}`
      );
    });

    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });
});
