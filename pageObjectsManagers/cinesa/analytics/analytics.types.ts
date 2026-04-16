/**
 * Analytics Type Definitions
 * Shared interfaces for Google Analytics dataLayer events
 */

/**
 * Base ecommerce item structure used in GA4 events
 */
export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  quantity?: number;
  item_variant?: string;
  cinema_name?: string;
  performance_date?: string;
  performance_time?: string;
  showtime_id?: string;
  // Allow additional dynamic properties for extensibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Base ecommerce data structure for GA4 events
 */
export interface EcommerceData {
  items: EcommerceItem[];
  currency?: string;
  value?: number;
  transaction_id?: string;
}

/**
 * Base dataLayer event structure
 */
export interface DataLayerEvent {
  event: string;
  gtm?: {
    startInTicks: number;
  };
  ecommerce?: EcommerceData;
}

/**
 * Add to cart event (when user adds tickets/items)
 */
export interface AddToCartEvent extends DataLayerEvent {
  event: 'add_to_cart';
  ecommerce: EcommerceData;
}

/**
 * Begin checkout event (when user proceeds to payment)
 */
export interface BeginCheckoutEvent extends DataLayerEvent {
  event: 'begin_checkout';
  ecommerce: EcommerceData & {
    currency: string;
    value: number;
  };
}

/**
 * Price summary extracted from the purchase flow
 */
export interface PriceSummary {
  ticketPrice: number;
  foodBeveragePrice: number;
  totalPrice: number;
  taxes: number;
}
