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
  logGrancasaAnalyticsSummary
} from './analytics.assertions';

// Extend window type to include dataLayer and our custom properties
declare global {
  interface Window {
    dataLayer: any[];
    dataLayerEvents: any[];
  }
}

test.describe('Google Analytics DataLayer Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.cinesa.es/');
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
    analyticsPage
  }) => {
    const cinemaName = analyticsTestData.cinemaNames.oasiz;
    const menuType = 'Classic';
    
    await analyticsPage.initializeDataLayerCapture();

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

    // Validate analytics
    const allEvents = await analyticsPage.captureDataLayerEvents();
    await assertEventsWereCaptured(allEvents);
    
    const { addToCartEvents, beginCheckoutEvents } = await assertCriticalEventsExist(allEvents);
    const latestBeginCheckout = beginCheckoutEvents[beginCheckoutEvents.length - 1];
    
    await assertBeginCheckoutEventStructure(latestBeginCheckout);
    
    const analyticsTotal = latestBeginCheckout.ecommerce?.value || 0;
    await assertAnalyticsTotalIsReasonable(analyticsTotal);
    
    if (latestBeginCheckout.ecommerce?.items) {
      await assertEcommerceItemsStructure(latestBeginCheckout.ecommerce.items);
    }

    const itemsTotal = latestBeginCheckout.ecommerce?.items?.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0) || 0;

    await attachEventsToReport(test.info(), allEvents, latestBeginCheckout);
    await logAnalyticsSummary(cinemaName, menuType, allEvents, addToCartEvents, beginCheckoutEvents, analyticsTotal, itemsTotal, latestBeginCheckout);
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
    analyticsPage
  }) => {
    const cinemaName = analyticsTestData.cinemaNames.grancasa;
    
    await analyticsPage.initializeDataLayerCapture();

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

    // Validate analytics
    const allEvents = await analyticsPage.captureDataLayerEvents();
    await assertEventsWereCaptured(allEvents);
    
    const { addToCartEvents, beginCheckoutEvents } = await assertCriticalEventsExist(allEvents);
    const latestBeginCheckout = beginCheckoutEvents[beginCheckoutEvents.length - 1];
    const analyticsTotal = latestBeginCheckout.ecommerce?.value || 0;
    
    await assertAnalyticsTotalIsReasonable(analyticsTotal);
    await logGrancasaAnalyticsSummary(allEvents, addToCartEvents, beginCheckoutEvents, analyticsTotal);
  });
});
