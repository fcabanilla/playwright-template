# Test Accounts Configuration

This document explains how to manage a### Step 2: Configure Environment Variables

1. **Copy the example file**:

   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with real credentials**:

   ```bash
   # Edit .env file
   TEST_NO_MEMBERSHIP_EMAIL=your.real.email@cinesa-test.com
   TEST_NO_MEMBERSHIP_PASSWORD=YourRealPassword123!
   
   TEST_LOYALTY_EMAIL=your.loyalty@cinesa-test.com
   TEST_LOYALTY_PASSWORD=YourRealPassword123!
   # ... etc
   ```

3. **Verify `.env` is in `.gitignore`**:

   ```bash
   # Should show .env in .gitignore
   cat .gitignore | grep .env
   ```counts for data-driven testing in the Playwright automation framework.

## 📋 Overview

Due to restrictions on automated account creation, we maintain a **predefined set of test accounts** that must be manually created and configured. These accounts represent different user states and membership tiers, enabling comprehensive test coverage.

## 🎯 Account Types

### Valid Accounts

| Account Type         | Membership     | Purpose                                    | File Reference       |
| -------------------- | -------------- | ------------------------------------------ | -------------------- |
| **No Membership**    | None           | Basic login, signup flows, guest checkout  | `validNoMembership`  |
| **Loyalty Member**   | Loyalty        | Points earning/burning, restricted tickets | `validLoyalty`       |
| **Unlimited Member** | Unlimited      | Subscription booking, friend invitations   | `validUnlimited`     |
| **Unlimited Plus**   | Unlimited Plus | Premium features, advanced scenarios       | `validUnlimitedPlus` |

### Invalid Accounts

| Account Type             | Issue                 | Purpose                            | File Reference               |
| ------------------------ | --------------------- | ---------------------------------- | ---------------------------- |
| **Wrong Password**       | Incorrect credentials | Login validation, error messages   | `invalidWrongPassword`       |
| **Locked Account**       | Security lock         | Account lockout scenarios          | `invalidLockedAccount`       |
| **Non-Existent**         | Doesn't exist         | Registration flows, error handling | `invalidNonExistent`         |
| **Expired Subscription** | Subscription expired  | Renewal flows, expiry scenarios    | `invalidExpiredSubscription` |

## 🛠️ Setup Instructions

### Step 1: Create Accounts Manually

For each environment (preprod, production), manually create the following accounts:

1. **No Membership Account**:

   - Register new user
   - Do NOT join any membership program
   - Keep clean (no bookings, no saved cards)

2. **Loyalty Account**:

   - Register new user
   - Join Loyalty program
   - Make purchases to accumulate ~500 points
   - Save at least one payment method

3. **Unlimited Account**:

   - Register new user
   - Subscribe to Unlimited (standard tier)
   - Ensure subscription is active until Dec 2026
   - Link 2 friend accounts
   - Make at least one booking

4. **Unlimited Plus Account**:

   - Register new user
   - Subscribe to Unlimited Plus (premium tier)
   - Ensure subscription is active until Dec 2026
   - Link 5 friend accounts (maximum)
   - Make at least one booking

5. **Accounts for Invalid Scenarios**:
   - **Wrong Password**: Create account but use wrong password in config
   - **Locked**: Create account and lock it (multiple failed login attempts)
   - **Non-Existent**: DO NOT create this account - use fake email
   - **Expired Subscription**: Create Unlimited account and let subscription expire

### Step 2: Update Configuration File

Edit `config/testAccounts.ts` with your real account credentials:

```typescript
const validNoMembership: TestAccount = {
  id: 'cinesa-valid-no-membership',
  email: 'YOUR_REAL_EMAIL@cinesa-test.com', // ← UPDATE THIS
  password: 'YOUR_REAL_PASSWORD', // ← UPDATE THIS
  validity: 'valid',
  membershipTier: 'none',
  // ... rest of config
};
```

### Step 3: Verify Account States

Before running tests, verify each account:

```bash
# Login manually to each account and verify:
- ✅ Email/password are correct
- ✅ Membership tier matches configuration
- ✅ Points balance is as expected (loyalty)
- ✅ Subscription is active (unlimited)
- ✅ Friends are linked (unlimited)
- ✅ Booking history exists
```

## 📖 Usage in Tests

### Basic Usage

```typescript
import { cinesaTestAccounts } from '@config/testAccounts';

test('Login with loyalty member', async ({ page }) => {
  const account = cinesaTestAccounts.valid.loyalty;

  await loginPage.login(account.email, account.password);
  await expect(page).toHaveURL(/my-account/);
});
```

### Data-Driven Testing (Parameterized Tests)

```typescript
import { getAllValidAccounts } from '@config/testAccounts';

// Test with ALL valid accounts
for (const account of getAllValidAccounts()) {
  test(`Login with ${account.membershipTier} account`, async ({ page }) => {
    await loginPage.login(account.email, account.password);
    await expect(page).toHaveURL(/my-account/);

    // Verify membership-specific elements
    if (account.membershipTier === 'loyalty') {
      await expect(loyaltyDashboard.pointsBalance).toBeVisible();
    }
  });
}
```

### Membership-Specific Tests

```typescript
import { cinesaTestAccounts } from '@config/testAccounts';

test.describe('Loyalty Points Features', () => {
  test.use({ storageState: 'loggedInState.loyalty.json' });

  test('Earn points on ticket purchase', async ({ page }) => {
    const account = cinesaTestAccounts.valid.loyalty;
    const initialPoints = account.expectedPoints || 0;

    // Make purchase
    await ticketPicker.selectTickets(2);
    await paymentPage.completePayment();

    // Verify points earned
    const newPoints = await loyaltyDashboard.getPointsBalance();
    expect(newPoints).toBeGreaterThan(initialPoints);
  });
});
```

### Invalid Account Testing

```typescript
import { cinesaTestAccounts } from '@config/testAccounts';

test('Login with wrong password shows error', async ({ page }) => {
  const account = cinesaTestAccounts.invalid.wrongPassword;

  await loginPage.login(account.email, account.password);

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText(
    'Incorrect email or password'
  );
});
```

## 🔐 Security Best Practices

### Local Development

- ✅ Store credentials in `.env` file (automatically ignored by git)
- ✅ Use `.env.example` as template
- ✅ Keep passwords secure but memorable for test accounts
- ✅ Never commit `.env` file

### CI/CD Pipeline

Credentials are already configured to use environment variables via `process.env`.

Set environment variables in your CI/CD platform:

```bash
# GitHub Actions
TEST_LOYALTY_EMAIL=test.loyalty@cinesa.com
TEST_LOYALTY_PASSWORD=SecurePassword123!

# GitLab CI
TEST_LOYALTY_EMAIL: test.loyalty@cinesa.com
TEST_LOYALTY_PASSWORD: SecurePassword123!
```

## 🧹 Maintenance

### Weekly Tasks

- [ ] Verify all account credentials still work
- [ ] Check loyalty points balance (~500 points)
- [ ] Ensure unlimited subscriptions are active
- [ ] Verify friend links are intact

### Monthly Tasks

- [ ] Reset booking history if too large
- [ ] Update `lastUpdated` metadata
- [ ] Check for locked accounts and unlock if needed
- [ ] Renew unlimited subscriptions if close to expiry

### Account State Reset

If an account gets into an inconsistent state:

```typescript
// tests/helpers/accountReset.ts
export async function resetAccountState(accountId: string) {
  // Use API or manual steps to:
  // 1. Cancel pending bookings
  // 2. Reset points balance to baseline
  // 3. Clear cart
  // 4. Remove excess payment methods
}
```

## 🐛 Troubleshooting

### Account Locked

**Problem**: Account locked after multiple failed attempts

**Solution**:

1. Wait 30 minutes for auto-unlock
2. Or manually unlock via admin panel
3. Or create new account with different email

### Points Balance Changed

**Problem**: Loyalty account points don't match expected value

**Solution**:

1. Manually adjust points via admin panel
2. Or update `expectedPoints` in config
3. Or use API to reset points balance

### Subscription Expired

**Problem**: Unlimited subscription expired

**Solution**:

1. Manually renew subscription via admin panel
2. Update `subscriptionExpiry` date in config
3. Verify payment method is valid

### Friends Unlinked

**Problem**: Friend connections lost

**Solution**:

1. Re-invite friends via UI
2. Verify friend accounts still exist
3. Check friend limits not exceeded

## 📚 Related Documentation

- [ADR-0006: Loyalty Program Testing Strategy](../docs/adrs/0006-loyalty-program-testing-strategy.md)
- [ADR-0007: Unlimited Subscription Testing Strategy](../docs/adrs/0007-unlimited-subscription-testing-strategy.md)
- [ADR-0008: My Account Area Testing Strategy](../docs/adrs/0008-my-account-area-testing-strategy.md)
- [Data-Driven Testing Guide](./DATA_DRIVEN_TESTING.md)

## 💡 Tips

1. **Use Descriptive Emails**: Include tier in email (e.g., `test.loyalty@...`)
2. **Document Changes**: Update `metadata.notes` when making changes
3. **Separate Environments**: Use different emails for preprod vs prod
4. **Backup Credentials**: Keep credentials in password manager
5. **Test Regularly**: Run smoke tests daily to catch account issues early

---

**Last Updated**: October 8, 2025  
**Maintained by**: QA Automation Team  
**Questions**: Contact @fcabanilla
