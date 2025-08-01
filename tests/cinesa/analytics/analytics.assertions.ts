import { Page, expect, TestInfo } from '@playwright/test';

/**
 * Validates that dataLayer events were captured successfully
 * @param allEvents Array of captured dataLayer events
 */
export async function assertEventsWereCaptured(allEvents: any[]): Promise<void> {
  expect(allEvents.length).toBeGreaterThan(0);
}

/**
 * Validates critical e-commerce events exist in captured events
 * @param allEvents Array of captured dataLayer events
 */
export async function assertCriticalEventsExist(allEvents: any[]): Promise<{ addToCartEvents: any[], beginCheckoutEvents: any[] }> {
  const addToCartEvents = allEvents.filter(event => event.event === 'add_to_cart');
  const beginCheckoutEvents = allEvents.filter(event => event.event === 'begin_checkout');

  expect(addToCartEvents.length).toBeGreaterThan(0);
  expect(beginCheckoutEvents.length).toBeGreaterThan(0);

  return { addToCartEvents, beginCheckoutEvents };
}

/**
 * Validates the structure of a begin_checkout event
 * @param latestBeginCheckout The latest begin_checkout event
 */
export async function assertBeginCheckoutEventStructure(latestBeginCheckout: any): Promise<void> {
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
 * @param analyticsTotal The total value from analytics
 */
export async function assertAnalyticsTotalIsReasonable(analyticsTotal: number): Promise<void> {
  expect(analyticsTotal).toBeGreaterThan(0);
  expect(analyticsTotal).toBeLessThan(100); // Reasonable upper bound
}

/**
 * Validates the structure of ecommerce items
 * @param items Array of ecommerce items
 */
export async function assertEcommerceItemsStructure(items: any[]): Promise<void> {
  for (const item of items) {
    expect(item).toHaveProperty('item_name');
    expect(item).toHaveProperty('price');
    expect(item.price).toBeGreaterThan(0);
  }
}

/**
 * Attaches captured events to test report
 * @param testInfo Playwright TestInfo object
 * @param allEvents Array of captured events
 * @param latestBeginCheckout Latest begin_checkout event
 */
export async function attachEventsToReport(testInfo: TestInfo, allEvents: any[], latestBeginCheckout: any): Promise<void> {
  await testInfo.attach('All captured dataLayer events', {
    body: JSON.stringify(allEvents, null, 2),
    contentType: 'application/json'
  });

  await testInfo.attach('Latest Begin Checkout Event', {
    body: JSON.stringify(latestBeginCheckout, null, 2),
    contentType: 'application/json'
  });
}

/**
 * Logs comprehensive analytics summary to console
 * @param cinemaName Name of the cinema
 * @param menuType Type of menu selected
 * @param allEvents Array of all captured events
 * @param addToCartEvents Array of add_to_cart events
 * @param beginCheckoutEvents Array of begin_checkout events
 * @param analyticsTotal Total value from analytics
 * @param itemsTotal Calculated total from items
 * @param latestBeginCheckout Latest begin_checkout event
 */
export async function logAnalyticsSummary(
  cinemaName: string,
  menuType: string,
  allEvents: any[],
  addToCartEvents: any[],
  beginCheckoutEvents: any[],
  analyticsTotal: number,
  itemsTotal: number,
  latestBeginCheckout: any
): Promise<void> {
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
    latestBeginCheckout.ecommerce.items.forEach((item: any, index: number) => {
      console.log(`   ${index + 1}. ${item.item_name}: €${item.price} x ${item.quantity || 1}`);
    });
  }

  console.log('✅ All analytics validations passed!');
}

/**
 * Logs simplified analytics summary for Grancasa
 */
export async function logGrancasaAnalyticsSummary(
  allEvents: any[],
  addToCartEvents: any[],
  beginCheckoutEvents: any[],
  analyticsTotal: number
): Promise<void> {
  console.log('=== GRANCASA ANALYTICS VALIDATION SUMMARY ===');
  console.log(`✅ Total events captured: ${allEvents.length}`);
  console.log(`✅ Add to cart events: ${addToCartEvents.length}`);
  console.log(`✅ Begin checkout events: ${beginCheckoutEvents.length}`);
  console.log(`✅ Analytics total: €${analyticsTotal}`);
  console.log(`✅ All analytics validations passed for Grancasa!`);
}
