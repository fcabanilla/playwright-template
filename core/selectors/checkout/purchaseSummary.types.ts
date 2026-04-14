/**
 * Shared PurchaseSummary types — customer details and order information.
 */

/** Customer details form data */
export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** Order summary line item */
export interface OrderSummaryItem {
  description: string;
  quantity: number;
  price: string;
}

/** Default guest customer details for automation */
export const DEFAULT_GUEST_DETAILS: CustomerDetails = {
  firstName: 'Test',
  lastName: 'Automation',
  email: 'test@automation.com',
  phone: '612345678',
};
