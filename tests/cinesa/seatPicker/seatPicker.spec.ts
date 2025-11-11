import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
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
import { assertNoCloudflareProtection } from '../../helpers/cloudflareDetector';
import { getCinemasForEnvironment } from './seatPicker.data';

// Get available cinemas for current environment
const CINEMAS = getCinemasForEnvironment();

test.describe('Seat Picker - Seat Selection', () => {
  test.beforeEach(async ({ page, navbar, cookieBanner }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Seat Picker - Seat Selection');

    await navbar.navigateToHome();
    await assertNoCloudflareProtection(page, 'beforeEach setup');
    await cookieBanner.acceptAllCookies();
  });

  test.describe('Complete Purchase Flow', () => {
    test.beforeEach(async () => {
      await allure.story('Complete purchase from seat selection');
    });

    // Parametrized by cinema
    for (const cinema of CINEMAS) {
      test(
        `Full purchase with single seat - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@e2e',
            '@booking',
            '@COMS-16843',
            '@broken-prod',
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
          await allure.parameter('User Type', 'Guest');

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          await seatPicker.selectLastAvailableSeat();
          await seatPicker.confirmSeats();
          await loginPage.clickContinueAsGuest();
          await ticketPicker.selectTicket();
          await barPage.skipBar();
          await purchaseSummary.acceptAndContinue();
          await paymentPage.completePayment();
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Full purchase with multiple seats - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@e2e',
            '@booking',
            '@COMS-16842',
            '@COMS-5087',
            '@broken-prod',
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

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          const seatsToSelect = 4;
          await seatPicker.selectLastAvailableSeats(seatsToSelect);
          await seatPicker.confirmSeats();
          await loginPage.clickContinueAsGuest();
          await ticketPicker.selectTicket(seatsToSelect);
          await barPage.skipBar();
          await purchaseSummary.acceptAndContinue();
          await paymentPage.completePayment();
        }
      );
    }
  });

  test.describe('Seat Selection Validation', () => {
    test.beforeEach(async () => {
      await allure.story('Seat selection validation rules');
    });

    for (const cinema of CINEMAS) {
      test(
        `Attempt to select seats leaving empty space between selection - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@validation',
            '@COMS-5620',
            '@broken-prod',
            ...cinema.tags,
          ],
        },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5620', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          await seatPicker.selectSeatsWithEmptySpaceBetween();
          await assertWarningMessageDisplayed(seatPicker.page);
          await assertConfirmButtonDisabled(seatPicker.page);
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Attempt to select seats separating group in same row - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@validation',
            '@COMS-4752',
            '@broken-prod',
            ...cinema.tags,
          ],
        },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4752', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          await seatPicker.selectSeatsSeparatingGroupInSameRow();
          await assertWarningMessageDisplayed(seatPicker.page);
          await assertConfirmButtonDisabled(seatPicker.page);
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Select seats separating group in different rows - ${cinema.name}`,
        { tag: ['@seatpicker', '@cinesa', '@validation', '@broken-prod', ...cinema.tags] },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5620', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          await seatPicker.selectSeatsSeparatingGroupInDifferentRows();
          await assertWarningMessageNotDisplayed(seatPicker.page);
          await assertConfirmButtonEnabled(seatPicker.page);
          await seatPicker.confirmSeats();
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `No seat selection validation - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@validation',
            '@COMS-4853',
            ...cinema.tags,
          ],
        },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          await assertConfirmButtonDisabled(seatPicker.page);
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Select more than max seat capacity - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@validation',
            '@COMS-5088',
            ...cinema.tags,
          ],
        },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5088', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          const selectedSeats = await seatPicker.selectMoreThanMaxSeats();
          await assertWarningMessageNotDisplayed(seatPicker.page);
          await assertConfirmButtonEnabled(seatPicker.page);
          await assertFirstSeatsDeselected(selectedSeats);
          await assertLastSeatsSelected(selectedSeats);
        }
      );
    }
  });

  test.describe('Accessibility - Wheelchair and Companion Seats', () => {
    test.beforeEach(async () => {
      await allure.story('Wheelchair and companion seat selection');
    });

    for (const cinema of CINEMAS) {
      test(
        `Select only companion seat - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@accessibility',
            '@COMS-4853',
            '@broken-prod',
            ...cinema.tags,
          ],
        },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          await seatPicker.selectCompanionSeat();
          await assertWarningMessageDisplayed(seatPicker.page);
          await assertConfirmButtonDisabled(seatPicker.page);
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Select companion and wheelchair seat - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@accessibility',
            '@fix-test',
            '@broken-prod',
            ...cinema.tags,
          ],
        },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          await seatPicker.selectCompanionAndWheelchairSeats();
          await assertWarningMessageNotDisplayed(seatPicker.page);
          await assertConfirmButtonEnabled(seatPicker.page);
          await seatPicker.confirmSeats();
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Select only wheelchair seat - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@accessibility',
            '@COMS-5638',
            ...cinema.tags,
          ],
        },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-5638', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          await seatPicker.selectRandomAvailableWheelchairSeat();
          await assertWarningMessageNotDisplayed(seatPicker.page);
          await assertConfirmButtonEnabled(seatPicker.page);
          await seatPicker.confirmSeats();
        }
      );
    }
  });

  test.describe('D-BOX Sofa Seat Selection', () => {
    test.beforeEach(async () => {
      await allure.story('D-BOX sofa seat selection and validation');
    });

    for (const cinema of CINEMAS) {
      test(
        `Select one sofa seat correctly - ${cinema.name}`,
        { tag: ['@seatpicker', '@cinesa', '@dbox', ...cinema.tags] },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectDBoxRandomFilmAndShowtime();
          await seatPicker.acceptDBoxMessage();
          await seatPicker.selectSofaSeat();
          await assertWarningMessageNotDisplayed(seatPicker.page);
          await assertConfirmButtonEnabled(seatPicker.page);
          await seatPicker.confirmSeats();
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Select sofa leaving 1 space - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@dbox',
            '@validation',
            ...cinema.tags,
          ],
        },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectDBoxRandomFilmAndShowtime();
          await seatPicker.acceptDBoxMessage();
          await seatPicker.selectMiddleOfThreeContiguousSeats();
          await assertWarningMessageDisplayed(seatPicker.page);
          await assertConfirmButtonDisabled(seatPicker.page);
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Attempt to select sofa seats leaving empty space between selection - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@dbox',
            '@validation',
            '@broken-prod',
            ...cinema.tags,
          ],
        },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectDBoxRandomFilmAndShowtime();
          await seatPicker.acceptDBoxMessage();
          await seatPicker.selectSofaSeatsWithEmptySpaceBetween();
          await assertWarningMessageDisplayed(seatPicker.page);
          await assertConfirmButtonDisabled(seatPicker.page);
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Attempt to select sofa seats separating group in same row - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@dbox',
            '@validation',
            ...cinema.tags,
          ],
        },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectDBoxRandomFilmAndShowtime();
          await seatPicker.acceptDBoxMessage();
          await seatPicker.selectSofaSeatsSeparatingGroupInSameRow();
          await assertWarningMessageDisplayed(seatPicker.page);
          await assertConfirmButtonDisabled(seatPicker.page);
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Select sofa seats separating group in different rows - ${cinema.name}`,
        { tag: ['@seatpicker', '@cinesa', '@dbox', ...cinema.tags] },
        async ({ navbar, cinema: cinemaPage, cinemaDetail, seatPicker }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4853', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectDBoxRandomFilmAndShowtime();
          await seatPicker.acceptDBoxMessage();
          await seatPicker.selectSofaSeatsSeparatingGroupInDifferentRows();
          await assertWarningMessageNotDisplayed(seatPicker.page);
          await assertConfirmButtonEnabled(seatPicker.page);
          await seatPicker.confirmSeats();
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Display regular and sofa ticket types - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@dbox',
            '@ticketpicker',
            '@COMS-4665',
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
        }) => {
          test.step('TC: https://se-ocg.atlassian.net/browse/COMS-4665', async () => {});

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectDBoxRandomFilmAndShowtime();
          await seatPicker.acceptDBoxMessage();
          await seatPicker.getRegularAndSofaSeatTypes();
          await seatPicker.confirmSeats();

          await test.step('Continue as guest user', async () => {
            await loginPage.clickContinueAsGuest();
          });

          const ticketTypeNames =
            await test.step('Get ticket type names from picker', async () => {
              return await ticketPicker.getTicketTypeNames();
            });

          await test.step('Verify ticket types include regular and D-BOX options', async () => {
            assertTicketTypeNamesMatchExpectedTexts(
              ticketTypeNames,
              ticketTypeMappings
            );
          });
        }
      );
    }
  });

  test.describe('Promotional Codes', () => {
    test.beforeEach(async () => {
      await allure.story('Promotional code application in booking flow');
    });

    for (const cinema of CINEMAS) {
      test(
        `Full purchase with standard promotional code - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@promo',
            '@ticketpicker',
            '@COMS-16845',
            '@fix-test',
            '@broken-prod',
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
        }) => {
          await allure.parameter('Cinema', cinema.name);
          await allure.parameter('Promo Code', 'Standard');

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          await seatPicker.selectLastAvailableSeat();
          await seatPicker.confirmSeats();
          await loginPage.clickContinueAsGuest();
          await ticketPicker.selectPromotionalCode(
            PROMO_CODE_OPTIONS[0].values[0]
          );
        }
      );
    }

    for (const cinema of CINEMAS) {
      test(
        `Full purchase with La Vanguardia promotional code - ${cinema.name}`,
        {
          tag: [
            '@seatpicker',
            '@cinesa',
            '@promo',
            '@ticketpicker',
            '@COMS-16844',
            '@fix-test',
            '@broken-prod',
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
        }) => {
          await allure.parameter('Cinema', cinema.name);
          await allure.parameter('Promo Code', 'La Vanguardia');

          await navbar.navigateToCinemas();
          await cinemaPage[cinema.selectMethod]();
          await cinemaDetail.selectNormalRandomFilmAndShowtime();
          await seatPicker.selectLastAvailableSeat();
          await seatPicker.confirmSeats();
          await loginPage.clickContinueAsGuest();
          await ticketPicker.selectPromotionalCode(
            PROMO_CODE_OPTIONS[1].values[0]
          );
        }
      );
    }
  });

  /**
   * TODO: Implement when room configuration is available
   * Rule: allowWhenAllSeatsBetweenTheSeatGapAndAnUnavailableSeatAreSelected
   *
   * This rule allows leaving a single seat gap when the selection
   * abuts an existing order on one side.
   */
});
