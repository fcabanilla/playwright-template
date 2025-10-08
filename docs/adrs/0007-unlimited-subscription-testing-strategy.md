# ADR-0007: Unlimited Subscription Testing Strategy

**Status**: Accepted

**Date**: 2025-10-08

**Authors**: [@fcabanilla]

**Reviewers**: [@qa-team]

## Context

The Unlimited subscription program is a premium membership offering that allows subscribers to watch unlimited movies with special benefits. It represents a significant revenue stream and requires complex testing due to subscription lifecycle management, friend booking features, payment handling, and integration with the loyalty system.

### Background

- **60+ manual test cases** specifically for Unlimited subscription features
- Subscription model with monthly/annual billing cycles
- "Book with a Friend" feature adds complexity (up to 5 friends)
- Premium ticket format surcharges (PLF, IMAX, 3D)
- Voucher redemption system for gifted subscriptions
- Member card customization and digital membership features
- Integration with loyalty points system (restricted earning/burning)

### Forces at Play

- **Revenue Impact**: Unlimited subscriptions are high-value, recurring revenue
- **User Experience**: Complex flows must be intuitive (signup, linking friends, booking)
- **Payment Complexity**: Subscription billing, overcharges, refunds, payment method storage
- **Business Rules**: Eligibility, restrictions, member benefits vary by tier
- **Integration Points**: Loyalty system, payment gateway, booking engine, CMS configuration
- **Lifecycle Management**: Signup → Active → Renewal → Cancellation → Refund
- **Friend Management**: Invitation system, acceptance, booking permissions

## Decision

### Chosen Option

**Implement a comprehensive Unlimited subscription testing framework with dedicated Page Objects for each subscription lifecycle stage, separating booking logic from membership management, and creating reusable test patterns for friend-related scenarios.**

We will:

1. **Create Subscription-Specific Page Objects**:

   - `UnlimitedLandingPage` - Marketing and information display
   - `UnlimitedSignup` - Subscription purchase flow
   - `UnlimitedMemberArea` - Dashboard and membership management
   - `UnlimitedFriends` - Friend linking and management
   - `UnlimitedBooking` - Booking flow with subscription logic
   - `UnlimitedVoucher` - Voucher redemption flows

2. **Subscription State Management**:

   - Pre-configured test accounts in different states (active, expired, cancelled)
   - Helper utilities to create/manage subscription states via API
   - Isolated test data per subscription type/tier

3. **Friend Booking Pattern**:

   - Reusable test helpers for friend invitation/acceptance workflows
   - Mock friend accounts for booking scenarios
   - Validation patterns for primary/secondary member permissions

4. **Payment & Billing Testing**:

   - Separate payment validation from booking validation
   - Mock recurring payment scenarios
   - Test overcharge calculations for premium formats

5. **Priority Testing Approach**:
   - **P0 - Critical**: Sign up, Login, Basic booking, Overcharge calculation
   - **P1 - High**: Book with friend, Voucher redemption, Renewals, Refunds
   - **P2 - Medium**: Member card customization, Friend management, Landing page
   - **P3 - Low**: CMS configuration, Advanced markup, Edge cases

### Considered Alternatives

#### Option A: Test Unlimited as Part of General Booking Tests

- **Pros**:
  - Less code duplication
  - Simpler test structure
  - Fewer dedicated page objects
- **Cons**:
  - Mixed concerns (subscription logic + booking logic)
  - Hard to isolate subscription-specific failures
  - Complex conditionals in shared tests
  - Difficult to maintain as Unlimited evolves
- **Reason for rejection**: Subscription logic is too complex to embed in general tests

#### Option B: Separate Test Suite per Subscription Tier

- **Pros**:
  - Clear separation by tier
  - Easy to run tests for specific tier
- **Cons**:
  - Massive code duplication across tiers
  - Hard to update shared logic
  - Maintenance nightmare
- **Reason for rejection**: Violates DRY principles, unsustainable maintenance

#### Option C: Unified Unlimited Framework with Parameterization (Chosen)

- **Pros**:
  - Single source of truth for Unlimited logic
  - Parameterized tests for different tiers
  - Reusable components across subscription types
  - Easy to add new tiers or features
- **Cons**:
  - Initial setup complexity
  - Requires careful abstraction design
- **Reason for selection**: Best long-term maintainability and extensibility

## Consequences

### Positive

- **Comprehensive Coverage**: All subscription flows automated (signup → booking → renewal)
- **Friend Booking Confidence**: Complex multi-member scenarios validated systematically
- **Revenue Protection**: Overcharge calculations verified automatically
- **Rapid Regression**: Full subscription suite runs in < 20 minutes
- **Business Rule Validation**: CMS configuration changes tested automatically
- **Reduced Manual Effort**: 60+ hours/month saved on manual subscription testing

### Negative

- **Complex Test Data**: Managing multiple linked accounts (primary + 5 friends)
- **Environment Dependencies**: Requires payment gateway mocks, subscription API access
- **Initial Development Time**: 4-5 weeks for full Unlimited test suite
- **State Management**: Tests must handle subscription state transitions carefully

### Neutral

- **API Integration**: Heavy reliance on subscription management API
- **Payment Mocking**: Need mock payment gateway for non-production environments
- **Friend Network**: Tests create/manage web of connected accounts

## Implementation

### Architectural Compliance

**CRITICAL**: All Page Objects MUST follow the architectural rules defined in [ADR-0009: Page Object Architecture and Access Control Rules](./0009-page-object-architecture-rules.md).

**Key Requirements**:

- ✅ **Selectors**: All selectors in separate `.selectors.ts` files (NO inline selectors)
- ✅ **API Access**: Page Objects MUST use `WebActions`, NEVER access `page` directly
- ✅ **Separation**: Business logic in `.page.ts`, selectors in `.selectors.ts`, types in `.types.ts`
- ✅ **Delegation**: All Playwright API calls go through `WebActions` layer

**Example Structure**:

```typescript
// ✅ CORRECT: unlimitedSignup.selectors.ts
export const unlimitedSignupSelectors = {
  emailInput: '[data-testid="unlimited-signup-email"]',
  tierSelector: '[data-testid="subscription-tier"]',
  submitButton: '[data-testid="signup-submit"]',
} as const;

// ✅ CORRECT: unlimitedSignup.page.ts
export class UnlimitedSignupPage {
  constructor(private readonly webActions: WebActions) {} // ✅ NOT page: Page
  private readonly selectors = unlimitedSignupSelectors;

  async selectSubscriptionTier(
    tier: 'unlimited' | 'unlimitedPlus'
  ): Promise<void> {
    // ✅ Delegates to WebActions
    await this.webActions.selectOption(this.selectors.tierSelector, tier);
  }
}
```

### Implementation Plan

#### Phase 1: Core Subscription Framework (Week 1-2)

1. **Create Core Page Objects** (following ADR-0009 rules):

   ```typescript
   // pageObjectsManagers/cinesa/unlimited/unlimitedSignup.selectors.ts
   // pageObjectsManagers/cinesa/unlimited/unlimitedSignup.page.ts
   // pageObjectsManagers/cinesa/unlimited/unlimitedMemberArea.selectors.ts
   // pageObjectsManagers/cinesa/unlimited/unlimitedMemberArea.page.ts
   // pageObjectsManagers/cinesa/unlimited/unlimitedBooking.selectors.ts
   // pageObjectsManagers/cinesa/unlimited/unlimitedBooking.page.ts
   ```

2. **Subscription State Helpers**:

   ```typescript
   // tests/cinesa/unlimited/unlimited.helpers.ts
   class UnlimitedHelpers {
     async createActiveSubscription(email: string, tier: string);
     async createExpiredSubscription(email: string);
     async linkFriends(primaryEmail: string, friendEmails: string[]);
     async calculateExpectedOvercharge(format: string, tier: string);
   }
   ```

3. **Test Data Structure**:

   ```typescript
   // tests/cinesa/unlimited/unlimited.data.ts
   export const unlimitedTestData = {
     subscriptionTiers: {
       unlimited: { monthlyPrice: 21.9, maxFriends: 5 },
       unlimitedPlus: { monthlyPrice: 29.9, maxFriends: 5 },
     },
     testAccounts: {
       activeMember: { email, subscriptionTier, expiryDate },
       expiredMember: { email, subscriptionTier, expiryDate },
       newSignup: { email, paymentMethod },
     },
     friendNetwork: {
       primary: 'primary@test.com',
       friends: ['friend1@test.com', 'friend2@test.com'],
     },
   };
   ```

#### Phase 2: Critical Subscription Tests (Week 2-3)

1. **P0 Critical Tests**:

   - New member sign up with payment
   - Login and upgrade existing loyalty member
   - Book ticket as unlimited member (verify no charge)
   - Book with overcharge (PLF/IMAX/3D)
   - Display correct member card in dashboard

2. **Friend Booking Tests**:
   - Invite friend and accept invitation
   - Book on behalf of friend
   - Verify primary member charged overcharge only
   - Validate friend booking limits

#### Phase 3: Advanced Subscription Features (Week 3-4)

1. **P1 High Priority Tests**:

   - Voucher redemption (gift subscription)
   - Subscription renewal flow
   - Refund scenarios
   - Attempt to use expired subscription

2. **P2-P3 Tests**:
   - Landing page display and CTA
   - Member card customization (CMS)
   - Advanced markup display
   - Edge cases (max friends, multiple orders)

#### Phase 4: Integration & Optimization (Week 4-5)

1. **Integration Tests**:

   - Unlimited + Loyalty integration (restricted earning/burning)
   - Unlimited + Points (can burn, cannot earn from tickets)
   - Unlimited booking timeout handling

2. **Performance & Stability**:
   - Parallel execution of independent tests
   - Test data cleanup and reset
   - Flaky test identification and fixes

### Success Criteria

- [ ] All 60+ Unlimited test cases automated
- [ ] Subscription signup flow: 100% success rate
- [ ] Friend booking scenarios: < 5% false positives
- [ ] Overcharge calculations: 100% accuracy
- [ ] Test suite runtime: < 20 minutes
- [ ] Integration with CI/CD pipeline
- [ ] Zero subscription-related bugs escape to production

### Rollback Plan

- Critical flows (signup, basic booking) remain manually tested as backup
- Gradual automation: automate one flow at a time, validate stability
- Can disable automated Unlimited tests if environment issues occur
- Manual test cases documented and maintained in parallel during transition period

## Notes

### Test Cases from Manual Suite (CSV Analysis)

**Critical Unlimited Tests** (Based on ocg-3654.csv):

1. **Sign Up & Login**:

   - `COMS-11272`: Login/Sign up display and layout
   - `COMS-11273`: Sign up as new member
   - `COMS-11274`: Login and upgrade existing member
   - `COMS-11275`: Login and upgrade with Unlimited member
   - `COMS-11276`: Login and upgrade with non-Unlimited member
   - `COMS-11279`: Sign up and continue Unlimited flow

2. **Booking & Payments**:

   - `COMS-11972`: Buy tickets with unlimited subscription (48 test executions!)
   - `COMS-12727`: Pay overcharge for PLF shows (5 passes)
   - `COMS-11750`: Payment success flow
   - `COMS-11731`: Book on behalf of a friend (12 test cases)
   - `COMS-12499`: Check Menu Clasico Unlimited price

3. **Friend Management**:

   - `COMS-11692`: Request member to be friends after accepting invitation (6 tests)
   - `COMS-12969`: Ticket picker display with friends (2 failures!)
   - Friend invitation/acceptance workflows

4. **Voucher Redemption**:

   - `COMS-11577`: Select redeem voucher option in signup
   - `COMS-11579`: Display and layout
   - `COMS-11580`: Redeem subscription voucher
   - `COMS-11582`: Attempt to redeem non-existing voucher
   - `COMS-11585`: Cancel redemption process
   - `COMS-13484`: Attempt to redeem voucher more than once
   - `COMS-13485`: Attempt to redeem after refund (3 pending!)
   - `COMS-17008`: Redeem unlimited voucher
   - `COMS-17009`: Attempt to redeem unsold voucher
   - `COMS-17010`: Attempt to refund redeemed voucher
   - `COMS-17015`: Attempt to redeem expired voucher

5. **Integration with Loyalty**:

   - `COMS-13122`: Restricted Unlimited can earn/burn points at web
   - `COMS-13123`: Points earned by primary member only during friend booking
   - `COMS-13124`: Existing Unlimited can burn available points
   - `COMS-13132`: Don't earn points for ticket order as Unlimited
   - `COMS-13151`: MyCinesa and Unlimited earn same points with F&B
   - `COMS-13157`: Attempt to use points in El Clasico menu (Unlimited) - 3 pending

6. **Member Area & Card**:

   - `COMS-11793`: Visit link to Unlimited membership benefits
   - `COMS-11711`: Member's area display and layout
   - `OCG-3036`: Account card logo pulled from CMS subscription package
   - `OCG-3037`: Account card background pulled from CMS
   - `OCG-3038`: Subscriptions without background display existing (5 pending!)
   - `OCG-3051`: Subscriptions without header logo display nothing (5 pending!)

7. **Landing Page**:

   - `COMS-11226`: Display and layout Unlimited landing page
   - `COMS-11559`: Visit landing page while already subscribed
   - `OCG-2413`: Loyalty plan comparison table styling (mobile)

8. **Renewals & Advanced Features**:

   - `COMS-16263`: Payment period display with advanced markup (8 passes)
   - `COMS-16281`: Renewals advanced markup display (4 pending!)
   - `COMS-16712`: Order handling - multiple orders

9. **Edge Cases & Errors**:
   - `COMS-13427`: Add to calendar - Unlimited+Friend booking (3 failures!)
   - `COMS-17660`: Attempt to login with username + password
   - `OCG-1180`: Subscription min age check

### Related Links

- [Unlimited Business Rules Documentation](link-to-confluence)
- [Subscription API Documentation](link-to-api-docs)
- [Friend Booking Architecture](link-to-design-doc)
- [JIRA Epic: OCG-XXXX - Unlimited Testing Automation](link-to-jira)
- [Manual Test Suite: ocg-3654.csv](link-to-test-cases)

### Dependencies

- Access to subscription management API (staging)
- Payment gateway mock/sandbox environment
- Pre-configured unlimited test accounts (various states)
- Friend network test accounts (linked accounts)
- CMS access for member card configuration testing

### Risks & Mitigations

| Risk                                   | Impact | Mitigation                                      |
| -------------------------------------- | ------ | ----------------------------------------------- |
| Friend network state contamination     | High   | Isolate test accounts, reset links before tests |
| Payment gateway failures               | Medium | Use sandbox mode, implement retry logic         |
| Subscription state transitions complex | High   | API helpers to force specific states            |
| Overcharge calculation changes         | Medium | Parameterize rules, version in config           |
| Friend booking limits flaky            | Medium | Wait for API confirmations, add explicit waits  |

### Known Issues from CSV

- **COMS-12969**: Ticket picker display with friends showing 2 failures
- **COMS-13427**: Add to calendar with friend booking showing 3 failures
- **COMS-13485**: Redeem voucher after refund showing 3 pending (needs investigation)
- **COMS-13157**: Use points in El Clasico menu showing 3 pending
- **COMS-16281**: Renewals advanced markup showing 4 pending
- **OCG-3038**, **OCG-3051**: Member card CMS issues showing 5+ pending each

### Update

- **Last review**: 2025-10-08 by [@fcabanilla]
- **Next review**: 2025-11-08
- **Implementation status**: Not started

---

**Template Version**: 1.0
**Created**: October 8, 2025
**Maintained by**: Cinema Automation Team
