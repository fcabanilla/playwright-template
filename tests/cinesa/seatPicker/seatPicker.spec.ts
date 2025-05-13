import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { 
  assertWarningMessageDisplayed, 
  assertConfirmButtonDisabled, 
  assertWarningMessageNotDisplayed, 
  assertConfirmButtonEnabled, 
  assertFirstSeatsDeselected, 
  assertLastSeatsSelected 
} from './seatPicker.assertions';

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
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectLastAvailableSeat();
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
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    const seatsToSelect = 4;
    await seatPicker.selectLastAvailableSeats(seatsToSelect);
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
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectSeatsWithEmptySpaceBetween();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Attempt to select seats separating group in the same row', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5620', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectSeatsSeparatingGroupInSameRow();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Select seats separating group in different rows', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5620', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectSeatsSeparatingGroupInDifferentRows();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await seatPicker.confirmSeats();
  });

  test('No seat selection', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Select more than max seat capacity', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    const selectedSeats = await seatPicker.selectMoreThanMaxSeats();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await assertFirstSeatsDeselected(selectedSeats);
    await assertLastSeatsSelected(selectedSeats);
  });

  test('Select only companion seat', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker
  }) => {
    test.step('TC: TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectCompanionSeat();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Select companion and wheelchair seat', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectCompanionAndWheelchairSeats();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await seatPicker.confirmSeats();
  });
});


