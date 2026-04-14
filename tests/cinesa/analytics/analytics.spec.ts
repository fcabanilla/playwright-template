import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../core/allure/allureMetadata';
import { getAnalyticsTestConfigs } from './analytics.data';
import {
  assertEventsWereCaptured,
  assertCriticalEventsExist,
  assertBeginCheckoutEventStructure,
  assertAnalyticsTotalIsReasonable,
  assertEcommerceItemsStructure,
  attachEventsToReport,
  logAnalyticsSummary,
} from './analytics.assertions';
import type { DataLayerEvent } from '../../../pageObjectsManagers/cinesa/analytics/analytics.types';
import { getShowtimeSelectionForWorker } from '../../../config/showtimes.pool';

// Get available analytics test configurations for current environment
const ANALYTICS_CONFIGS = getAnalyticsTestConfigs();

// Extend window type to include dataLayer and our custom properties
declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
    dataLayerEvents: DataLayerEvent[];
  }
}

test.describe('Google Analytics DataLayer Validation', () => {
  test.beforeEach(async ({ page, navbar, promotionalModal }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Analytics - Tracking');
    await enrichTestMetadata(testInfo);

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  for (const config of ANALYTICS_CONFIGS) {
    test(
      `GA4 · Data Layer · Validate events · ${config.menuType} menu — ${config.cinema.name}`,
      {
        tag: [
          '@lab-fail',
          '@preprod-broken',
          '@analytics',
          '@cinesa',
          '@e2e',
          '@ga4',
          '@COMS-13733',
          '@COMS-13727',
          '@fix-test',
          '@broken-prod',
          ...config.cinema.tags,
        ],
      },
      async ({
        navbar,
        cinema,
        cinemaDetail,
        seatPicker,
        ticketPicker,
        barPage,
        purchaseSummary,
        loginPage,
        analyticsPage,
      }) => {
        await allure.story(
          `COMS-13733 / COMS-13727 - GA4 DataLayer validation - ${config.cinema.name} - ${config.menuType}`
        );
        await analyticsPage.initializeDataLayerCapture();

        try {
          await navbar.navigateToCinemas();
          await cinema[config.cinema.selectMethod]();
          await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(
            getShowtimeSelectionForWorker(test.info().parallelIndex)
          );
          await seatPicker.selectLastAvailableSeat();
          await seatPicker.confirmSeats();
          await loginPage.clickContinueAsGuest();
          await ticketPicker.selectTicket();
          await barPage[config.menuMethod]();
          await purchaseSummary.acceptAndContinue();

          // Validate analytics - LÓGICA CENTRAL ORIGINAL
          const allEvents = await analyticsPage.captureDataLayerEvents();
          await assertEventsWereCaptured(allEvents);

          const { addToCartEvents, beginCheckoutEvents } =
            await assertCriticalEventsExist(allEvents);
          const latestBeginCheckout =
            beginCheckoutEvents[beginCheckoutEvents.length - 1];

          await assertBeginCheckoutEventStructure(latestBeginCheckout);

          await assertAnalyticsTotalIsReasonable(latestBeginCheckout);

          if (latestBeginCheckout.ecommerce?.items) {
            await assertEcommerceItemsStructure(latestBeginCheckout);
          }

          await attachEventsToReport(
            test.info(),
            allEvents,
            latestBeginCheckout
          );
          await logAnalyticsSummary(
            config.cinema.name,
            config.menuType,
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
      }
    );
  }
});
