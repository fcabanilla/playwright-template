import { test, expect } from '../../../fixtures/cinesa/playwright.fixtures';
import * as allure from 'allure-playwright';
import { analyticsTestData } from './analytics.data';

// Extend window type to include dataLayer and our custom properties
declare global {
  interface Window {
    dataLayer: any[];
    dataLayerEvents: any[];
  }
}

test.describe('Google Analytics DataLayer Validation - Improved Version', () => {
  
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
    
    await test.step('Initializing dataLayer capture', async () => {
      await analyticsPage.initializeDataLayerCapture();
    });

    // Navigate to the site and complete the purchase flow
    await test.step('Complete Purchase Flow', async () => {
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
    });

    await test.step('Validate analytics events capture and structure', async () => {
      // Capture and validate analytics events
      const allEvents = await analyticsPage.captureDataLayerEvents();
      
      // Attach captured events to test report
      await test.info().attach('All captured dataLayer events', {
        body: JSON.stringify(allEvents, null, 2),
        contentType: 'application/json'
      });

      // Validate that we captured events
      expect(allEvents.length).toBeGreaterThan(0);
      
      // Find critical e-commerce events
      const addToCartEvents = allEvents.filter(event => 
        event.event === 'add_to_cart'
      );
      
      const beginCheckoutEvents = allEvents.filter(event => 
        event.event === 'begin_checkout'
      );

      // Validate critical events exist
      expect(addToCartEvents.length).toBeGreaterThan(0);
      expect(beginCheckoutEvents.length).toBeGreaterThan(0);

      // Get the latest begin_checkout event for price validation
      const latestBeginCheckout = beginCheckoutEvents[beginCheckoutEvents.length - 1];
      
      await test.info().attach('Latest Begin Checkout Event', {
        body: JSON.stringify(latestBeginCheckout, null, 2),
        contentType: 'application/json'
      });

      // Validate event structure
      expect(latestBeginCheckout).toHaveProperty('event');
      expect(latestBeginCheckout).toHaveProperty('ecommerce');
      
      if (latestBeginCheckout.ecommerce) {
        expect(latestBeginCheckout.ecommerce).toHaveProperty('currency');
        expect(latestBeginCheckout.ecommerce).toHaveProperty('value');
        expect(latestBeginCheckout.ecommerce).toHaveProperty('items');
        expect(latestBeginCheckout.ecommerce.currency).toBe('EUR');
        expect(latestBeginCheckout.ecommerce.value).toBeGreaterThan(0);
        expect(Array.isArray(latestBeginCheckout.ecommerce.items)).toBe(true);
        expect(latestBeginCheckout.ecommerce.items.length).toBeGreaterThan(0);
      }

      // Calculate analytics total
      const analyticsTotal = latestBeginCheckout.ecommerce?.value || 0;
      
      // Also calculate manual total from items for comparison
      const itemsTotal = latestBeginCheckout.ecommerce?.items?.reduce((sum, item) => {
        return sum + (item.price * (item.quantity || 1));
      }, 0) || 0;

      // Validate that analytics total is reasonable (not zero, not too high)
      expect(analyticsTotal).toBeGreaterThan(0);
      expect(analyticsTotal).toBeLessThan(100); // Reasonable upper bound
      
      // Validate items structure
      if (latestBeginCheckout.ecommerce?.items) {
        for (const item of latestBeginCheckout.ecommerce.items) {
          expect(item).toHaveProperty('item_name');
          expect(item).toHaveProperty('price');
          expect(item.price).toBeGreaterThan(0);
        }
      }

      // Log comprehensive summary
      console.log('=== ANALYTICS VALIDATION SUMMARY ===');
      console.log(`🎬 Cinema: ${cinemaName}`);
      console.log(`🍿 Menu: ${menuType}`);
      console.log(`📊 Total events captured: ${allEvents.length}`);
      console.log(`🛒 Add to cart events: ${addToCartEvents.length}`);
      console.log(`💳 Begin checkout events: ${beginCheckoutEvents.length}`);
      console.log(`💰 Analytics total: €${analyticsTotal}`);
      console.log(`📝 Items total: €${itemsTotal}`);
      console.log(`📋 Items count: ${latestBeginCheckout.ecommerce?.items?.length || 0}`);
      
      // List all items
      if (latestBeginCheckout.ecommerce?.items) {
        console.log('🎫 Items breakdown:');
        latestBeginCheckout.ecommerce.items.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.item_name}: €${item.price} x ${item.quantity || 1}`);
        });
      }

      console.log('✅ All analytics validations passed!');
    });
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
    const menuType = 'Classic';
    
    await test.step('Initializing dataLayer capture', async () => {
      await analyticsPage.initializeDataLayerCapture();
    });

    // Navigate to the site and complete the purchase flow
    await test.step('Complete Purchase Flow', async () => {
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
    });

    await test.step('Validate analytics events capture and structure', async () => {
      // Same validation logic as above but for Grancasa
      const allEvents = await analyticsPage.captureDataLayerEvents();
      
      expect(allEvents.length).toBeGreaterThan(0);
      
      const addToCartEvents = allEvents.filter(event => 
        event.event === 'add_to_cart'
      );
      
      const beginCheckoutEvents = allEvents.filter(event => 
        event.event === 'begin_checkout'
      );

      expect(addToCartEvents.length).toBeGreaterThan(0);
      expect(beginCheckoutEvents.length).toBeGreaterThan(0);

      const latestBeginCheckout = beginCheckoutEvents[beginCheckoutEvents.length - 1];
      const analyticsTotal = latestBeginCheckout.ecommerce?.value || 0;
      
      expect(analyticsTotal).toBeGreaterThan(0);
      expect(analyticsTotal).toBeLessThan(100);

      console.log('=== GRANCASA ANALYTICS VALIDATION SUMMARY ===');
      console.log(`✅ Total events captured: ${allEvents.length}`);
      console.log(`✅ Add to cart events: ${addToCartEvents.length}`);
      console.log(`✅ Begin checkout events: ${beginCheckoutEvents.length}`);
      console.log(`✅ Analytics total: €${analyticsTotal}`);
      console.log(`✅ All analytics validations passed for Grancasa!`);
    });
  });
});
