import { expect, TestInfo } from '@playwright/test';
import type {
  DataLayerEvent,
  AddToCartEvent,
  BeginCheckoutEvent,
} from '../../../pageObjectsManagers/cinesa/analytics/analytics.types';

/**
 * Validates that dataLayer events were captured successfully
 * @param allEvents Array of captured dataLayer events
 */
export async function assertEventsWereCaptured(
  allEvents: DataLayerEvent[]
): Promise<void> {
  expect(allEvents.length).toBeGreaterThan(0);
}

/**
 * Validates critical e-commerce events exist in captured events
 * @param allEvents Array of captured dataLayer events
 */
export async function assertCriticalEventsExist(
  allEvents: DataLayerEvent[]
): Promise<{
  addToCartEvents: AddToCartEvent[];
  beginCheckoutEvents: BeginCheckoutEvent[];
}> {
  const addToCartEvents = allEvents.filter(
    (event): event is AddToCartEvent => event.event === 'add_to_cart'
  );
  const beginCheckoutEvents = allEvents.filter(
    (event): event is BeginCheckoutEvent => event.event === 'begin_checkout'
  );

  expect(addToCartEvents.length).toBeGreaterThan(0);
  expect(beginCheckoutEvents.length).toBeGreaterThan(0);

  return { addToCartEvents, beginCheckoutEvents };
}

/**
 * Validates the structure of a begin_checkout event
 * @param latestBeginCheckout The latest begin_checkout event
 */
export async function assertBeginCheckoutEventStructure(
  latestBeginCheckout: BeginCheckoutEvent
): Promise<void> {
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
}

/**
 * Validates analytics total values are reasonable
 * @param beginCheckoutEvent The begin_checkout event to validate
 */
export async function assertAnalyticsTotalIsReasonable(
  beginCheckoutEvent: BeginCheckoutEvent
): Promise<void> {
  const analyticsTotal = beginCheckoutEvent.ecommerce?.value || 0;
  expect(analyticsTotal).toBeGreaterThan(0);
  expect(analyticsTotal).toBeLessThan(100); // Reasonable upper bound
}

/**
 * Validates the structure of ecommerce items
 * @param beginCheckoutEvent The begin_checkout event containing items
 */
export async function assertEcommerceItemsStructure(
  beginCheckoutEvent: BeginCheckoutEvent
): Promise<void> {
  if (beginCheckoutEvent.ecommerce?.items) {
    const items = beginCheckoutEvent.ecommerce.items;
    for (const item of items) {
      expect(item).toHaveProperty('item_name');
      expect(item).toHaveProperty('price');
      expect(item.price).toBeGreaterThan(0);
    }
  }
}

/**
 * Attaches captured events to test report
 * @param testInfo Playwright TestInfo object
 * @param allEvents Array of captured events
 * @param latestBeginCheckout Latest begin_checkout event
 */
export async function attachEventsToReport(
  testInfo: TestInfo,
  allEvents: DataLayerEvent[],
  latestBeginCheckout: BeginCheckoutEvent
): Promise<void> {
  await testInfo.attach('All captured dataLayer events', {
    body: JSON.stringify(allEvents, null, 2),
    contentType: 'application/json',
  });

  await testInfo.attach('Latest Begin Checkout Event', {
    body: JSON.stringify(latestBeginCheckout, null, 2),
    contentType: 'application/json',
  });
}

/**
 * Logs comprehensive analytics summary to console
 * @param cinemaName Name of the cinema
 * @param menuType Type of menu selected
 * @param allEvents Array of all captured events
 * @param addToCartEvents Array of add_to_cart events
 * @param beginCheckoutEvents Array of begin_checkout events
 * @param latestBeginCheckout Latest begin_checkout event
 */
export async function logAnalyticsSummary(
  cinemaName: string,
  menuType: string,
  allEvents: DataLayerEvent[],
  addToCartEvents: AddToCartEvent[],
  beginCheckoutEvents: BeginCheckoutEvent[],
  latestBeginCheckout: BeginCheckoutEvent
): Promise<void> {
  // List all items
  if (latestBeginCheckout.ecommerce?.items) {
    console.log('🎫 Items breakdown:');
    latestBeginCheckout.ecommerce.items.forEach((item, index) => {
      console.log(
        `   ${index + 1}. ${item.item_name}: €${item.price} x ${item.quantity || 1}`
      );
    });
  }

  console.log('✅ All analytics validations passed!');
}

/**
 * Logs simplified analytics summary for Grancasa
 */
export async function logGrancasaAnalyticsSummary(
  allEvents: DataLayerEvent[],
  addToCartEvents: AddToCartEvent[],
  beginCheckoutEvents: BeginCheckoutEvent[],
  latestBeginCheckout: BeginCheckoutEvent
): Promise<void> {
  const analyticsTotal = latestBeginCheckout.ecommerce?.value || 0;

  console.log('=== GRANCASA ANALYTICS VALIDATION SUMMARY ===');
  console.log(`✅ Total events captured: ${allEvents.length}`);
  console.log(`✅ Add to cart events: ${addToCartEvents.length}`);
  console.log(`✅ Begin checkout events: ${beginCheckoutEvents.length}`);
  console.log(`✅ Analytics total: €${analyticsTotal}`);
  console.log(`✅ All analytics validations passed for Grancasa!`);
}
