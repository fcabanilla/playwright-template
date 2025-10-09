import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import {
  assertWarningMessageDisplayed,
  assertConfirmButtonDisabled,
  assertWarningMessageNotDisplayed,
  assertConfirmButtonEnabled,
  assertFirstSeatsDeselected,
  assertLastSeatsSelected,
  assertTicketTypeNamesMatchExpectedTexts,
} from './seatPicker.assertions';
import { ticketTypeMappings } from '../ticketPicker/ticketPicker.data';
import { PROMO_CODE_OPTIONS } from '../../../pageObjectsManagers/cinesa/ticketPicker/ticketPicker.data';
import { setupCorsHandlerIfNeeded } from '../../../core/webactions/corsHandler';

test.describe('Seat Picker', () => {
  test.beforeEach(async ({ page, navbar }) => {
    // Setup CORS handler for LAB environment (automatically skipped in other environments)
    await setupCorsHandlerIfNeeded(page);
    await navbar.navigateToHome();
  });

  test('Simulate a Full Purchase - Oasiz', async ({
    page,
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    promoModal,
    seatPicker,
    ticketPicker,
    loginPage,
    barPage,
    purchaseSummary,
    paymentPage,
  }) => {
    await cookieBanner.acceptCookies();
    await promoModal.dismissIfVisible();
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

  test('Simulate a Full Purchase - Grancasa', async ({
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
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectLastAvailableSeat();
    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    await ticketPicker.selectTicket();
    await barPage.skipBar();
    await purchaseSummary.acceptAndContinue();
    await paymentPage.completePayment();
  });

  test('Simulate a Full Purchase with multiple seats - Oasiz', async ({
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

  test('Simulate a Full Purchase with multiple seats - Grancasa', async ({
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
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
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

  test('Attempt to select seats leaving an empty space between selection - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
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

  test('Attempt to select seats leaving an empty space between selection - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5620', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectSeatsWithEmptySpaceBetween();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Attempt to select seats separating group in the same row - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
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

  test('Attempt to select seats separating group in the same row - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5620', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectSeatsSeparatingGroupInSameRow();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Select seats separating group in different rows - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
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

  test('Select seats separating group in different rows - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5620', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectSeatsSeparatingGroupInDifferentRows();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await seatPicker.confirmSeats();
  });

  test('No seat selection - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('No seat selection - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Select more than max seat capacity - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
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

  test('Select more than max seat capacity - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    const selectedSeats = await seatPicker.selectMoreThanMaxSeats();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await assertFirstSeatsDeselected(selectedSeats);
    await assertLastSeatsSelected(selectedSeats);
  });

  test('Select only companion seat - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
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

  test('Select only companion seat - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectCompanionSeat();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Select companion and wheelchair seat - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
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

  test('Select companion and wheelchair seat - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectCompanionAndWheelchairSeats();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await seatPicker.confirmSeats();
  });

  test('Select one sofa correctly - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.selectSofaSeat();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await seatPicker.confirmSeats();
  });

  test('Select one sofa correctly - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.selectSofaSeat();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await seatPicker.confirmSeats();
  });

  test('Select sofa leaving 1 space - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.selectMiddleOfThreeContiguousSeats();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Select sofa leaving 1 space - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.selectMiddleOfThreeContiguousSeats();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Select only wheelchair seat - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5638', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectRandomAvailableWheelchairSeat();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await seatPicker.confirmSeats();
  });

  test('Select only wheelchair seat - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5638', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectRandomAvailableWheelchairSeat();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await seatPicker.confirmSeats();
  });

  test('Attempt to select sofa seats leaving an empty space between selection - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.selectSofaSeatsWithEmptySpaceBetween();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Attempt to select sofa seats leaving an empty space between selection - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.selectSofaSeatsWithEmptySpaceBetween();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Attempt to select sofa seats separating group in the same row - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.selectSofaSeatsSeparatingGroupInSameRow();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Attempt to select sofa seats separating group in the same row - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.selectSofaSeatsSeparatingGroupInSameRow();
    await assertWarningMessageDisplayed(seatPicker.page);
    await assertConfirmButtonDisabled(seatPicker.page);
  });

  test('Select sofa seats separating group in different rows - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.selectSofaSeatsSeparatingGroupInDifferentRows();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await seatPicker.confirmSeats();
  });

  test('Select sofa seats separating group in different rows - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.selectSofaSeatsSeparatingGroupInDifferentRows();
    await assertWarningMessageNotDisplayed(seatPicker.page);
    await assertConfirmButtonEnabled(seatPicker.page);
    await seatPicker.confirmSeats();
  });

  test('should display regular and sofa ticket type - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    loginPage,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4665', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.getRegularAndSofaSeatTypes();
    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    const ticketTypeNames = await ticketPicker.getTicketTypeNames();
    assertTicketTypeNamesMatchExpectedTexts(
      ticketTypeNames,
      ticketTypeMappings
    );
  });

  test('should display regular and sofa ticket type - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    loginPage,
  }) => {
    test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4665', async () => {});
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectDBoxRandomFilmAndShowtime();
    await seatPicker.acceptDBoxMessage();
    await seatPicker.getRegularAndSofaSeatTypes();
    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    const ticketTypeNames = await ticketPicker.getTicketTypeNames();
    assertTicketTypeNamesMatchExpectedTexts(
      ticketTypeNames,
      ticketTypeMappings
    );
  });

  test('Simulate a Full Purchase with promotional code - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    loginPage,
  }) => {
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectLastAvailableSeat();
    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    await ticketPicker.selectPromotionalCode(PROMO_CODE_OPTIONS[0].values[0]);
  });

  test('Simulate a Full Purchase with promotional code - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    loginPage,
  }) => {
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectLastAvailableSeat();
    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    await ticketPicker.selectPromotionalCode(PROMO_CODE_OPTIONS[0].values[0]);
  });

  test('Simulate a Full Purchase with promotional code - La Vanguardia - Oasiz', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    loginPage,
  }) => {
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectLastAvailableSeat();
    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    await ticketPicker.selectPromotionalCode(PROMO_CODE_OPTIONS[1].values[0]);
  });

  test('Simulate a Full Purchase with promotional code - La Vanguardia - Grancasa', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    loginPage,
  }) => {
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    await cinemaDetail.selectNormalRandomFilmAndShowtime();
    await seatPicker.selectLastAvailableSeat();
    await seatPicker.confirmSeats();
    await loginPage.clickContinueAsGuest();
    await ticketPicker.selectPromotionalCode(PROMO_CODE_OPTIONS[1].values[0]);
  });

  //TODO rule: allowWhenAllSeatsBetweenTheSeatGapAndAnUnavailableSeatAreSelected
  //Modifies the above to allow the leaving of a single seat gap so long as it’s only one side and your selection abuts an existing order.
  //implementacion cuando podamos configurar la sala como querramos. imposible encontrar escenario armado
});
