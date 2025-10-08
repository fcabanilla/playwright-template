# ADR-0008: My Account Area Testing Strategy

**Status**: Accepted

**Date**: 2025-10-08

**Authors**: [@fcabanilla]

**Reviewers**: [@qa-team]

## Context

The My Account area is the central hub for member self-service functionality, encompassing profile management, booking history, preferences, payment methods, loyalty balance, subscription management, and offers/rewards. It's a critical touchpoint for member engagement and retention, requiring comprehensive testing to ensure data accuracy, security, and usability.

### Background

- **40+ manual test cases** for My Account area features
- Multiple subsections: Overview, Bookings, Preferences, Membership, Offers, Card Wallet
- Integration with all major systems: Loyalty, Unlimited, Booking, Payment
- GDPR compliance requirements for data management
- Real-time data synchronization across booking journey and account area
- Personalization features based on member preferences and history

### Forces at Play

- **Data Integrity**: Member profile data must be accurate and consistent across sessions
- **Security**: Payment methods, personal data, transaction history are sensitive
- **User Experience**: Account area is frequently visited, must be intuitive and fast
- **Integration Complexity**: Touches all major systems (loyalty, subscription, booking, payment)
- **GDPR Compliance**: Data privacy, consent management, right to be forgotten
- **Performance**: Must load quickly even with large booking/transaction histories
- **Mobile-First**: Account area heavily used on mobile devices

## Decision

### Chosen Option

**Implement a modular My Account testing framework organized by subsection (Overview, Bookings, Preferences, etc.), with shared authentication fixtures, reusable profile data helpers, and comprehensive data validation assertions.**

We will:

1. **Create Subsection-Specific Page Objects**:

   - `MyAccountOverview` - Dashboard, points balance, recent bookings summary
   - `MyAccountBookings` - Booking history, upcoming sessions, past sessions
   - `MyAccountPreferences` - Email/SMS notifications, favorite cinemas, communication settings
   - `MyAccountMembership` - Subscription status, loyalty tier, membership details
   - `MyAccountOffers` - Available offers, rewards, promotions
   - `MyAccountCardWallet` - Saved payment methods, add/remove cards
   - `MyAccountProfile` - Personal information, password management

2. **Authentication & State Management**:

   - Shared authenticated session fixtures
   - Pre-configured member accounts with known data
   - Helper utilities to manipulate account state via API

3. **Data Validation Patterns**:

   - Assertion helpers for cross-section data consistency
   - Validation of data synchronization (booking → history, purchase → points)
   - Privacy and security checks (masked data, secure transmission)

4. **Test Data Isolation**:

   - Dedicated test accounts per subsection (to avoid conflicts)
   - API helpers to seed predictable data (bookings, points, preferences)
   - Cleanup utilities to reset account state

5. **Priority Testing Approach**:
   - **P0 - Critical**: Overview display, Booking history, Profile updates
   - **P1 - High**: Preferences management, Card wallet, Offers display
   - **P2 - Medium**: Membership details, Password change, Edge cases
   - **P3 - Low**: UI styling, Responsive layout, Animations

### Considered Alternatives

#### Option A: Single Monolithic MyAccount Page Object

- **Pros**:
  - Simpler structure, one file to maintain
  - All account logic in one place
- **Cons**:
  - Massive file size (1000+ lines)
  - Hard to navigate and maintain
  - Violates Single Responsibility Principle
  - Difficult to isolate failures
- **Reason for rejection**: Unmaintainable at scale, poor separation of concerns

#### Option B: Test Each Subsection in Isolation Only

- **Pros**:
  - Fast execution per subsection
  - Clear boundaries between tests
  - Easy to parallelize
- **Cons**:
  - Misses integration issues (data sync across subsections)
  - Doesn't validate navigation between sections
  - Can't catch inconsistencies in shared data
- **Reason for rejection**: Insufficient coverage of integration points

#### Option C: Modular Objects + Integration Tests (Chosen)

- **Pros**:
  - Clear separation of concerns per subsection
  - Reusable components across tests
  - Balance of unit + integration testing
  - Easy to maintain and extend
- **Cons**:
  - More upfront design work
  - Requires careful fixture management
- **Reason for selection**: Best long-term maintainability and test coverage

## Consequences

### Positive

- **Comprehensive Coverage**: All account subsections automated (7+ areas)
- **Data Consistency Validation**: Cross-section data synchronization verified
- **Rapid Regression**: Full account area suite runs in < 15 minutes
- **Security Testing**: Payment masking, data privacy checks automated
- **GDPR Compliance**: Data management flows validated systematically
- **Member Experience Confidence**: Critical self-service flows always working
- **Reduced Manual Effort**: 40+ hours/month saved on manual account testing

### Negative

- **Complex Test Data**: Managing member accounts with diverse states
- **Authentication Overhead**: Every test needs authenticated session
- **State Dependencies**: Tests may depend on specific account configurations
- **Cross-Section Dependencies**: Changes in one area may impact others

### Neutral

- **API Heavy**: Many tests use API to setup/verify data
- **Session Management**: Shared fixtures for authentication across tests
- **Data Seeding**: Requires API access to populate account data

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
// ✅ CORRECT: myAccountBookings.selectors.ts
export const myAccountBookingsSelectors = {
  bookingsList: '[data-testid="bookings-list"]',
  bookingItem: (bookingId: string) => `[data-booking-id="${bookingId}"]`,
  refundButton: '[data-testid="booking-refund-btn"]',
} as const;

// ✅ CORRECT: myAccountBookings.page.ts
export class MyAccountBookingsPage {
  constructor(private readonly webActions: WebActions) {} // ✅ NOT page: Page
  private readonly selectors = myAccountBookingsSelectors;

  async getBookingHistory(): Promise<string[]> {
    // ✅ Delegates to WebActions
    return await this.webActions.getAllTexts(this.selectors.bookingsList);
  }
}
```

### Implementation Plan

#### Phase 1: Foundation & Core Subsections (Week 1-2)

1. **Create Core Page Objects** (following ADR-0009 rules):

   ```typescript
   // pageObjectsManagers/cinesa/myAccount/myAccountOverview.selectors.ts
   // pageObjectsManagers/cinesa/myAccount/myAccountOverview.page.ts
   // pageObjectsManagers/cinesa/myAccount/myAccountBookings.selectors.ts
   // pageObjectsManagers/cinesa/myAccount/myAccountBookings.page.ts
   // pageObjectsManagers/cinesa/myAccount/myAccountPreferences.selectors.ts
   // pageObjectsManagers/cinesa/myAccount/myAccountPreferences.page.ts
   // pageObjectsManagers/cinesa/myAccount/myAccountMembership.selectors.ts
   // pageObjectsManagers/cinesa/myAccount/myAccountMembership.page.ts
   ```

2. **Shared Authentication Fixtures**:

   ```typescript
   // fixtures/cinesa/myAccount.fixtures.ts
   export const test = base.extend({
     authenticatedMember: async ({ page }, use) => {
       // Login with test member credentials
       // Navigate to My Account
       await use(myAccountPage);
       // Cleanup if needed
     },
   });
   ```

3. **Account State Helpers**:

   ```typescript
   // tests/cinesa/myAccount/myAccount.helpers.ts
   class MyAccountHelpers {
     async createMemberWithBookings(email: string, bookingCount: number);
     async createMemberWithPoints(email: string, points: number);
     async updatePreferences(email: string, preferences: object);
     async addPaymentMethod(email: string, cardDetails: object);
     async resetAccountState(email: string);
   }
   ```

4. **Test Data Structure**:

   ```typescript
   // tests/cinesa/myAccount/myAccount.data.ts
   export const myAccountTestData = {
     testMembers: {
       withBookings: { email, password, bookingsCount: 5 },
       withPoints: { email, password, points: 500 },
       withSubscription: { email, password, subscriptionTier: 'unlimited' },
       newMember: { email, password, registeredDate: 'today' },
     },
     preferences: {
       emailNotifications: true,
       smsNotifications: false,
       favoriteCinemas: ['Cinema1', 'Cinema2'],
     },
   };
   ```

#### Phase 2: Critical Account Tests (Week 2-3)

1. **P0 Critical Tests**:

   - Overview displays correct points balance
   - Booking history shows all bookings (upcoming + past)
   - Update email/SMS preferences successfully
   - Display correct membership tier and benefits
   - Profile information displayed accurately

2. **Data Synchronization Tests**:
   - Make booking → Verify appears in history immediately
   - Earn points → Verify balance updates in overview
   - Change preference → Verify reflected across all pages
   - Add card → Verify appears in wallet and payment options

#### Phase 3: Advanced Account Features (Week 3-4)

1. **P1 High Priority Tests**:

   - Add/remove payment method from card wallet
   - View and redeem available offers
   - Filter bookings (upcoming vs past)
   - Update password with validation
   - Select/update favorite cinemas

2. **P2-P3 Tests**:
   - Membership details display (loyalty/unlimited)
   - Responsive layout across devices
   - Navigation between subsections
   - Edge cases (empty states, long lists)

#### Phase 4: Security & Compliance (Week 4)

1. **Security & Privacy Tests**:

   - Payment card numbers properly masked
   - Session timeout handling
   - GDPR consent management
   - Data export/deletion requests (if applicable)

2. **Integration Validation**:
   - Account data consistent with booking journey
   - Loyalty balance matches transaction history
   - Subscription status reflected across account area
   - Preferences applied in booking journey

### Success Criteria

- [ ] All 40+ My Account test cases automated
- [ ] Data synchronization: 100% accuracy across subsections
- [ ] Security tests: All sensitive data properly masked
- [ ] Test suite runtime: < 15 minutes
- [ ] Zero cross-section data inconsistencies
- [ ] Integration with CI/CD pipeline
- [ ] GDPR compliance validated

### Rollback Plan

- Critical flows (overview, booking history) remain manually tested as backup
- Gradual automation per subsection, validate before expanding
- Can disable specific subsection tests if environment issues
- Manual test documentation maintained in parallel

## Notes

### Test Cases from Manual Suite (CSV Analysis)

**Critical My Account Tests** (Based on ocg-3654.csv):

1. **Overview/Dashboard**:

   - `COMS-6033`: Overview display and layout (4 passes)
   - `OCG-2454`: Dashboard watched films total matches loyalty balance (2 failures!)
   - `OCG-3356`: Verify BBVA modal not displayed after signup (3 passes)

2. **My Bookings**:

   - `COMS-7087`: My bookings display and layout (4 passes)
   - `COMS-7088`: Make booking for upcoming session (4 passes)
   - `COMS-15957`: Verify session displayed on past bookings after it ends (4 passes)

3. **Preferences**:

   - `COMS-6044`: Toggle email notifications for offers/news (4 passes)
   - `COMS-6046`: Select favorite cinemas (4 passes)
   - `OCG-1167`: Modify SMS/Email preferences after Loyalty signup (6 passes)
   - `OCG-1190`: Phone number optional in signup - finish without it (6 passes)
   - `OCG-1191`: Phone number optional for Subscription - finish without it (2 failures!)
   - `OCG-1197`: Toggle on/off mandatory phone number in Order summary (6 passes)

4. **Card Wallet**:

   - `COMS-11780`: Add new credit card (3 passes)
   - `COMS-11783`: Cancel adding new credit card (2 passes)

5. **Membership**:

   - `COMS-7078`: Display and layout with no Unlimited subscription (4 passes)
   - `COMS-11793`: Visit link to Unlimited membership benefits (3 passes)
   - `COMS-11711`: Member's area display and layout (3 passes)
   - `OCG-1179`: Age - upgrading from existing member to subscription (1 pass)
   - `OCG-1180`: Subscription min age check (1 pass)

6. **Offers and Rewards**:

   - `COMS-7374`: Offers and rewards display and layout (4 passes)
   - `OCG-2453`: Verify subscribers/staff cannot spend earned points on manual rewards (3 pending!)
   - `OCG-2992-2994`: Reward Store modal rendering (multiple pending!)

7. **Profile & Security**:

   - `COMS-6001`: "Change password link" email received (3 passes)
   - `COMS-6002`: Change password (3 failures!)
   - `COMS-8967`: Attempt to modify user data after login (3 passes)
   - `COMS-11926`: Confirm guest data, go back and login, verify correct data (1 pass)

8. **Character Validation**:

   - `COMS-16634`: Attempt to use special characters in member area (4 pending!)
   - `OCG-2601`: Special character handling in sign up form (1 pass)

9. **Seat Swap (Living Ticket)**:
   - `OCG-2526`: Members able to perform seat swap (4 passes)
   - `OCG-2527`: Configuration and layout of seat swap disabled message (3 pending!)
   - `OCG-2525`: Guests unable to perform seat swap when restricted to members (2 passes)
   - `OCG-3108`: Purchase as guest, sign up, then seat swap (3 passes)
   - `OCG-3109`: Purchase as guest, sign in, then seat swap (3 passes)
   - `OCG-3110`: Purchase as member, sign in, then seat swap (1 pass)
   - `OCG-3288`: Buy ticket as guest and login to swap seats (3 passes)
   - `OCG-3290`: Buy ticket as guest and sign up to swap seats (3 passes)
   - `COMS-13263-13266`: Various seat swap restriction scenarios

### Related Links

- [My Account UX Design](link-to-figma)
- [Member Data API Documentation](link-to-api-docs)
- [GDPR Compliance Requirements](link-to-compliance-doc)
- [JIRA Epic: OCG-XXXX - My Account Automation](link-to-jira)
- [Manual Test Suite: ocg-3654.csv](link-to-test-cases)

### Dependencies

- Access to member management API (staging)
- Pre-configured test member accounts (various states)
- Payment gateway sandbox for card wallet tests
- Email testing service for preference/notification tests
- Session management infrastructure

### Risks & Mitigations

| Risk                                 | Impact | Mitigation                                            |
| ------------------------------------ | ------ | ----------------------------------------------------- |
| Test data contamination across tests | High   | Isolate test accounts, use unique emails per test     |
| Session timeouts during long tests   | Medium | Refresh session tokens, implement session keep-alive  |
| Payment card storage security        | High   | Use test cards only, never real payment data          |
| Data sync delays causing flaky tests | Medium | Implement polling with timeout, add explicit waits    |
| GDPR requirements change             | Low    | Version compliance checks, monitor regulatory updates |

### Known Issues from CSV

- **OCG-2454**: Dashboard watched films not matching loyalty balance (2 failures)
- **COMS-6002**: Change password showing 3 failures (critical!)
- **OCG-1191**: Phone number optional for subscription showing 2 failures
- **OCG-2453**: Subscribers can't spend points on manual rewards (3 pending)
- **COMS-16634**: Special character validation in member area (4 pending)
- **OCG-2527**: Seat swap disabled message configuration (3 pending)
- **OCG-2992-2994**: Reward Store modal issues (multiple pending)

### Update

- **Last review**: 2025-10-08 by [@fcabanilla]
- **Next review**: 2025-11-08
- **Implementation status**: Not started

---

**Template Version**: 1.0
**Created**: October 8, 2025
**Maintained by**: Cinema Automation Team
