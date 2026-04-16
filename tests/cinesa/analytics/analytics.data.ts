import {
  CinemaConfig,
  getCinemasForEnvironment,
} from '../../../config/cinemas.config';

/**
 * Test data for analytics validation tests
 */

export const analyticsTestData = {
  expectedCurrency: 'EUR',
  expectedEventTypes: {
    addToCart: 'add_to_cart',
    beginCheckout: 'begin_checkout',
    viewPromotion: 'view_promotion',
  },
  expectedItemCategories: {
    movie: 'Movie',
    foodBeverage: 'F&B',
  },
  priceToleranceEur: 0.01, // Tolerance for price comparisons in EUR
  requiredEventProperties: {
    addToCart: ['event', 'ecommerce'],
    beginCheckout: [
      'event',
      'ecommerce',
      'ecommerce.value',
      'ecommerce.transaction_id',
      'ecommerce.currency',
    ],
  },
  requiredItemProperties: ['item_id', 'item_name', 'item_category', 'price'],
  cinemaNames: {
    oasiz: 'Oasiz',
    grancasa: 'Grancasa',
  },
} as const;

/**
 * Get available cinemas for analytics tests based on current environment
 * Uses centralized cinema configuration from config/cinemas.config.ts
 */
export function getCinemasForAnalyticsTests(env?: string): CinemaConfig[] {
  return getCinemasForEnvironment(env);
}

/**
 * Analytics test configuration per cinema
 */
export interface AnalyticsTestConfig {
  cinema: CinemaConfig;
  menuMethod: 'buyClassicMenuOasiz' | 'buyClassicMenuGrancasa';
  menuType: string;
}

/**
 * Get analytics test configurations for available cinemas
 */
export function getAnalyticsTestConfigs(env?: string): AnalyticsTestConfig[] {
  const cinemas = getCinemasForAnalyticsTests(env);

  return cinemas.map((cinema) => ({
    cinema,
    menuMethod:
      cinema.name === 'Oasiz'
        ? 'buyClassicMenuOasiz'
        : 'buyClassicMenuGrancasa',
    menuType: 'Classic',
  }));
}
