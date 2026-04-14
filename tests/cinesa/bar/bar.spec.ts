import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../core/allure/allureMetadata';
import { getBarMenuConfigs } from './bar.data';
import { getShowtimeSelectionForWorker } from '../../../config/showtimes.pool';

// Get available bar menu configurations for current environment
const BAR_MENUS = getBarMenuConfigs();

test.describe('Bar - Servicios de Comida y Bebida', () => {
  test.beforeEach(async ({ navbar, promotionalModal }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Bar & Food Services');
    await enrichTestMetadata(testInfo);
    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  test.describe('Menú Clásico - Single Ticket', () => {
    test.beforeEach(async ({}, testInfo) => {
      await allure.story('Compra con Menú Clásico - 1 entrada');
    });

    for (const menuConfig of BAR_MENUS) {
      test(
        `F&B · Classic Menu · Purchase · Single ticket — ${menuConfig.cinema.name}`,
        {
          tag: [
            '@rerun-cf',
            '@lab-pass',
            '@preprod-broken',
            '@bar',
            '@cinesa',
            '@e2e',
            '@booking',
            '@COMS-16857',
            '@fix-test',
            '@broken-prod',
            ...menuConfig.cinema.tags,
          ],
        },
        async ({
          navbar,
          cinema,
          cinemaDetail,
          seatPicker,
          ticketPicker,
          loginPage,
          barPage,
          purchaseSummary,
        }) => {
          await allure.parameter('Cinema', menuConfig.cinema.name);
          await allure.parameter('Menu Type', menuConfig.menuType);
          await allure.parameter('Tickets', '1');

          await navbar.navigateToCinemas();
          await cinema[menuConfig.cinema.selectMethod]();
          await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(
            getShowtimeSelectionForWorker(test.info().parallelIndex)
          );
          await seatPicker.selectLastAvailableSeat();
          await seatPicker.confirmSeats();
          await loginPage.clickContinueAsGuest();
          await ticketPicker.selectTicket();
          await barPage[menuConfig.menuMethod]();
          await purchaseSummary.acceptAndContinue();
        }
      );
    }
  });

  test.describe('Menú Clásico - Multiple Tickets', () => {
    test.beforeEach(async ({}, testInfo) => {
      await allure.story('Compra con Menú Clásico - múltiples entradas');
    });

    for (const menuConfig of BAR_MENUS) {
      test(
        `F&B · Classic Menu · Purchase · Multiple tickets — ${menuConfig.cinema.name}`,
        {
          tag: [
            '@rerun-cf',
            '@lab-pass',
            '@preprod-broken',
            '@bar',
            '@cinesa',
            '@e2e',
            '@booking',
            '@COMS-16858',
            '@multiple',
            '@fix-test',
            '@broken-prod',
            ...menuConfig.cinema.tags,
          ],
        },
        async ({
          navbar,
          cinema,
          cinemaDetail,
          seatPicker,
          ticketPicker,
          loginPage,
          barPage,
          purchaseSummary,
        }) => {
          const seatsToSelect = 4;
          await allure.parameter('Cinema', menuConfig.cinema.name);
          await allure.parameter('Menu Type', menuConfig.menuType);
          await allure.parameter('Tickets', seatsToSelect.toString());

          await navbar.navigateToCinemas();
          await cinema[menuConfig.cinema.selectMethod]();
          await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(
            getShowtimeSelectionForWorker(test.info().parallelIndex)
          );
          await seatPicker.selectLastAvailableSeats(seatsToSelect);
          await seatPicker.confirmSeats();
          await loginPage.clickContinueAsGuest();
          await ticketPicker.selectTicket(seatsToSelect);
          await barPage[menuConfig.menuMethod]();
          await purchaseSummary.acceptAndContinue();
        }
      );
    }
  });
});
