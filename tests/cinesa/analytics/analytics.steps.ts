/**
 * Reusable steps for Google Analytics tests
 * These functions contain common test steps that can be reused across multiple tests
 */

import { test } from '../../../fixtures/cinesa/playwright.fixtures';

export class AnalyticsSteps {
  
  /**
   * Complete the full purchase flow for analytics testing
   */
  static async completePurchaseFlow(
    cinemaName: string,
    menuType: string,
    fixtures: any
  ) {
    const { navbar, cinema, cinemaDetail, cookieBanner, seatPicker, ticketPicker, barPage, purchaseSummary, loginPage } = fixtures;
    
    await test.step('Complete Purchase Flow', async () => {
      await cookieBanner.acceptCookies();
      await navbar.navigateToCinemas();
      
      // Select cinema based on name
      if (cinemaName === 'Oasiz') {
        await cinema.selectOasizCinema();
      } else if (cinemaName === 'Grancasa') {
        await cinema.selectGrancasaCinema();
      }
      
      await cinemaDetail.selectNormalRandomFilmAndShowtime();
      await seatPicker.selectLastAvailableSeat();
      await seatPicker.confirmSeats();
      await loginPage.clickContinueAsGuest();
      await ticketPicker.selectTicket();
      
      // Select menu based on cinema and type
      if (cinemaName === 'Oasiz' && menuType === 'Classic') {
        await barPage.buyClassicMenuOasiz();
      } else if (cinemaName === 'Grancasa' && menuType === 'Classic') {
        await barPage.buyClassicMenuGrancasa();
      }
      
      await purchaseSummary.acceptAndContinue();
    });
  }

  /**
   * Initialize analytics capture and prepare for event monitoring
   */
  static async initializeAnalyticsCapture(analyticsPage: any) {
    await test.step('Initialize dataLayer capture', async () => {
      await analyticsPage.initializeDataLayerCapture();
    });
  }

  /**
   * Validate and log analytics events summary
   */
  static async logAnalyticsSummary(
    cinemaName: string,
    menuType: string,
    allEvents: any[],
    addToCartEvents: any[],
    beginCheckoutEvents: any[],
    analyticsTotal: number
  ) {
    await test.step('Log analytics summary', async () => {
      console.log('=== ANALYTICS VALIDATION SUMMARY ===');
      console.log(`🎬 Cinema: ${cinemaName}`);
      console.log(`🍿 Menu: ${menuType}`);
      console.log(`📊 Total events captured: ${allEvents.length}`);
      console.log(`🛒 Add to cart events: ${addToCartEvents.length}`);
      console.log(`💳 Begin checkout events: ${beginCheckoutEvents.length}`);
      console.log(`💰 Analytics total: €${analyticsTotal}`);
      console.log('✅ All analytics validations passed!');
    });
  }
}
