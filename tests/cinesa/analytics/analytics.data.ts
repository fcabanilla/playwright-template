/**
 * Test data for analytics validation tests
 */

export const analyticsTestData = {
  expectedCurrency: 'EUR',
  expectedEventTypes: {
    addToCart: 'add_to_cart',
    beginCheckout: 'begin_checkout',
    viewPromotion: 'view_promotion'
  },
  expectedItemCategories: {
    movie: 'Movie',
    foodBeverage: 'F&B'
  },
  priceToleranceEur: 0.01, // Tolerance for price comparisons in EUR
  requiredEventProperties: {
    addToCart: ['event', 'ecommerce'],
    beginCheckout: ['event', 'ecommerce', 'ecommerce.value', 'ecommerce.transaction_id', 'ecommerce.currency']
  },
  requiredItemProperties: ['item_id', 'item_name', 'item_category', 'price'],
  cinemaNames: {
    oasiz: 'Oasiz',
    grancasa: 'Grancasa'
  }
} as const;
