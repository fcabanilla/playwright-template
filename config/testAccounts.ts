import { TestAccount, TestAccountCollection } from './testAccounts.types';

/**
 * CINESA Test Accounts Configuration
 *
 * ⚠️ SECURITY: All credentials are loaded from environment variables (.env file)
 *
 * Setup:
 * 1. Copy .env.example to .env
 * 2. Fill in real account credentials in .env
 * 3. Never commit .env file (it's in .gitignore)
 *
 * See docs/TEST_ACCOUNTS.md for detailed instructions.
 */

// ====================
// VALID TEST ACCOUNTS
// ====================

/**
 * Account without any membership (standard user)
 * Use for: Basic login, signup flows, guest checkout
 */
const validNoMembership: TestAccount = {
  id: 'cinesa-valid-no-membership',
  email: process.env.TEST_NO_MEMBERSHIP_EMAIL || '',
  password: process.env.TEST_NO_MEMBERSHIP_PASSWORD || '',
  validity: 'valid',
  membershipTier: 'none',
  description: 'Standard user without any membership program',
  hasSavedPaymentMethods: false,
  hasBookingHistory: false,
  metadata: {
    notes: 'Clean account for testing basic flows',
    lastUpdated: '2025-10-08',
  },
};

/**
 * Account with Loyalty membership and points balance
 * Use for: Loyalty points earning/burning, restricted tickets, member benefits
 */
const validLoyalty: TestAccount = {
  id: 'cinesa-valid-loyalty',
  email: process.env.TEST_LOYALTY_EMAIL || '',
  password: process.env.TEST_LOYALTY_PASSWORD || '',
  validity: 'valid',
  membershipTier: 'loyalty',
  description: 'Loyalty member with active points balance',
  expectedPoints: 500,
  hasSavedPaymentMethods: true,
  hasBookingHistory: true,
  metadata: {
    notes: 'Maintain ~500 points balance for consistent testing',
    lastUpdated: '2025-10-08',
  },
};

/**
 * Account with Unlimited subscription (standard tier)
 * Use for: Unlimited booking flows, friend invitations, overcharge scenarios
 */
const validUnlimited: TestAccount = {
  id: 'cinesa-valid-unlimited',
  email: process.env.TEST_UNLIMITED_EMAIL || '',
  password: process.env.TEST_UNLIMITED_PASSWORD || '',
  validity: 'valid',
  membershipTier: 'unlimited',
  description: 'Unlimited member with active subscription',
  subscriptionExpiry: '2026-12-31',
  hasSavedPaymentMethods: true,
  hasBookingHistory: true,
  friendsCount: 2,
  metadata: {
    notes: 'Keep subscription active, has 2 linked friends',
    lastUpdated: '2025-10-08',
  },
};

/**
 * Account with Unlimited Plus subscription (premium tier)
 * Use for: Premium features, advanced booking scenarios
 */
const validUnlimitedPlus: TestAccount = {
  id: 'cinesa-valid-unlimited-plus',
  email: process.env.TEST_UNLIMITED_PLUS_EMAIL || '',
  password: process.env.TEST_UNLIMITED_PLUS_PASSWORD || '',
  validity: 'valid',
  membershipTier: 'unlimitedPlus',
  description: 'Unlimited Plus member with premium features',
  subscriptionExpiry: '2026-12-31',
  hasSavedPaymentMethods: true,
  hasBookingHistory: true,
  friendsCount: 5,
  metadata: {
    notes: 'Premium tier with max friends (5)',
    lastUpdated: '2025-10-08',
  },
};

// ======================
// INVALID TEST ACCOUNTS
// ======================

/**
 * Valid account but with wrong password
 * Use for: Login validation, error message testing
 */
const invalidWrongPassword: TestAccount = {
  id: 'cinesa-invalid-wrong-password',
  email: process.env.TEST_VALID_EMAIL || '',
  password: process.env.TEST_WRONG_PASSWORD || 'WrongPassword123!',
  validity: 'invalid',
  membershipTier: 'none',
  description: 'Valid email but intentionally wrong password',
  invalidReason: 'wrong_password',
  metadata: {
    notes: 'Use valid email but wrong password to test login errors',
    lastUpdated: '2025-10-08',
  },
};

/**
 * Account that has been locked due to multiple failed attempts
 * Use for: Account lockout scenarios, security testing
 */
const invalidLockedAccount: TestAccount = {
  id: 'cinesa-invalid-locked',
  email: process.env.TEST_LOCKED_EMAIL || '',
  password: process.env.TEST_LOCKED_PASSWORD || '',
  validity: 'invalid',
  membershipTier: 'none',
  description: 'Account locked due to security reasons',
  invalidReason: 'locked_account',
  metadata: {
    notes: 'May need manual unlock periodically',
    lastUpdated: '2025-10-08',
  },
};

/**
 * Account that doesn't exist in the system
 * Use for: Registration flows, error handling
 */
const invalidNonExistent: TestAccount = {
  id: 'cinesa-invalid-non-existent',
  email: process.env.TEST_NON_EXISTENT_EMAIL || 'nonexistent.user@cinesa-test.com',
  password: process.env.TEST_NON_EXISTENT_PASSWORD || 'TestPassword123!',
  validity: 'invalid',
  membershipTier: 'none',
  description: 'Email address that does not exist in system',
  invalidReason: 'non_existent',
  metadata: {
    notes: 'Do NOT create this account - must remain non-existent',
    lastUpdated: '2025-10-08',
  },
};

/**
 * Unlimited account with expired subscription
 * Use for: Subscription renewal flows, expiry scenarios
 */
const invalidExpiredSubscription: TestAccount = {
  id: 'cinesa-invalid-expired-subscription',
  email: process.env.TEST_EXPIRED_UNLIMITED_EMAIL || '',
  password: process.env.TEST_EXPIRED_UNLIMITED_PASSWORD || '',
  validity: 'invalid',
  membershipTier: 'unlimited',
  description: 'Unlimited account with expired subscription',
  invalidReason: 'expired_subscription',
  subscriptionExpiry: '2024-01-01',
  hasSavedPaymentMethods: true,
  hasBookingHistory: true,
  metadata: {
    notes: 'Keep subscription expired for renewal testing',
    lastUpdated: '2025-10-08',
  },
};

// ====================
// EXPORTED COLLECTION
// ====================

/**
 * Complete collection of Cinesa test accounts
 *
 * Usage in tests:
 * ```typescript
 * import { cinesaTestAccounts } from '@config/testAccounts';
 *
 * test('Login with loyalty member', async ({ page }) => {
 *   const account = cinesaTestAccounts.valid.loyalty;
 *   await loginPage.login(account.email, account.password);
 * });
 * ```
 */
export const cinesaTestAccounts: TestAccountCollection = {
  valid: {
    noMembership: validNoMembership,
    loyalty: validLoyalty,
    unlimited: validUnlimited,
    unlimitedPlus: validUnlimitedPlus,
  },
  invalid: {
    wrongPassword: invalidWrongPassword,
    lockedAccount: invalidLockedAccount,
    nonExistent: invalidNonExistent,
    expiredSubscription: invalidExpiredSubscription,
  },
};

/**
 * Helper function to get account by ID
 */
export function getAccountById(id: string): TestAccount | undefined {
  const allAccounts = [
    ...Object.values(cinesaTestAccounts.valid),
    ...Object.values(cinesaTestAccounts.invalid),
  ];
  return allAccounts.find((account) => account.id === id);
}

/**
 * Helper function to get all valid accounts
 */
export function getAllValidAccounts(): TestAccount[] {
  return Object.values(cinesaTestAccounts.valid);
}

/**
 * Helper function to get all invalid accounts
 */
export function getAllInvalidAccounts(): TestAccount[] {
  return Object.values(cinesaTestAccounts.invalid);
}

/**
 * Helper function to get accounts by membership tier
 */
export function getAccountsByTier(
  tier: TestAccount['membershipTier']
): TestAccount[] {
  return [...getAllValidAccounts(), ...getAllInvalidAccounts()].filter(
    (account) => account.membershipTier === tier
  );
}
