import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { analyticsTestData } from './analytics.data';
import {
  assertEventsWereCaptured,
  assertCriticalEventsExist,
  assertBeginCheckoutEventStructure,
  assertAnalyticsTotalIsReasonable,
  assertEcommerceItemsStructure,
  attachEventsToReport,
  logAnalyticsSummary,
  logGrancasaAnalyticsSummary,
} from './analytics.assertions';

// Extend window type to include dataLayer and our custom properties
declare global {
  interface Window {
    dataLayer: any[];
    dataLayerEvents: any[];
  }
}

test.describe('Google Analytics DataLayer Validation', () => {
  test.beforeEach(async ({ page, navbar, cookieBanner, promotionalModal }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test('Validate analytics events capture - Oasiz with Classic menu', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    barPage,
    purchaseSummary,
    loginPage,
    analyticsPage,
  }) => {
    const cinemaName = analyticsTestData.cinemaNames.oasiz;
    const menuType = 'Classic';

    await analyticsPage.initializeDataLayerCapture();

    try {
      await navbar.navigateToCinemas();
      await cinema.selectOasizCinema();
      await cinemaDetail.selectNormalRandomFilmAndShowtime();
      await seatPicker.selectLastAvailableSeat();
      await seatPicker.confirmSeats();
      await loginPage.clickContinueAsGuest();
      await ticketPicker.selectTicket();
      await barPage.buyClassicMenuOasiz();
      await purchaseSummary.acceptAndContinue();

      // Validate analytics - LÓGICA CENTRAL ORIGINAL
      const allEvents = await analyticsPage.captureDataLayerEvents();
      await assertEventsWereCaptured(allEvents);

      const { addToCartEvents, beginCheckoutEvents } =
        await assertCriticalEventsExist(allEvents);
      const latestBeginCheckout =
        beginCheckoutEvents[beginCheckoutEvents.length - 1];

      await assertBeginCheckoutEventStructure(latestBeginCheckout);

      const analyticsTotal = latestBeginCheckout.ecommerce?.value || 0;
      await assertAnalyticsTotalIsReasonable(analyticsTotal);

      if (latestBeginCheckout.ecommerce?.items) {
        await assertEcommerceItemsStructure(latestBeginCheckout.ecommerce.items);
      }

      const itemsTotal =
        latestBeginCheckout.ecommerce?.items?.reduce((sum: number, item: any) => {
          return sum + item.price * (item.quantity || 1);
        }, 0) || 0;

    await attachEventsToReport(test.info(), allEvents, latestBeginCheckout);
    await logAnalyticsSummary(
      cinemaName,
      menuType,
      allEvents,
      addToCartEvents,
      beginCheckoutEvents,
      latestBeginCheckout
    );
    } catch (error: any) {
      // Handle sold out scenario - skip test gracefully
      if (error.message && error.message.includes('SOLD_OUT_SKIP_TEST')) {
        test.skip(true, 'Tickets sold out - expected in LAB environment');
        return;
      }
      // Re-throw other errors
      throw error;
    }
  });

  test('Validate analytics events capture - Grancasa with Classic menu', async ({
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
    ticketPicker,
    barPage,
    purchaseSummary,
    loginPage,
    analyticsPage,
  }) => {
    await analyticsPage.initializeDataLayerCapture();

    try {
      await navbar.navigateToCinemas();
      await cinema.selectGrancasaCinema();
      await cinemaDetail.selectNormalRandomFilmAndShowtime();
      await seatPicker.selectLastAvailableSeat();
      await seatPicker.confirmSeats();
      await loginPage.clickContinueAsGuest();
      await ticketPicker.selectTicket();
      await barPage.buyClassicMenuGrancasa();
      await purchaseSummary.acceptAndContinue();

      // Validate analytics
      const allEvents = await analyticsPage.captureDataLayerEvents();
      await assertEventsWereCaptured(allEvents);

      const { addToCartEvents, beginCheckoutEvents } =
        await assertCriticalEventsExist(allEvents);
      const latestBeginCheckout =
        beginCheckoutEvents[beginCheckoutEvents.length - 1];

      await assertAnalyticsTotalIsReasonable(latestBeginCheckout);
      await logGrancasaAnalyticsSummary(
        allEvents,
        addToCartEvents,
        beginCheckoutEvents,
        latestBeginCheckout
      );
    } catch (error: any) {
      // Handle sold out scenario - skip test gracefully
      if (error.message && error.message.includes('SOLD_OUT_SKIP_TEST')) {
        test.skip(true, 'Tickets sold out - expected in LAB environment');
        return;
      }
      // Re-throw other errors
      throw error;
    }
  });
});
