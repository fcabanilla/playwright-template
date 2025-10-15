/**
 * Type definitions for My Account components
 * Following ADR-0009: Required file structure includes .types.ts
 *
 * Reference: ADR-0008 - My Account Area Testing Strategy
 *
 * @module MyAccountTypes
 */

/**
 * My Account subsections as defined in ADR-0008
 */
export type MyAccountSection =
  | 'overview'
  | 'bookings'
  | 'preferences'
  | 'membership'
  | 'offers'
  | 'cardWallet'
  | 'profile';

/**
 * Membership tier levels
 */
export type MembershipTier = 'none' | 'loyalty' | 'unlimited' | 'unlimitedPlus';

/**
 * User dashboard data structure
 */
export interface MyAccountDashboard {
  /** User's loyalty points balance */
  pointsBalance?: number;

  /** Current membership tier */
  membershipTier: MembershipTier;

  /** Membership expiry date (ISO format) */
  membershipExpiry?: string;

  /** Number of active bookings */
  activeBookingsCount?: number;

  /** Number of available offers */
  availableOffersCount?: number;
}

/**
 * Navigation state for My Account
 */
export interface MyAccountNavigationState {
  /** Currently active section */
  currentSection: MyAccountSection;

  /** Whether user is authenticated */
  isAuthenticated: boolean;

  /** Sections available to the user based on membership */
  availableSections: MyAccountSection[];
}

/**
 * Quick action types available in dashboard
 */
export type QuickActionType =
  | 'viewBookings'
  | 'updateProfile'
  | 'viewOffers'
  | 'manageCards';

/**
 * Error states for My Account pages
 */
export interface MyAccountError {
  /** Error type */
  type: 'load' | 'validation' | 'api' | 'network';

  /** Error message displayed to user */
  message: string;

  /** Whether retry is available */
  canRetry: boolean;
}

/**
 * Loading states for My Account components
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
