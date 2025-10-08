# ADR-0006: Loyalty Program Testing Strategy

**Status**: Accepted

**Date**: 2025-10-08

**Authors**: [@fcabanilla]

**Reviewers**: [@qa-team]

## Context

The Cinesa loyalty program (MyCinesa) is a critical business feature that drives customer retention and repeat purchases. It involves complex point calculations, earning/burning mechanics, integrations with ticketing and F&B systems, and requires comprehensive automated testing to ensure accuracy and reliability.

### Background

- **177+ manual test cases** exist for Loyalty, Unlimited, and My Account features
- Current manual testing is time-consuming and error-prone for point calculations
- Business rules are complex: earn/burn ratios, restricted tickets, member tiers
- High-value feature: loyalty members represent significant revenue
- Integration points: ticketing, F&B, refunds, member benefits

### Forces at Play

- **Complexity**: Point calculations, member tiers, eligibility rules
- **Business Impact**: Incorrect points could result in financial losses or customer complaints
- **Integration**: Tight coupling with ticketing, F&B, payment, and refund systems
- **Regulatory**: Member data privacy, transaction history, GDPR compliance
- **Performance**: Real-time point calculations during checkout flow
- **Maintainability**: Rules change frequently (promotions, campaigns)

## Decision

### Chosen Option

**Implement a multi-layered testing strategy for Loyalty Program automation with Page Object Model architecture, separating business rules validation from UI interactions, and prioritizing critical earn/burn flows.**

We will:

1. **Create dedicated Page Objects** for loyalty components:

   - `LoyaltyDashboard` - Account overview, points balance
   - `LoyaltyEarnBurn` - Point transactions and calculations
   - `LoyaltyRewards` - Reward redemption flows
   - `LoyaltyPreferences` - Member preferences management

2. **Implement Business Rules Layer**:

   - Separate point calculation logic from UI tests
   - Create assertion helpers for complex validations
   - Mock external point calculation APIs where needed

3. **Test Data Management**:

   - Pre-seed loyalty accounts with known point balances
   - Create test members across all tiers (standard, premium, etc.)
   - Isolated test data to avoid cross-test contamination

4. **Priority Testing Approach**:
   - **P0 - Critical**: Earn points (tickets + F&B), Burn points, Balance display
   - **P1 - High**: Refunds with points, Restricted tickets, Member benefits
   - **P2 - Medium**: Preferences, notifications, transaction history
   - **P3 - Low**: Edge cases, UI styling, tooltips

### Considered Alternatives

#### Option A: Full E2E Manual Testing Only

- **Pros**:
  - No automation development time
  - Human verification of complex scenarios
- **Cons**:
  - 50+ hours/month manual effort
  - Error-prone calculations
  - Cannot scale to multiple environments
  - Slow feedback loop
- **Reason for rejection**: Unsustainable at scale, high risk of human error in calculations

#### Option B: API-Only Testing (No UI)

- **Pros**:
  - Fast execution
  - Precise point calculation validation
  - Easy to parallelize
- **Cons**:
  - Misses UI bugs (display, rounding errors)
  - Doesn't validate user experience
  - Can't catch frontend integration issues
- **Reason for rejection**: Doesn't provide confidence in end-user experience

#### Option C: Hybrid UI + API Testing (Chosen)

- **Pros**:
  - Validates business logic via API
  - Confirms UI displays correct information
  - Catches integration issues
  - Faster than pure UI tests
- **Cons**:
  - Requires maintaining both UI and API test suites
  - More initial setup effort
- **Reason for selection**: Best balance of speed, coverage, and confidence

## Consequences

### Positive

- **Accuracy**: Automated point calculation validation eliminates human error
- **Speed**: Regression suite runs in minutes vs hours of manual testing
- **Coverage**: Can test all member tiers, edge cases, and promotions systematically
- **Confidence**: Real-time validation during development cycle
- **Documentation**: Tests serve as living documentation of business rules
- **Scalability**: Easy to add new test cases as program evolves

### Negative

- **Initial Investment**: 3-4 weeks to build comprehensive loyalty test suite
- **Maintenance**: Business rule changes require test updates
- **Test Data**: Requires careful management of loyalty accounts and point balances
- **Complexity**: Point calculations can be difficult to reproduce consistently

### Neutral

- **API Dependency**: Tests depend on loyalty API stability
- **Environment Management**: Need staging environment with loyalty system access
- **Team Skills**: QA team needs to understand loyalty business rules deeply

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
// ✅ CORRECT: loyaltyDashboard.selectors.ts
export const loyaltyDashboardSelectors = {
  pointsBalance: '[data-testid="loyalty-points-balance"]',
  earnedPoints: '[data-testid="earned-points-value"]',
  transactionHistory: '[data-testid="transaction-history"]',
} as const;

// ✅ CORRECT: loyaltyDashboard.page.ts
export class LoyaltyDashboardPage {
  constructor(private readonly webActions: WebActions) {} // ✅ NOT page: Page
  private readonly selectors = loyaltyDashboardSelectors;

  async getPointsBalance(): Promise<number> {
    // ✅ Delegates to WebActions
    const text = await this.webActions.getText(this.selectors.pointsBalance);
    return parseInt(text.replace(/[^\d]/g, ''), 10);
  }
}
```

### Implementation Plan

#### Phase 1: Foundation (Week 1-2)

1. **Create Page Objects** (following ADR-0009 rules):

   ```typescript
   // pageObjectsManagers/cinesa/loyalty/loyaltyDashboard.selectors.ts
   // pageObjectsManagers/cinesa/loyalty/loyaltyDashboard.page.ts
   // pageObjectsManagers/cinesa/loyalty/loyaltyEarnBurn.selectors.ts
   // pageObjectsManagers/cinesa/loyalty/loyaltyEarnBurn.page.ts
   // pageObjectsManagers/cinesa/loyalty/loyaltyRewards.selectors.ts
   // pageObjectsManagers/cinesa/loyalty/loyaltyRewards.page.ts
   ```

2. **Create Assertion Helpers**:

   ```typescript
   // tests/cinesa/loyalty/loyalty.assertions.ts
   class LoyaltyAssertions {
     async assertPointsEarned(expected: number, tolerance: number = 0);
     async assertPointsBurned(expected: number);
     async assertBalanceDisplayed(expected: number);
   }
   ```

3. **Setup Test Data**:

   ```typescript
   // tests/cinesa/loyalty/loyalty.data.ts
   export const loyaltyTestAccounts = {
     standardMember: { email, initialPoints: 100 },
     premiumMember: { email, initialPoints: 500 },
     zeroBalance: { email, initialPoints: 0 },
   };
   ```

#### Phase 2: Critical Tests (Week 2-3)

1. **P0 Critical Tests**:

   - Earn points on ticket purchase
   - Earn points on F&B purchase
   - Burn points on ticket purchase
   - Burn points on F&B purchase
   - Display correct point balance
   - Display transaction history

2. **Integration with Existing Flows**:
   - Extend `ticketPicker.spec.ts` to validate point earning
   - Extend `bar.spec.ts` to validate F&B points
   - Add loyalty checks to `purchaseSummary.spec.ts`

#### Phase 3: Advanced Tests (Week 3-4)

1. **P1 High Priority Tests**:

   - Refund transaction with points payment
   - Restricted loyalty-only tickets
   - Member benefit validation
   - Point expiration scenarios

2. **P2-P3 Tests**:
   - Preferences management
   - Notifications
   - Edge cases and error handling

### Success Criteria

- [ ] All 50+ critical loyalty test cases automated
- [ ] Test suite runs in < 15 minutes
- [ ] Point calculation accuracy: 100% (zero tolerance)
- [ ] Coverage of all member tiers and scenarios
- [ ] Integration with CI/CD pipeline
- [ ] Zero false positives in regression runs
- [ ] Test data management working across environments

### Rollback Plan

- If automation proves unreliable, revert to manual testing for critical flows
- Keep manual test cases documented as backup
- Gradual rollout: automate one flow at a time, validate before expanding
- No point of no return: can always supplement with manual testing

## Notes

### Test Cases from Manual Suite (CSV Analysis)

**Critical Loyalty Tests** (Based on ocg-3654.csv):

1. **Points Earning**:

   - `OCG-1167`: Modify SMS/Email preferences after signup
   - `COMS-13151`: MyCinesa and Unlimited earn same points with F&B
   - `COMS-13132`: Don't earn points for tickets as Unlimited member

2. **Points Burning**:

   - `COMS-13130`: Burn points within transaction
   - `COMS-13124`: Unlimited member can burn available points
   - `COMS-13157`: Attempt to use points in El Clasico menu (Unlimited)

3. **Refunds with Points**:

   - `COMS-13243`: Refund transaction paid with F&B points + other payment
   - `COMS-13395`: Refund F&B purchase with F&B points payment
   - `OCG-2652`, `OCG-2662`: Additional refund scenarios

4. **Restricted Tickets**:

   - `OCG-3573`: CMS toggle for loyalty-restricted tickets
   - `OCG-3580`: Display restricted tickets when NOT signed in
   - `OCG-3574`: Display restricted tickets when signed in as loyalty member
   - `COMS-13122`: Restricted Unlimited account can earn/burn points

5. **Account Management**:
   - `OCG-2454`: Dashboard watched films total matches loyalty balance
   - `OCG-1196`: Verify data after signing up as Loyalty
   - `OCG-2544`: Loyalty sign up form validation

### Related Links

- [Loyalty Business Rules Documentation](link-to-confluence)
- [Point Calculation API Documentation](link-to-api-docs)
- [JIRA Epic: OCG-XXXX - Loyalty Testing Automation](link-to-jira)
- [Manual Test Suite: ocg-3654.csv](link-to-test-cases)

### Dependencies

- Access to loyalty API staging environment
- Pre-seeded test accounts with known point balances
- Mock payment gateway for refund testing
- Coordination with loyalty system team for business rule clarifications

### Risks & Mitigations

| Risk                                       | Impact | Mitigation                                                   |
| ------------------------------------------ | ------ | ------------------------------------------------------------ |
| Point calculation changes frequently       | High   | Version business rules in code comments, monitor API changes |
| Test data contamination                    | Medium | Isolated test accounts, reset balances before each run       |
| API response time impacts tests            | Low    | Set appropriate timeouts, implement retry logic              |
| Complex refund scenarios hard to reproduce | Medium | Use API to create pre-conditions, mock payment responses     |

### Update

- **Last review**: 2025-10-08 by [@fcabanilla]
- **Next review**: 2025-11-08
- **Implementation status**: Not started

---

**Template Version**: 1.0  
**Created**: October 8, 2025  
**Maintained by**: Cinema Automation Team
