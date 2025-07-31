import { expect } from '@playwright/test';
import { DataLayerEvent, PriceSummary } from '../../../pageObjectsManagers/cinesa/analytics/analytics.page';
import { analyticsTestData } from './analytics.data';

/**
 * Asserts that the required analytics events are present.
 * @param events Array of captured dataLayer events.
 */
export function assertRequiredEventsPresent(events: DataLayerEvent[]): void {
  const addToCartEvents = events.filter(event => event.event === analyticsTestData.expectedEventTypes.addToCart);
  const beginCheckoutEvents = events.filter(event => event.event === analyticsTestData.expectedEventTypes.beginCheckout);

  expect(
    addToCartEvents.length,
    `Expected at least 2 add_to_cart events (ticket + F&B), but found ${addToCartEvents.length}`
  ).toBeGreaterThanOrEqual(2);

  expect(
    beginCheckoutEvents.length,
    `Expected at least 1 begin_checkout event, but found ${beginCheckoutEvents.length}`
  ).toBeGreaterThanOrEqual(1);
}

/**
 * Asserts that the begin_checkout event has the required structure.
 * @param beginCheckoutEvent The begin_checkout event to validate.
 */
export function assertBeginCheckoutEventStructure(beginCheckoutEvent: DataLayerEvent): void {
  expect(beginCheckoutEvent.event, 'Event type should be begin_checkout').toBe('begin_checkout');
  expect(beginCheckoutEvent.ecommerce, 'begin_checkout event should have ecommerce data').toBeDefined();
  expect(beginCheckoutEvent.ecommerce?.items, 'begin_checkout event should have items array').toBeDefined();
  expect(beginCheckoutEvent.ecommerce?.currency, 'begin_checkout event should have currency').toBe(analyticsTestData.expectedCurrency);
  expect(beginCheckoutEvent.ecommerce?.value, 'begin_checkout event should have total value').toBeDefined();
  expect(beginCheckoutEvent.ecommerce?.transaction_id, 'begin_checkout event should have transaction ID').toBeDefined();
}

/**
 * Asserts that ticket prices match between UI and analytics.
 * @param uiPrices Prices extracted from UI.
 * @param analyticsPrices Prices calculated from analytics.
 */
export function assertTicketPricesMatch(uiPrices: PriceSummary, analyticsPrices: { ticketPrice: number; foodBeveragePrice: number }): void {
  const priceDifference = Math.abs(uiPrices.ticketPrice - analyticsPrices.ticketPrice);
  
  expect(
    priceDifference,
    `Ticket price mismatch: UI shows €${uiPrices.ticketPrice}, Analytics shows €${analyticsPrices.ticketPrice}`
  ).toBeLessThan(analyticsTestData.priceToleranceEur);
}

/**
 * Asserts that food & beverage prices match between UI and analytics.
 * @param uiPrices Prices extracted from UI.
 * @param analyticsPrices Prices calculated from analytics.
 */
export function assertFoodBeveragePricesMatch(uiPrices: PriceSummary, analyticsPrices: { ticketPrice: number; foodBeveragePrice: number }): void {
  const priceDifference = Math.abs(uiPrices.foodBeveragePrice - analyticsPrices.foodBeveragePrice);
  
  expect(
    priceDifference,
    `F&B price mismatch: UI shows €${uiPrices.foodBeveragePrice}, Analytics shows €${analyticsPrices.foodBeveragePrice}`
  ).toBeLessThan(analyticsTestData.priceToleranceEur);
}

/**
 * Asserts that total prices match between UI and analytics.
 * @param uiTotal Total price from UI.
 * @param analyticsTotal Total price from analytics.
 */
export function assertTotalPricesMatch(uiTotal: number, analyticsTotal: number): void {
  const priceDifference = Math.abs(uiTotal - analyticsTotal);
  
  expect(
    priceDifference,
    `Total price mismatch: UI shows €${uiTotal}, Analytics shows €${analyticsTotal}`
  ).toBeLessThan(analyticsTestData.priceToleranceEur);
}

/**
 * Asserts that all items in the analytics event have the required properties.
 * @param beginCheckoutEvent The begin_checkout event to validate.
 */
export function assertAnalyticsItemsHaveRequiredProperties(beginCheckoutEvent: DataLayerEvent): void {
  expect(beginCheckoutEvent.ecommerce?.items, 'begin_checkout event should have items').toBeDefined();
  
  beginCheckoutEvent.ecommerce!.items.forEach((item, index) => {
    analyticsTestData.requiredItemProperties.forEach(prop => {
      expect(
        item.hasOwnProperty(prop),
        `Item ${index} should have property '${prop}'`
      ).toBeTruthy();
    });

    // Validate item category is one of the expected values
    const validCategories = Object.values(analyticsTestData.expectedItemCategories);
    expect(
      validCategories.includes(item.item_category as any),
      `Item ${index} has invalid category '${item.item_category}'. Expected one of: ${validCategories.join(', ')}`
    ).toBeTruthy();
  });
}
