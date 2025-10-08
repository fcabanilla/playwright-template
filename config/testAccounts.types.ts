/**
 * Test Account Types and Interfaces
 *
 * Defines the structure for test accounts used in data-driven testing.
 * These accounts represent different user states and membership tiers.
 */

/**
 * Available membership tiers for test accounts
 */
export type MembershipTier = 'none' | 'loyalty' | 'unlimited' | 'unlimitedPlus';

/**
 * Account validity status
 */
export type AccountValidity = 'valid' | 'invalid';

/**
 * Reasons why an account might be invalid
 */
export type InvalidReason =
  | 'wrong_password'
  | 'locked_account'
  | 'expired_subscription'
  | 'suspended'
  | 'non_existent';

/**
 * Test account interface with all necessary properties
 */
export interface TestAccount {
  /** Unique identifier for the account */
  id: string;

  /** Account email address */
  email: string;

  /** Account password */
  password: string;

  /** Whether this is a valid or invalid account */
  validity: AccountValidity;

  /** Membership tier (none, loyalty, unlimited, unlimitedPlus) */
  membershipTier: MembershipTier;

  /** Description of the account purpose */
  description: string;

  /** If invalid, the reason why */
  invalidReason?: InvalidReason;

  /** Expected points balance (for loyalty accounts) */
  expectedPoints?: number;

  /** Subscription expiry date (for unlimited accounts) */
  subscriptionExpiry?: string;

  /** Whether account has payment methods saved */
  hasSavedPaymentMethods?: boolean;

  /** Whether account has booking history */
  hasBookingHistory?: boolean;

  /** Number of friends (for unlimited accounts) */
  friendsCount?: number;

  /** Additional metadata */
  metadata?: {
    createdAt?: string;
    lastUpdated?: string;
    notes?: string;
  };
}

/**
 * Collection of test accounts grouped by validity
 */
export interface TestAccountCollection {
  valid: {
    noMembership: TestAccount;
    loyalty: TestAccount;
    unlimited: TestAccount;
    unlimitedPlus?: TestAccount;
  };
  invalid: {
    wrongPassword: TestAccount;
    lockedAccount: TestAccount;
    nonExistent: TestAccount;
    expiredSubscription?: TestAccount;
  };
}

/**
 * Platform-specific test accounts (Cinesa vs UCI)
 */
export interface PlatformTestAccounts {
  cinesa: TestAccountCollection;
  uci: TestAccountCollection;
}
