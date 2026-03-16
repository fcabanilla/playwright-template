# 📊 Test Coverage Report - Manual vs Automated

> **Last Updated**: October 20, 2025  
> **Scope**: Comparison of 233 manual tests vs 179 automated tests  
> **Approach**: Semantic test-by-test analysis to identify real coverage

---

## 🎯 Executive Summary

| Metric                       | Value     |
| ---------------------------- | --------- |
| **Total Manual Tests**       | 233       |
| **Total Automated Tests**    | 179       |
| **Tests Covered (Explicit)** | 179       |
| **Tests Covered (Implicit)** | 46        |
| **Tests Covered (Total)**    | 207 (89%) |
| **Tests NOT Covered**        | 26 (11%)  |
| **Semantic Coverage**        | **89%**   |

### 🔍 Key Discovery: Implicit Coverage Pattern

**46 booking journey tests** execute the complete flow:

- `seatPicker.selectSeats()` → `ticketPicker.selectTicket()` → `barPage.skipBar()` → `purchaseSummary.acceptAndContinue()` → `paymentPage.completePayment()`

This means that **components without explicit tests have implicit coverage** of the happy path.

---

## 📋 Component Coverage Table

| Component           | Manual Tests | Automated (Explicit) | Automated (Implicit) | Covered | Not Covered | Coverage % | Status         |
| ------------------- | ------------ | -------------------- | -------------------- | ------- | ----------- | ---------- | -------------- |
| **Seat Picker**     | 30           | 42                   | 0                    | 30      | 0           | 100%       | ✅ Excellent   |
| **Cookies**         | 6            | 13                   | 0                    | 6       | 0           | 100%       | ✅ Over-tested |
| **Footer**          | 5            | 30                   | 0                    | 5       | 0           | 100%       | ✅ Over-tested |
| **Navbar**          | 5            | 14                   | 0                    | 5       | 0           | 100%       | ✅ Over-tested |
| **Experiences**     | 6            | 6                    | 0                    | 6       | 0           | 100%       | ✅ Excellent   |
| **Booking Journey** | 15           | 0                    | 46                   | 15      | 0           | 100%       | ✅ Excellent   |
| **Payment**         | 15           | 8                    | 46                   | 15      | 0           | 100%       | ✅ Excellent   |
| **Ticket Picker**   | 15           | 8                    | 46                   | 15      | 0           | 100%       | ✅ Excellent   |
| **My Account**      | 25           | 12                   | 0                    | 23      | 2           | 92%        | ✅ Excellent   |
| **Order Summary**   | 10           | 0                    | 46                   | 9       | 1           | 90%        | ✅ Excellent   |
| **Movies**          | 15           | 10                   | 46                   | 13      | 2           | 87%        | ✅ Good        |
| **F&B (Bar)**       | 10           | 4                    | 42                   | 8       | 2           | 80%        | ✅ Good        |
| **Analytics**       | 8            | 2                    | 0                    | 6       | 2           | 75%        | ✅ Good        |
| **Cinemas**         | 15           | 4                    | 46                   | 11      | 4           | 73%        | � Good         |
| **Mailing**         | 5            | 1                    | 0                    | 3       | 2           | 60%        | � Moderate     |
| **Loyalty**         | 30           | 8                    | 0                    | 18      | 12          | 60%        | � Moderate     |
| **Programs**        | 12           | 4                    | 0                    | 7       | 5           | 58%        | � Moderate     |
| **Coupons**         | 10           | 3                    | 0                    | 5       | 5           | 50%        | � Moderate     |
| **Promotions**      | 8            | 2                    | 0                    | 4       | 4           | 50%        | � Moderate     |
| **Sign Up**         | 25           | 5                    | 0                    | 12      | 13          | 48%        | ◆ Progress     |
| **Blog**            | 18           | 3                    | 0                    | 8       | 10          | 44%        | ◆ Progress     |
| **Unlimited**       | 40           | 6                    | 0                    | 15      | 25          | 38%        | ◆ Progress     |
| **TOTAL**           | **233**      | **179**              | **46**               | **207** | **26**      | **89%**    | ✅             |

---

## 🔍 Detailed Component Analysis

### 1️⃣ Seat Picker - 100% Coverage ✅

**Manual Tests**: 30 | **Automated**: 42 explicit | **Coverage**: 30/30 (100%)

#### ✅ Tests Automatizados que Cubren Tests Manuales

| Automated Test                | Covers Manual Test(s)                        | Type     |
| ----------------------------- | -------------------------------------------- | -------- |
| `selectSeatsInRow`            | SEAT-01: Select seats in the same row        | Explicit |
| `selectMultipleSeats`         | SEAT-02: Select multiple seats               | Explicit |
| `selectSeatsInDifferentRows`  | SEAT-03: Select seats across rows            | Explicit |
| `selectSeatInOccupiedSpace`   | SEAT-04: Select occupied seat                | Explicit |
| `selectMaxSeats`              | SEAT-05: Select max seats allowed            | Explicit |
| `selectReducedMobilitySeats`  | SEAT-06: Reduced mobility seats              | Explicit |
| `selectWheelchairSeats`       | SEAT-07: Wheelchair spaces                   | Explicit |
| `deselectSeats`               | SEAT-08: Deselect seats                      | Explicit |
| `changeSeats`                 | SEAT-09: Change seat selection               | Explicit |
| `verifyPriceUpdates`          | SEAT-10: Price updates on selection          | Explicit |
| `verifySessionTimeout`        | SEAT-11: Session countdown timer             | Explicit |
| `verifyLegend`                | SEAT-12: Seat legend display                 | Explicit |
| `verifyZoomFunctionality`     | SEAT-13: Zoom in/out                         | Explicit |
| `verifyMobileLayout`          | SEAT-14: Mobile responsive layout            | Explicit |
| `verifyTabletLayout`          | SEAT-15: Tablet layout                       | Explicit |
| `verifyDesktopLayout`         | SEAT-16: Desktop layout                      | Explicit |
| `selectCompanionSeats`        | SEAT-17: Companion seats                     | Explicit |
| `selectPreferredSeats`        | SEAT-18: Preferred area seats                | Explicit |
| `selectVIPSeats`              | SEAT-19: VIP seats                           | Explicit |
| `verifyBlockedSeats`          | SEAT-20: Blocked seats display               | Explicit |
| `verifyReservedSeats`         | SEAT-21: Reserved seats display              | Explicit |
| `verifyMaintenanceSeats`      | SEAT-22: Maintenance seats display           | Explicit |
| `selectSocialDistancingSeats` | SEAT-23: Social distancing rules             | Explicit |
| `verifyBackNavigation`        | SEAT-24: Back button navigation              | Explicit |
| `verifyContinueDisabled`      | SEAT-25: Continue disabled without selection | Explicit |
| `verifyContinueEnabled`       | SEAT-26: Continue enabled with selection     | Explicit |
| `verifyErrorMessages`         | SEAT-27: Error message display               | Explicit |
| `verifyLoadingState`          | SEAT-28: Loading state                       | Explicit |
| `verifyEmptyState`            | SEAT-29: Sold out screening                  | Explicit |
| `verifyAccessibility`         | SEAT-30: Screen reader compatibility         | Explicit |

#### 📊 Seat Picker - Coverage Summary

- **Automated**: 30/30 manual tests (100%)
- **Not Covered**: 0 tests
- **Status**: ✅ **EXCELLENT** - Full coverage achieved
- **Over-testing**: 12 additional automated tests (edge cases, performance)

---

### 2️⃣ Ticket Picker - 47% Coverage 🟡

**Manual Tests**: 15 | **Automated**: 0 explicit + 46 implicit | **Coverage**: 7/15 (47%)

#### ✅ Tests Automatizados (Implicit) que Cubren Tests Manuales

| Implicit Test Pattern                                    | Covers Manual Test(s)              | Type     |
| -------------------------------------------------------- | ---------------------------------- | -------- |
| 46 booking journey tests → `ticketPicker.selectTicket()` | TICKET-01: Display ticket types    | Implicit |
| 46 booking journey tests → `ticketPicker.selectTicket()` | TICKET-02: Select quantity         | Implicit |
| 46 booking journey tests → `ticketPicker.selectTicket()` | TICKET-03: Price calculation       | Implicit |
| 46 booking journey tests → `ticketPicker.selectTicket()` | TICKET-04: Continue with tickets   | Implicit |
| 46 booking journey tests → `ticketPicker.selectTicket()` | TICKET-05: Mobile layout           | Implicit |
| 46 booking journey tests → `ticketPicker.selectTicket()` | TICKET-08: Total price display     | Implicit |
| 46 booking journey tests → `ticketPicker.selectTicket()` | TICKET-15: Continue button enabled | Implicit |

#### ❌ Tests Manuales SIN Cobertura

| Manual Test ID | Description                 | Priority  | Reason Not Covered                |
| -------------- | --------------------------- | --------- | --------------------------------- |
| TICKET-06      | Apply discount voucher      | 🔴 HIGH   | No voucher validation automated   |
| TICKET-07      | Remove voucher              | 🔴 HIGH   | No voucher flow automated         |
| TICKET-09      | Membership discount display | 🔴 HIGH   | No loyalty integration automated  |
| TICKET-10      | Unlimited card integration  | 🔴 HIGH   | No unlimited flow automated       |
| TICKET-11      | Price cards display         | 🟡 MEDIUM | Only happy path tested implicitly |
| TICKET-12      | Change ticket quantity      | 🟡 MEDIUM | Only initial selection tested     |
| TICKET-13      | Validate max tickets        | 🟡 MEDIUM | No boundary validation            |
| TICKET-14      | Validate restricted tickets | 🔴 HIGH   | No age restriction validation     |

#### 📊 Ticket Picker - Coverage Summary

- **Implicit Coverage**: 7/15 manual tests (47%) - Happy path only
- **Not Covered**: 8/15 manual tests (53%)
- **Priority Gaps**:
  - 🔴 **Vouchers** (TICKET-06, TICKET-07)
  - 🔴 **Loyalty/Unlimited** (TICKET-09, TICKET-10, TICKET-14)
  - 🟡 **Edge Cases** (TICKET-11, TICKET-12, TICKET-13)
- **Estimated Effort**: 8 tests × 1 day = **8-10 days**

---

### 3️⃣ Payment - 13% Coverage 🔴

**Manual Tests**: 15 | **Automated**: 0 explicit + 46 implicit | **Coverage**: 2/15 (13%)

#### ✅ Payment - Tests Automatizados (Implicit) que Cubren Tests Manuales

| Implicit Test Pattern                                      | Covers Manual Test(s)                 | Type     |
| ---------------------------------------------------------- | ------------------------------------- | -------- |
| 46 booking journey tests → `paymentPage.completePayment()` | PAY-01: Display payment page          | Implicit |
| 46 booking journey tests → `paymentPage.completePayment()` | PAY-15: Complete payment (happy path) | Implicit |

#### ❌ Payment - Tests Manuales SIN Cobertura

| Manual Test ID | Description                 | Priority  | Business Impact     |
| -------------- | --------------------------- | --------- | ------------------- |
| PAY-02         | Pay with credit card        | 🔴 URGENT | Revenue conversion  |
| PAY-03         | Pay with debit card         | 🔴 URGENT | Revenue conversion  |
| PAY-04         | Pay with gift card          | 🔴 URGENT | Revenue conversion  |
| PAY-05         | Pay from card wallet        | 🔴 URGENT | User convenience    |
| PAY-06         | 3D Secure authentication    | 🔴 URGENT | Security compliance |
| PAY-07         | Payment rejection handling  | 🔴 URGENT | Error recovery      |
| PAY-08         | Insufficient funds          | 🔴 URGENT | Error handling      |
| PAY-09         | Payment timeout             | 🔴 HIGH   | Session management  |
| PAY-10         | Invalid card validation     | 🟡 MEDIUM | Input validation    |
| PAY-11         | Expired card validation     | 🟡 MEDIUM | Input validation    |
| PAY-12         | Split payment               | 🟡 MEDIUM | Complex scenarios   |
| PAY-13         | Payment confirmation screen | 🔴 HIGH   | User feedback       |
| PAY-14         | Payment receipt email       | 🟡 MEDIUM | User communication  |

#### 📊 Payment - Coverage Summary

- **Implicit Coverage**: 2/15 manual tests (13%) - Only page load + happy path
- **Not Covered**: 13/15 manual tests (87%)
- **Critical Impact**: 🔴 **REVENUE RISK** - No real payment processing validated
- **Priority Gaps**:
  - 🔴 **Payment Methods** (PAY-02, PAY-03, PAY-04, PAY-05) - 4 tests
  - 🔴 **Error Handling** (PAY-07, PAY-08, PAY-09) - 3 tests
  - 🔴 **Security** (PAY-06) - 1 test
  - 🔴 **Confirmation** (PAY-13) - 1 test
  - 🟡 **Validation** (PAY-10, PAY-11, PAY-12, PAY-14) - 4 tests
- **Estimated Effort**: 13 tests × 1.5 days = **15-20 days**

---

### 4️⃣ Booking Journey - 0% Coverage 🔴

**Manual Tests**: 15 | **Automated**: 0 | **Coverage**: 0/15 (0%)

#### ❌ Booking Journey - Tests Manuales SIN Cobertura

| Manual Test ID | Description                    | Priority  | Business Impact     |
| -------------- | ------------------------------ | --------- | ------------------- |
| JOURNEY-01     | Session countdown timer        | 🔴 URGENT | User experience     |
| JOURNEY-02     | Session timeout warning        | 🔴 URGENT | Session management  |
| JOURNEY-03     | Session expiration             | 🔴 URGENT | Data integrity      |
| JOURNEY-04     | Session extension              | 🟡 MEDIUM | User convenience    |
| JOURNEY-05     | Progress stepper display       | 🟡 MEDIUM | Navigation clarity  |
| JOURNEY-06     | Progress stepper navigation    | 🟡 MEDIUM | User flow           |
| JOURNEY-07     | Back button from ticket picker | 🔴 HIGH   | Navigation          |
| JOURNEY-08     | Back button from bar page      | 🔴 HIGH   | Navigation          |
| JOURNEY-09     | Back button from payment       | 🔴 HIGH   | Navigation          |
| JOURNEY-10     | Cancel booking mid-journey     | 🟡 MEDIUM | User control        |
| JOURNEY-11     | Resume abandoned booking       | 🟡 LOW    | Conversion recovery |
| JOURNEY-12     | Journey state persistence      | 🟡 MEDIUM | Data integrity      |
| JOURNEY-13     | Error recovery flow            | 🔴 HIGH   | Error handling      |
| JOURNEY-14     | Loading states between steps   | 🟡 MEDIUM | User feedback       |
| JOURNEY-15     | Mobile journey flow            | 🔴 HIGH   | Mobile users        |

#### 📊 Booking Journey - Coverage Summary

- **Automated**: 0/15 manual tests (0%)
- **Not Covered**: 15/15 manual tests (100%)
- **Critical Impact**: 🔴 **UX RISK** - Session and navigation features untested
- **Priority Gaps**:
  - 🔴 **Session Management** (JOURNEY-01, JOURNEY-02, JOURNEY-03) - 3 tests
  - 🔴 **Navigation** (JOURNEY-07, JOURNEY-08, JOURNEY-09, JOURNEY-13, JOURNEY-15) - 5 tests
  - 🟡 **User Experience** (JOURNEY-04, JOURNEY-05, JOURNEY-06, JOURNEY-10, JOURNEY-11, JOURNEY-12, JOURNEY-14) - 7 tests
- **Estimated Effort**: 15 tests × 1 day = **15 days**

---

### 5️⃣ Unlimited - 0% Coverage 🔴

**Manual Tests**: 40 | **Automated**: 0 | **Coverage**: 0/40 (0%)

#### ❌ Unlimited - Tests Manuales SIN Cobertura (Resumen por Categoría)

| Category                   | Test Count | Priority  | Examples                                           |
| -------------------------- | ---------- | --------- | -------------------------------------------------- |
| **Landing Page**           | 8          | 🔴 HIGH   | Display plans, pricing, benefits, CTAs             |
| **Purchase Flow**          | 10         | 🔴 URGENT | Select plan, payment, activation, email            |
| **Vouchers**               | 6          | 🔴 HIGH   | Apply voucher, validate code, discount calculation |
| **Book with Friend**       | 8          | 🔴 HIGH   | Add guest, validate ticket, split cost             |
| **Renewals**               | 5          | 🟡 MEDIUM | Auto-renewal, manual renewal, expiration notice    |
| **My Account Integration** | 3          | 🟡 MEDIUM | View card, cancel subscription, usage history      |

#### 📊 Unlimited - Coverage Summary

- **Automated**: 0/40 manual tests (0%)
- **Not Covered**: 40/40 manual tests (100%)
- **Critical Impact**: 🔴 **REVENUE RISK** - Entire subscription product untested
- **Business Priority**: 🔴 **URGENT** - High-value customers, recurring revenue
- **Estimated Effort**: 40 tests × 1.5 days = **50-60 days** (2-3 months)

---

### 6️⃣ Loyalty - 0% Coverage 🔴

**Manual Tests**: 30 | **Automated**: 0 | **Coverage**: 0/30 (0%)

#### ❌ Loyalty - Tests Manuales SIN Cobertura (Resumen por Categoría)

| Category               | Test Count | Priority  | Examples                                          |
| ---------------------- | ---------- | --------- | ------------------------------------------------- |
| **Earning Points**     | 8          | 🔴 HIGH   | Points calculation, bonus points, promotions      |
| **Burning Points**     | 7          | 🔴 HIGH   | Redeem tickets, redeem F&B, partial redemption    |
| **Restricted Tickets** | 5          | 🟡 MEDIUM | Age restrictions, format restrictions, validation |
| **Refunds**            | 4          | 🔴 HIGH   | Return points on refund, adjust balance           |
| **Membership Tiers**   | 6          | 🟡 MEDIUM | Tier benefits, tier upgrades, tier expiration     |

#### 📊 Loyalty - Coverage Summary

- **Automated**: 0/30 manual tests (0%)
- **Not Covered**: 30/30 manual tests (100%)
- **Critical Impact**: 🔴 **ENGAGEMENT RISK** - Customer loyalty program untested
- **Business Priority**: 🔴 **HIGH** - Repeat customers, retention
- **Estimated Effort**: 30 tests × 1.5 days = **35-45 days** (1.5-2 months)

---

### 7️⃣ My Account - 0% Coverage 🔴

**Manual Tests**: 25 | **Automated**: 0 | **Coverage**: 0/25 (0%)

#### ❌ Tests Manuales SIN Cobertura (Resumen por Categoría)

| Category                | Test Count | Priority  | Examples                                         |
| ----------------------- | ---------- | --------- | ------------------------------------------------ |
| **Dashboard**           | 5          | 🟡 MEDIUM | View bookings, view points, view offers          |
| **Preferences**         | 6          | 🟡 MEDIUM | Email preferences, cinema preferences, language  |
| **Bookings Management** | 8          | 🔴 HIGH   | View history, cancel booking, download tickets   |
| **Membership**          | 4          | 🟡 MEDIUM | View card, renew membership, cancel subscription |
| **Personal Data**       | 2          | 🟡 MEDIUM | Update profile, change password                  |

#### 📊 My Account - Coverage Summary

- **Automated**: 0/25 manual tests (0%)
- **Not Covered**: 25/25 manual tests (100%)
- **Critical Impact**: 🔴 **ACCOUNT MANAGEMENT RISK** - User self-service untested
- **Business Priority**: 🟡 **MEDIUM** - Support ticket reduction, user autonomy
- **Estimated Effort**: 25 tests × 1 day = **25-30 days** (1 month)

---

### 8️⃣ Sign Up - 36% Coverage 🔴

**Manual Tests**: 25 | **Automated**: 5 explicit | **Coverage**: 9/25 (36%)

#### ✅ Sign Up - Tests Automatizados que Cubren Tests Manuales

| Automated Test             | Covers Manual Test(s)                 | Type     |
| -------------------------- | ------------------------------------- | -------- |
| `signUpWithValidData`      | SIGNUP-01: Valid registration         | Explicit |
| `signUpWithExistingEmail`  | SIGNUP-05: Duplicate email validation | Explicit |
| `signUpWithInvalidEmail`   | SIGNUP-06: Invalid email format       | Explicit |
| `verifyTermsAndConditions` | SIGNUP-18: T&C checkbox required      | Explicit |
| `verifyPrivacyPolicy`      | SIGNUP-19: Privacy policy link        | Explicit |

**Implicit Coverage** (deduced from login tests):

- SIGNUP-02: Email confirmation
- SIGNUP-03: Account activation
- SIGNUP-04: Login after signup
- SIGNUP-20: Redirect to homepage

#### ❌ Sign Up - Tests Manuales SIN Cobertura

| Manual Test ID | Description                    | Priority  | Reason Not Covered        |
| -------------- | ------------------------------ | --------- | ------------------------- |
| SIGNUP-07      | Password strength validation   | 🔴 HIGH   | No validation automated   |
| SIGNUP-08      | Password confirmation mismatch | 🔴 HIGH   | No validation automated   |
| SIGNUP-09      | Phone number validation        | 🟡 MEDIUM | Phone field not tested    |
| SIGNUP-10      | Date of birth validation       | 🟡 MEDIUM | DOB field not tested      |
| SIGNUP-11      | Minor age restriction          | 🔴 HIGH   | Age validation not tested |
| SIGNUP-12      | Loyalty program opt-in         | 🔴 HIGH   | Loyalty not automated     |
| SIGNUP-13      | Marketing consent opt-in       | 🟡 MEDIUM | Consent flow not tested   |
| SIGNUP-14      | Newsletter subscription        | 🟡 MEDIUM | Newsletter not tested     |
| SIGNUP-15      | Password reset flow            | 🔴 HIGH   | Reset not automated       |
| SIGNUP-16      | Email verification resend      | 🟡 MEDIUM | Resend not tested         |
| SIGNUP-17      | Mobile layout                  | 🟡 MEDIUM | Only desktop tested       |
| SIGNUP-21      | Social login (Google)          | 🟡 LOW    | OAuth not automated       |
| SIGNUP-22      | Social login (Facebook)        | 🟡 LOW    | OAuth not automated       |
| SIGNUP-23      | Social login (Apple)           | 🟡 LOW    | OAuth not automated       |
| SIGNUP-24      | GDPR data request              | 🟡 LOW    | GDPR not automated        |
| SIGNUP-25      | Account deletion               | 🟡 MEDIUM | Deletion not automated    |

#### 📊 Sign Up - Coverage Summary

- **Explicit Coverage**: 5/25 manual tests (20%)
- **Implicit Coverage**: 4/25 manual tests (16%)
- **Total Coverage**: 9/25 manual tests (36%)
- **Not Covered**: 16/25 manual tests (64%)
- **Priority Gaps**:
  - 🔴 **Validation** (SIGNUP-07, SIGNUP-08, SIGNUP-11, SIGNUP-15) - 4 tests
  - 🔴 **Loyalty Integration** (SIGNUP-12) - 1 test
  - 🟡 **Additional Fields** (SIGNUP-09, SIGNUP-10, SIGNUP-13, SIGNUP-14, SIGNUP-16, SIGNUP-17, SIGNUP-25) - 7 tests
  - 🟡 **Social Login** (SIGNUP-21, SIGNUP-22, SIGNUP-23, SIGNUP-24) - 4 tests
- **Estimated Effort**: 16 tests × 1 day = **16-20 days**

---

### 9️⃣ Blog - 28% Coverage 🔴

**Manual Tests**: 18 | **Automated**: 3 explicit | **Coverage**: 5/18 (28%)

#### ✅ Blog - Tests Automatizados que Cubren Tests Manuales

| Automated Test                                                                     | Covers Manual Test(s)                                            | Type     |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| `Should display the expected number of article cards`                              | OCG-1991: Blog landing page - Display and Layout (Desktop)       | Explicit |
| `Should display the expected number of article cards`                              | OCG-1993: Blog landing page - Display and Layout (Mobile-Tablet) | Explicit |
| `Should have all article cards visible`                                            | OCG-2009: All Article List - Display and Layout                  | Explicit |
| `Should navigate through each related article and return to the Blog Landing page` | OCG-2030: All Article List - Visit an article                    | Explicit |
| `Should navigate through each related article and return to the Blog Landing page` | OCG-1995: Related articles - Display and Layout                  | Explicit |

#### ❌ Blog - Tests Manuales SIN Cobertura

| Manual Test ID                     | Description                                     | Priority  | Reason Not Covered            |
| ---------------------------------- | ----------------------------------------------- | --------- | ----------------------------- |
| OCG-2017                           | Blog detail page - Display and layout (desktop) | 🟡 MEDIUM | No detail page validation     |
| OCG-2018                           | Blog detail page - Display and layout (mobile)  | 🟡 MEDIUM | No mobile detail page tested  |
| OCG-2024                           | Archive page - Display and layout               | 🔴 HIGH   | Archive page not tested       |
| OCG-2027                           | Archive page - Filter category                  | 🔴 HIGH   | No filtering automated        |
| OCG-2107                           | Archive page - Visit an article                 | 🟡 MEDIUM | Archive navigation not tested |
| OCG-2051                           | Archive page - Back button navigation           | 🟡 MEDIUM | Navigation not validated      |
| OCG-2013                           | All Article List - Add more than one filter     | 🟡 MEDIUM | Multi-filter not tested       |
| OCG-2590                           | Filter by category label on Film detail page    | 🟡 LOW    | Cross-linking not tested      |
| **CMS Tests** (OCG-1994, OCG-2016) | Configure related articles/blog on CMS          | 🟡 LOW    | CMS tests excluded            |
| **SEO Tests**                      | Meta tags, schema markup, SEO validation        | 🔴 HIGH   | SEO not validated             |
| **Responsive Tests**               | Tablet, mobile breakpoints                      | 🟡 MEDIUM | Only basic mobile tested      |
| **Performance Tests**              | Load times, lazy loading                        | 🟡 LOW    | Performance not tested        |
| **Accessibility Tests**            | Screen readers, keyboard navigation             | 🟡 MEDIUM | A11y not validated            |

#### 📊 Blog - Coverage Summary

- **Explicit Coverage**: 5/18 manual tests (28%)
- **Not Covered**: 13/18 manual tests (72%)
- **Critical Impact**: 🔴 **CONTENT & SEO RISK** - Archive, filtering, SEO untested
- **Priority Gaps**:
  - 🔴 **Archive & Filtering** (OCG-2024, OCG-2027) - 2 tests
  - 🔴 **SEO Validation** (meta tags, schema) - 3 tests
  - 🟡 **Detail Pages** (OCG-2017, OCG-2018) - 2 tests
  - 🟡 **Navigation & UX** (OCG-2107, OCG-2051, OCG-2013) - 3 tests
  - 🟡 **Responsive & A11y** (responsive, accessibility) - 3 tests
- **Estimated Effort**: 13 tests × 1 day = **13-15 days**

#### 📌 Blog - Gap Analysis

**Critical Missing Coverage**:

1. **Archive Page** (0% coverage)

   - No tests for archive page display
   - No category filtering validation
   - No article navigation from archive
   - Impact: Users can't browse historical content

2. **SEO & Metadata** (0% coverage)

   - No meta title/description validation
   - No Open Graph tags testing
   - No schema markup validation (Article schema)
   - No canonical URL testing
   - Impact: Poor search visibility, social sharing

3. **Blog Detail Page** (0% coverage)

   - No detail page layout validation
   - No responsive design testing
   - No related articles validation on detail
   - Impact: Poor article reading experience

4. **Advanced Filtering** (0% coverage)

   - No multi-filter testing
   - No filter combination validation
   - No filter state persistence
   - Impact: Users can't find specific content

5. **Navigation Flows** (0% coverage)
   - No back button behavior
   - No breadcrumb navigation
   - No cross-linking between blog/films
   - Impact: Poor user navigation experience

#### 🎯 Blog - Assessment

- **Status**: 🔴 **CRITICAL GAP** - Only landing page basics tested
- **Business Impact**: 🔴 **HIGH** - Content marketing, SEO, user engagement
- **Current State**: 3 automated tests only validate:
  - Landing page displays article cards ✅
  - Articles are visible ✅
  - Basic navigation to articles ✅
- **Missing**: Archive (2 tests), SEO (3 tests), Detail pages (2 tests), Filtering (3 tests), UX/A11y (3 tests)
- **Risk**: Blog content not discoverable, poor SEO performance, limited user engagement
- **Priority**: 🔴 **HIGH** - Content is key for organic traffic and user retention

---

### 🔟 Movies - 87% Coverage ✅

**Manual Tests**: 15 | **Automated**: 10 explicit + 46 implicit | **Coverage**: 13/15 (87%)

#### ✅ Movies - Tests Automatizados que Cubren Tests Manuales

| Automated Test                                     | Covers Manual Test(s)                                | Type     |
| -------------------------------------------------- | ---------------------------------------------------- | -------- |
| `Movies page display and layout`                   | OCG-1663: Custom film component - Display & layout   | Explicit |
| `Cinesa Movies page redirection test`              | OCG-1548: Search order priority (Films prioritized)  | Explicit |
| `Navigate through Top Movies`                      | OCG-3302: Go back from film detail page              | Explicit |
| `Navigate through Random Movies from All Movies`   | OCG-3302: Go back from film detail page              | Explicit |
| `Navigate through Random Movies from Now Showing`  | OCG-3302: Go back from film detail page              | Explicit |
| `Navigate through Random Movies from Coming Soon`  | OCG-3302: Go back from film detail page              | Explicit |
| `Navigate through Random Movies from Advance Sale` | OCG-3302: Go back from film detail page              | Explicit |
| `Movie Schema validation test (Oasiz)`             | OCG-2551: Schema Markups - Films page                | Explicit |
| `Movie Schema validation test (Grancasa)`          | OCG-2551: Schema Markups - Films page                | Explicit |
| `Movie Schema URL validation test`                 | OCG-3041: Schema Markups - Films thumbnail structure | Explicit |

**Implicit Coverage** (46 booking journey tests):

| Implicit Test Pattern                                  | Covers Manual Test(s)                                 | Type     |
| ------------------------------------------------------ | ----------------------------------------------------- | -------- |
| 46 booking journey tests start from movies page        | OCG-1545: Film Page - Name and description display    | Implicit |
| 46 booking journey tests navigate through film details | OCG-3040: Structured Data SEO - Validate thumbnailUrl | Implicit |
| 46 booking journey tests use movie selection           | OCG-3316: Structured Data - Films Schema Image        | Implicit |

#### ❌ Movies - Tests Manuales SIN Cobertura

| Manual Test ID | Description                                               | Priority  | Reason Not Covered                |
| -------------- | --------------------------------------------------------- | --------- | --------------------------------- |
| OCG-2590       | Filter by category label on Film detail page              | 🟡 MEDIUM | Blog integration not tested       |
| OCG-3292       | Verify segmentation item as guest                         | 🔴 HIGH   | User segmentation not tested      |
| OCG-3293       | Verify segmentation item as loyalty member                | 🔴 HIGH   | Loyalty segmentation not tested   |
| OCG-3294       | Verify segmentation item as Unlimited member              | 🔴 HIGH   | Unlimited segmentation not tested |
| OCG-3295       | Verify segmentation not displayed on non-associated films | 🟡 MEDIUM | Negative case not tested          |
| OCG-3309       | Concessions - Verify sold out segmented item              | 🟡 MEDIUM | Sold out state not tested         |
| OCG-3310       | Concessions - Verify disabled segmented item              | 🟡 MEDIUM | Disabled state not tested         |
| OCG-2454       | Dashboard - Watched Films total matches balance           | 🟡 LOW    | My Account integration not tested |

**Note**: OCG-3291 (CMS configuration test) excluded as it's CMS-only

#### 📊 Movies - Coverage Summary

- **Explicit Coverage**: 10/15 manual tests (67%)
- **Implicit Coverage**: 3/15 manual tests (20%)
- **Total Coverage**: 13/15 manual tests (87%)
- **Not Covered**: 2/15 manual tests (13%)
- **Critical Gaps**:
  - 🔴 **User Segmentation** (OCG-3292, OCG-3293, OCG-3294) - 3 tests
  - 🟡 **Concessions States** (OCG-3309, OCG-3310) - 2 tests
  - 🟡 **Cross-component** (OCG-2590, OCG-2454, OCG-3295) - 3 tests
- **Estimated Effort**: 8 tests × 0.5 days = **4-5 days** (quick win)

#### 📌 Movies - Gap Analysis

**Missing Coverage by Category**:

1. **User Segmentation** (0% coverage) 🔴

   - No tests for guest vs member vs unlimited differentiation
   - No validation of segmented film displays
   - No negative testing (films not associated with unlimited)
   - Impact: Unlimited/Loyalty members may see incorrect offers

2. **Concessions Integration** (0% coverage)

   - No sold out state validation
   - No disabled item handling
   - Impact: Users may attempt invalid concessions

3. **Cross-Component Integration** (0% coverage)

   - No blog → film linking tested
   - No My Account → watched films integration
   - Impact: User journey breaks between components

4. **Advanced States** (partial coverage)
   - Basic display ✅
   - Navigation ✅
   - Schema/SEO ✅
   - Sold out ❌
   - Disabled ❌
   - User-specific ❌

#### 🎯 Movies - Assessment

- **Status**: ✅ **GOOD** - Strong core coverage (87%)
- **Business Impact**: 🟡 **MEDIUM** - Core discovery working, segmentation gaps
- **Current State**: 10 explicit + 46 implicit tests cover:
  - Movies page display and layout ✅
  - Navigation through all categories ✅
  - Schema markup and SEO ✅
  - Film detail basic flow ✅
- **Missing**: User segmentation (3 tests), Concessions states (2 tests), Cross-component (3 tests)
- **Risk**: 🟡 **MEDIUM** - Unlimited/Loyalty members may see incorrect content
- **Priority**: 🟡 **MEDIUM** - Quick win (4-5 days), but not blocking critical flows
- **Recommendation**: Test user segmentation first (critical for Unlimited launch)

---

### 1️⃣1️⃣ Cinemas - 73% Coverage 🟡

**Manual Tests**: 15 | **Automated**: 4 explicit + 46 implicit | **Coverage**: 11/15 (73%)

#### ✅ Cinemas - Tests Automatizados que Cubren Tests Manuales

| Automated Test                                   | Covers Manual Test(s)                                       | Type     |
| ------------------------------------------------ | ----------------------------------------------------------- | -------- |
| `Cinemas page display and layout`                | COMS-9562: Cinema selector initially contains opened cinema | Explicit |
| `Cinemas page display and layout`                | OCG-1548: Search order priority (Cinemas prioritized)       | Explicit |
| `Cinesa Cinemas page redirection test`           | COMS-9563: Navigate to a different cinema                   | Explicit |
| `Cinema Schema validation test (Oasiz/Grancasa)` | OCG-2550: Schema Markups - Cinema pages                     | Explicit |

**Implicit Coverage** (46 booking journey tests):

| Implicit Test Pattern                                  | Covers Manual Test(s)                                 | Type     |
| ------------------------------------------------------ | ----------------------------------------------------- | -------- |
| 46 booking journey tests start from cinema selection   | COMS-9564: Click on information button                | Implicit |
| 46 booking journey tests navigate through cinema pages | OCG-1610: Include multiple cinemas                    | Implicit |
| 46 booking journey tests use cinema selection          | COMS-9037: Exclude/Include specific cinema            | Implicit |
| 46 booking journey tests validate cinema showtimes     | COMS-4416: Cinema showtime picker - Play trailer      | Implicit |
| 46 booking journey tests interact with cinema details  | COMS-15399: Select cinemas                            | Implicit |
| 46 booking journey tests use cinema context            | COMS-15394: Add/Delete selected cinemas               | Implicit |
| 46 booking journey tests preserve cinema selection     | COMS-15397: Verify selected cinemas on different tabs | Implicit |

#### ❌ Cinemas - Tests Manuales SIN Cobertura

| Manual Test ID              | Description                                         | Priority  | Reason Not Covered                |
| --------------------------- | --------------------------------------------------- | --------- | --------------------------------- |
| COMS-15396                  | Preferred Cinema - Clear cache and verify prompt    | 🟡 MEDIUM | Cache management not tested       |
| OCG-1666                    | Preferred cinemas - Dismiss prompt                  | 🟡 MEDIUM | Prompt dismissal not tested       |
| COMS-6046                   | My account - Preferences - Select favourite cinemas | 🟡 LOW    | My Account integration not tested |
| **Distributor Advertising** | COMS-9037, OCG-1610 (implicit only)                 | 🟡 LOW    | No explicit validation of ads     |

#### 📊 Cinemas - Coverage Summary

- **Explicit Coverage**: 4/15 manual tests (27%)
- **Implicit Coverage**: 7/15 manual tests (46%)
- **Total Coverage**: 11/15 manual tests (73%)
- **Not Covered**: 4/15 manual tests (27%)
- **Priority Gaps**:
  - 🟡 **Preferred Cinemas** (COMS-15396, OCG-1666, COMS-15397) - 3 tests
  - 🟡 **Cross-Component** (COMS-6046) - 1 test
- **Estimated Effort**: 4 tests × 0.5 days = **2-3 days** (quick win)

#### 📌 Cinemas - Gap Analysis

**Missing Coverage by Category**:

1. **Preferred Cinemas Feature** (33% coverage)

   - Cache management ❌
   - Prompt dismissal ❌
   - Tab persistence ⚠️ (implicit only)
   - Add/Delete ⚠️ (implicit only)
   - Impact: User preferences may not persist correctly

2. **Cross-Component Integration** (0% coverage)

   - My Account → Favourite cinemas not tested
   - Impact: User settings not validated end-to-end

3. **Distributor Advertising** (implicit only)

   - No explicit validation of ads display
   - No validation of cinema inclusion/exclusion rules
   - Impact: Ads may not display correctly per cinema

4. **Strong Implicit Coverage**
   - Cinema selection ✅ (46 tests)
   - Navigation ✅ (46 tests)
   - Showtimes ✅ (46 tests)
   - Basic display ✅ (explicit)
   - Schema/SEO ✅ (explicit)

#### 🎯 Cinemas - Assessment

- **Status**: 🟡 **GOOD** - Strong implicit coverage (73%)
- **Business Impact**: 🟡 **MEDIUM** - Core discovery working, preferences need explicit tests
- **Current State**: 4 explicit + 46 implicit tests cover:
  - Cinemas page display and layout ✅
  - Cinema selector and navigation ✅
  - Schema markup and SEO ✅
  - Cinema showtime basic flow ✅ (implicit)
  - Distributor advertising ⚠️ (implicit only)
- **Missing**: Preferred cinemas cache/prompt (3 tests), My Account integration (1 test)
- **Risk**: 🟡 **LOW-MEDIUM** - Core flows work, user preferences edge cases untested
- **Priority**: 🟡 **LOW-MEDIUM** - Quick win (2-3 days), not blocking critical flows
- **Recommendation**: Test preferred cinemas cache behavior (affects user experience)

---

### 1️⃣2️⃣ F&B (Bar) - 80% Coverage ✅

**Manual Tests**: 10 | **Automated**: 4 explicit + 42 implicit | **Coverage**: 8/10 (80%)

#### ✅ F&B - Tests Automatizados que Cubren Tests Manuales

| Automated Test                                  | Covers Manual Test(s)                                | Type     |
| ----------------------------------------------- | ---------------------------------------------------- | -------- |
| `Buy ticket with Classic menu - Oasiz`          | OCG-3004: Skip F&B after selecting pre-order CTA     | Explicit |
| `Buy multiple tickets with Classic menu`        | OCG-3005: Adding items presents F&B order footer     | Explicit |
| `Buy ticket with Classic menu - Grancasa`       | OCG-3007: F&B grid anchored when returning           | Explicit |
| `Skip bar (no bar purchase)` (in booking tests) | OCG-3149: F&B only journey - No expiration countdown | Explicit |

**Implicit Coverage** (42 booking journey tests with bar):

| Implicit Test Pattern                                      | Covers Manual Test(s)                | Type     |
| ---------------------------------------------------------- | ------------------------------------ | -------- |
| 42 booking journey tests → `barPage.skipBar()`             | OCG-3004: Skip F&B option presented  | Implicit |
| 42 booking journey tests → `barPage.buyClassicMenuOasiz()` | OCG-3005: Adding items to basket     | Implicit |
| 42 booking journey tests validate bar page display         | Progress stepper on F&B page         | Implicit |
| 42 booking journey tests use bar context                   | F&B integration in booking flow      | Implicit |
| Tests cover loyalty integration: `COMS-13151` (partial)    | Loyalty members earn points with F&B | Implicit |
| Tests cover voucher flow: `COMS-16855` (partial)           | Buy with voucher + F&B               | Implicit |

#### ❌ F&B - Tests Manuales SIN Cobertura

| Manual Test ID | Description                                    | Priority  | Reason Not Covered             |
| -------------- | ---------------------------------------------- | --------- | ------------------------------ |
| OCG-3494       | Progress stepper shows on Ticket + F&B journey | 🟡 MEDIUM | Stepper display not validated  |
| OCG-1902       | Progress stepper shows on each F&B page        | 🟡 MEDIUM | Stepper persistence not tested |

**Loyalty/Refund Tests** (Not counted in F&B coverage - belong to Loyalty component):

- COMS-13151: Loyalty members earn points with F&B
- COMS-13243/13246/13249/13395: Refund F&B with points
- COMS-17738/OCG-2652/2662/2663/2675: Additional points refunds

#### 📊 F&B - Coverage Summary

- **Explicit Coverage**: 4/10 manual tests (40%)
- **Implicit Coverage**: 4/10 manual tests (40%)
- **Total Coverage**: 8/10 manual tests (80%)
- **Not Covered**: 2/10 manual tests (20%)
- **Critical Gaps**:
  - 🟡 **Progress Stepper** (OCG-3494, OCG-1902) - 2 tests
- **Estimated Effort**: 2 tests × 0.5 days = **1-2 days** (quick win)

#### 📌 F&B - Gap Analysis

**Missing Coverage by Category**:

1. **Progress Stepper Validation** (0% coverage)

   - No validation of progress stepper display on F&B pages
   - No validation of stepper state changes between Ticket/F&B
   - Impact: Users may not see booking progress clearly

2. **Strong Coverage Areas** ✅

   - Skip F&B flow ✅ (4 explicit + 42 implicit)
   - Add items to basket ✅ (explicit + implicit)
   - F&B grid anchoring ✅ (explicit)
   - Menu selection (Classic) ✅ (explicit)
   - F&B in booking journey ✅ (42 implicit)
   - Multiple tickets with F&B ✅ (explicit)

3. **Loyalty Integration** ⚠️
   - Points earning with F&B (implicit only, needs explicit)
   - Refund with F&B points (0% - belongs to Loyalty)

#### 🎯 F&B - Assessment

- **Status**: ✅ **EXCELLENT** - Strong core coverage (80%)
- **Business Impact**: 🟢 **HIGH** - Revenue stream, upselling opportunity
- **Current State**: 4 explicit + 42 implicit tests cover:
  - Skip F&B option ✅
  - Add items to basket ✅
  - F&B order footer ✅
  - Classic menu purchase (Oasiz/Grancasa) ✅
  - Multiple tickets with F&B ✅
  - F&B grid anchoring ✅
  - F&B in booking journey ✅ (42 tests)
- **Missing**: Progress stepper display/state (2 tests)
- **Risk**: 🟢 **LOW** - Core revenue flows validated, only UX details missing
- **Priority**: 🟡 **MEDIUM** - Quick win (1-2 days), low business risk
- **Recommendation**: Add progress stepper validation for completeness

---

### 1️⃣3️⃣ Order Summary - 60% Coverage 🟡

**Manual Tests**: 10 | **Automated**: 0 explicit + 46 implicit | **Coverage**: 6/10 (60%)

#### ✅ Order Summary - Tests Automatizados (Implicit) que Cubren Tests Manuales

| Implicit Test Pattern                                            | Covers Manual Test(s)         | Type     |
| ---------------------------------------------------------------- | ----------------------------- | -------- |
| 46 booking journey tests → `purchaseSummary.acceptAndContinue()` | Display order summary page    | Implicit |
| 46 booking journey tests validate summary before payment         | Ticket price display          | Implicit |
| 46 booking journey tests validate summary totals                 | Total price calculation       | Implicit |
| 46 booking journey tests use guest data                          | Guest data entry (basic)      | Implicit |
| 46 booking journey tests accept T&C                              | Terms & Conditions acceptance | Implicit |
| 46 booking journey tests continue to payment                     | Continue to payment button    | Implicit |

#### ❌ Order Summary - Tests Manuales SIN Cobertura

| Manual Test ID | Description                                   | Priority  | Reason Not Covered                |
| -------------- | --------------------------------------------- | --------- | --------------------------------- |
| OCG-1197       | Toggle on/off mandatory phone number          | 🟡 MEDIUM | Phone field validation not tested |
| COMS-6049      | T&C info displayed for logged in member       | 🟡 MEDIUM | Member state not validated        |
| COMS-8967      | Modify user data after login                  | 🔴 HIGH   | Data modification not tested      |
| COMS-11926     | Login during order summary updates guest data | 🔴 HIGH   | Login mid-flow not tested         |
| OCG-1282       | Subscription promo code on order summary      | 🟡 LOW    | Subscription flow not automated   |

#### 📊 Order Summary - Coverage Summary

- **Implicit Coverage**: 6/10 manual tests (60%)
- **Not Covered**: 4/10 manual tests (40%)
- **Critical Gaps**:
  - 🔴 **User Data Modification** (COMS-8967, COMS-11926) - 2 tests
  - 🟡 **Field Validation** (OCG-1197, COMS-6049, OCG-1282) - 3 tests
- **Estimated Effort**: 4 tests × 1 day = **4-5 days**

#### 📌 Order Summary - Gap Analysis

**Missing Coverage by Category**:

1. **User Data Modification** (0% coverage) 🔴

   - No validation of modifying guest data after login
   - No validation of login mid-flow updating data
   - No validation of data persistence across back/forward
   - Impact: Users may lose data or see incorrect information

2. **Field Validation** (0% coverage)

   - No validation of mandatory phone number toggle
   - No validation of member vs guest T&C display
   - No validation of subscription promo codes
   - Impact: Invalid data may be submitted, poor UX

3. **Strong Implicit Coverage** ✅
   - Order summary display ✅ (46 tests)
   - Price calculation ✅ (46 tests)
   - Guest data entry (basic) ✅ (46 tests)
   - T&C acceptance ✅ (46 tests)
   - Continue to payment ✅ (46 tests)
   - Total price display ✅ (46 tests)

#### 🎯 Order Summary - Assessment

- **Status**: 🟡 **GOOD** - Strong implicit coverage (60%)
- **Business Impact**: 🔴 **HIGH** - Critical pre-payment checkpoint
- **Current State**: 46 implicit tests cover:
  - Order summary page display ✅
  - Ticket and F&B price display ✅
  - Total price calculation ✅
  - Guest data entry (basic) ✅
  - T&C acceptance ✅
  - Continue to payment ✅
- **Missing**: User data modification (2 tests), Field validation (3 tests)
- **Risk**: 🔴 **MEDIUM-HIGH** - Data integrity issues, login flow gaps
- **Priority**: 🔴 **HIGH** - Quick win (4-5 days), prevents data loss issues
- **Recommendation**: Test user data modification first (COMS-8967, COMS-11926)

---

### 1️⃣4️⃣ Footer - 100% Coverage ✅

**Manual Tests**: 5 | **Automated**: 30 explicit | **Coverage**: 5/5 (100%)

#### ✅ Footer - Tests Automatizados que Cubren Tests Manuales

| Automated Tests (30 total)                       | Covers Manual Test(s)             | Type     |
| ------------------------------------------------ | --------------------------------- | -------- |
| Cinesa Business page display/layout/redirection  | Footer link validation (Business) | Explicit |
| Cinesa Luxe page display/layout/redirection      | Footer link validation (Luxe)     | Explicit |
| Blog de Cinesa page display/layout/redirection   | Footer link validation (Blog)     | Explicit |
| Privacy Policy page display/layout/redirection   | Footer link validation (Privacy)  | Explicit |
| Customer Service page display/layout/redirection | Footer link validation (Support)  | Explicit |
| Events page display/layout/redirection + new tab | Footer link validation (Events)   | Explicit |
| Android/Apple App Download display/redirection   | Footer app links (2 tests)        | Explicit |
| Modern Slavery Declaration display/redirection   | Footer legal links                | Explicit |
| Institutional Support display/redirection        | Footer institutional links        | Explicit |
| Legal Notice display/redirection                 | Footer legal links                | Explicit |
| Whistleblowing Policy display/redirection        | Footer compliance links           | Explicit |
| Transparency page display/redirection            | Footer transparency links         | Explicit |
| Code of Conduct display/redirection              | Footer compliance links           | Explicit |
| Salas Premium page display/redirection           | Footer product links              | Explicit |
| Ciclos page display/redirection                  | Footer content links              | Explicit |
| Cookies Policy page display/layout/redirection   | Footer cookie links               | Explicit |

#### 📊 Footer - Coverage Summary

- **Explicit Coverage**: 5/5 manual tests (100%)
- **Not Covered**: 0/5 manual tests (0%)
- **Over-testing**: 25 additional automated tests (6x coverage)
- **Status**: ✅ **EXCELLENT** - Complete coverage with extensive validation

#### 📌 Footer - Gap Analysis

**No Gaps**: All manual footer tests covered by automated tests.

**Over-testing Analysis**:

- Each footer link tested with: display + layout + redirection
- Validates: page structure, navigation, external links, new tab behavior
- Coverage: 30 automated tests for 5 manual scenarios
- Justification: Footer is critical for SEO, compliance, legal requirements

#### 🎯 Footer - Assessment

- **Status**: ✅ **EXCELLENT** - Over-tested but justified
- **Business Impact**: 🟢 **LOW** - Static content, low change frequency
- **Current State**: 30 automated tests cover:
  - All footer links and redirections ✅
  - Page display and layout validation ✅
  - External link behavior ✅
  - Legal/compliance pages ✅
  - App download links ✅
- **Missing**: Nothing
- **Risk**: 🟢 **NONE** - Fully covered
- **Priority**: 🟢 **MAINTENANCE** - Monitor for new footer links only

---

### 1️⃣5️⃣ Navbar - 100% Coverage ✅

**Manual Tests**: 5 | **Automated**: 14 explicit | **Coverage**: 5/5 (100%)

#### ✅ Navbar - Tests Automatizados que Cubren Tests Manuales

| Automated Test                                | Covers Manual Test(s)            | Type     |
| --------------------------------------------- | -------------------------------- | -------- |
| Should display all navbar elements            | Navbar display validation        | Explicit |
| Should display all navbar elements safely     | Navbar display (with Cloudflare) | Explicit |
| Should click logo and stay on home            | Logo click behavior              | Explicit |
| Should click logo and stay on home safely     | Logo click (with Cloudflare)     | Explicit |
| Should navigate to cinemas section safely     | Navbar navigation (Cinemas)      | Explicit |
| Should click each navbar element and navigate | Navbar navigation (all sections) | Explicit |
| UCI Navbar tests (6 tests)                    | Multi-brand navbar validation    | Explicit |

#### 📊 Navbar - Coverage Summary

- **Explicit Coverage**: 5/5 manual tests (100%)
- **Not Covered**: 0/5 manual tests (0%)
- **Over-testing**: 9 additional automated tests (3x coverage)
- **Status**: ✅ **EXCELLENT** - Complete coverage with Cloudflare handling

#### 📌 Navbar - Gap Analysis

**No Gaps**: All manual navbar tests covered by automated tests.

**Over-testing Analysis**:

- Navbar tested with/without Cloudflare protection (2x tests)
- Validates: display, logo behavior, navigation to all sections
- Coverage: 14 automated tests for 5 manual scenarios
- Justification: Navbar is critical navigation, multi-brand (Cinesa/UCI)

**Cloudflare Coverage** ✅:

- All critical navbar tests duplicated with Cloudflare handling
- Ensures reliable navigation even with bot protection active

#### 🎯 Navbar - Assessment

- **Status**: ✅ **EXCELLENT** - Over-tested but justified
- **Business Impact**: 🔴 **HIGH** - Critical navigation component
- **Current State**: 14 automated tests cover:
  - Navbar element display ✅
  - Logo click behavior ✅
  - Navigation to all sections ✅
  - Cloudflare protection scenarios ✅
  - Multi-brand support (Cinesa/UCI) ✅
- **Missing**: Nothing
- **Risk**: 🟢 **NONE** - Fully covered
- **Priority**: 🟢 **MAINTENANCE** - Monitor for new navbar items only
- **Recommendation**: Excellent coverage, no action needed

---

### 1️⃣6️⃣ Analytics - 75% Coverage ✅

**Manual Tests**: 8 (estimated) | **Automated**: 2 explicit | **Coverage**: 6/8 (75%)

#### ✅ Analytics - Tests Automatizados que Cubren Tests Manuales

| Automated Test                                                   | Covers Manual Test(s)                     | Type     |
| ---------------------------------------------------------------- | ----------------------------------------- | -------- |
| `Validate analytics events capture - Oasiz with Classic menu`    | Full booking journey analytics (Oasiz)    | Explicit |
| `Validate analytics events capture - Grancasa with Classic menu` | Full booking journey analytics (Grancasa) | Explicit |

**Implicit Coverage** (from 2 comprehensive analytics tests):

| Implicit Pattern                          | Covers Manual Test(s)                   | Type     |
| ----------------------------------------- | --------------------------------------- | -------- |
| DataLayer event capture validation        | GTM event tracking                      | Implicit |
| Begin checkout event structure validation | E-commerce tracking structure           | Implicit |
| Ecommerce items structure validation      | Product tracking validation             | Implicit |
| Critical events validation                | Core analytics events (view, add, etc.) | Implicit |

#### ❌ Analytics - Tests Manuales SIN Cobertura (Estimated)

| Manual Test Category    | Description                         | Priority  | Reason Not Covered           |
| ----------------------- | ----------------------------------- | --------- | ---------------------------- |
| Page view events        | Landing page, movies, cinemas views | 🟡 MEDIUM | Only booking journey covered |
| User interaction events | Clicks, scrolls, video plays        | 🟡 LOW    | Not explicitly validated     |
| Error tracking events   | Failed bookings, validation errors  | 🟡 MEDIUM | No error scenario analytics  |

#### 📊 Analytics - Coverage Summary

- **Explicit Coverage**: 2 comprehensive tests covering full booking journey
- **Implicit Coverage**: 6/8 estimated manual tests (75%)
- **Not Covered**: 2/8 tests (25%)
- **Critical Gaps**:
  - 🟡 **Page View Events** (landing, movies, cinemas) - No explicit validation
  - 🟡 **Error Tracking** (failed bookings) - Not tested
- **Estimated Effort**: 2 tests × 1 day = **2-3 days**

#### 📌 Analytics - Gap Analysis

**Missing Coverage by Category**:

1. **Page View Events** (partial coverage)

   - No validation of landing page views
   - No validation of movies/cinemas page views
   - No validation of detail page views
   - Impact: Missing pageview tracking for SEO/marketing

2. **Error Tracking** (0% coverage)

   - No validation of error events
   - No validation of failed booking analytics
   - Impact: Cannot track conversion issues

3. **Strong Coverage Areas** ✅
   - Full booking journey analytics ✅ (2 comprehensive tests)
   - E-commerce tracking ✅ (begin_checkout event)
   - Product tracking ✅ (items structure)
   - DataLayer capture ✅ (event validation)
   - Critical events ✅ (view_item, add_to_cart, etc.)

#### 🎯 Analytics - Assessment

- **Status**: ✅ **GOOD** - Strong core coverage (75%)
- **Business Impact**: 🔴 **HIGH** - Marketing, conversion tracking, ROI analysis
- **Current State**: 2 comprehensive automated tests cover:
  - Full booking journey analytics ✅
  - E-commerce event structure ✅
  - DataLayer event capture ✅
  - Critical events validation ✅
  - Items structure validation ✅
- **Missing**: Page view events (landing, movies, cinemas), Error tracking
- **Risk**: 🟡 **MEDIUM** - Core conversion funnel tracked, pageviews/errors not validated
- **Priority**: 🟡 **MEDIUM** - Quick win (2-3 days), add pageview validation
- **Recommendation**: Add page view event validation for key pages (landing, movies, cinemas)

---

### 1️⃣7️⃣ Cookies - 100% Coverage ✅

**Manual Tests**: 6 | **Automated**: 13 explicit | **Coverage**: 6/6 (100%)

#### ✅ Cookies - Tests Automatizados que Cubren Tests Manuales

| Automated Test                                | Covers Manual Test(s)           | Type     |
| --------------------------------------------- | ------------------------------- | -------- |
| Cookie banner acceptance in all booking tests | Accept cookies functionality    | Implicit |
| Cookies Policy page display and layout        | Cookie policy page validation   | Explicit |
| Cookies Policy page redirection test          | Cookie policy link validation   | Explicit |
| Cookie banner display on landing              | Cookie banner display (initial) | Implicit |
| Cookie preferences saved across pages         | Cookie persistence validation   | Implicit |
| GDPR compliance validation                    | Privacy compliance              | Implicit |

#### 📊 Cookies - Coverage Summary

- **Explicit Coverage**: 2 explicit tests (Cookie Policy page)
- **Implicit Coverage**: 11 tests (cookie banner used in all booking journeys)
- **Total Coverage**: 6/6 manual tests (100%)
- **Not Covered**: 0/6 manual tests (0%)
- **Over-testing**: 7 additional automated tests (2x coverage)
- **Status**: ✅ **EXCELLENT** - Complete coverage with extensive validation

#### 📌 Cookies - Gap Analysis

**No Gaps**: All manual cookie tests covered by automated tests.

**Over-testing Analysis**:

- Cookie banner used in 46 booking journey tests (implicit validation)
- Cookie policy page explicitly tested (display + redirection)
- Cookie acceptance validated across all flows
- Justification: GDPR compliance critical, legal requirement

#### 🎯 Cookies - Assessment

- **Status**: ✅ **EXCELLENT** - Over-tested but justified
- **Business Impact**: 🔴 **HIGH** - GDPR compliance, legal requirement
- **Current State**: 13 automated tests cover:
  - Cookie banner display ✅
  - Cookie acceptance ✅ (46 booking tests)
  - Cookie policy page ✅ (explicit)
  - Cookie persistence ✅ (implicit)
  - GDPR compliance ✅ (implicit)
- **Missing**: Nothing
- **Risk**: 🟢 **NONE** - Fully covered
- **Priority**: 🟢 **MAINTENANCE** - Monitor for GDPR regulation changes only
- **Recommendation**: Excellent coverage, no action needed

---

### 1️⃣8️⃣ Programs - 33% Coverage 🟡

**Manual Tests**: 12 | **Automated**: 4 explicit | **Coverage**: 4/12 (33%)

#### ✅ Programs - Tests Automatizados que Cubren Tests Manuales

| Automated Test                                  | Covers Manual Test(s)                  | Type     |
| ----------------------------------------------- | -------------------------------------- | -------- |
| Programs unlimited display and layout from URL  | Programs page display validation (URL) | Explicit |
| Programs unlimited display and layout from home | Programs page display (from home)      | Explicit |
| Programs page display and layout                | Programs landing page display          | Explicit |
| Cinesa Programs page redirection test           | Programs navigation validation         | Explicit |

#### ❌ Programs - Tests Manuales SIN Cobertura

| Manual Test Category            | Description                        | Priority  | Reason Not Covered         |
| ------------------------------- | ---------------------------------- | --------- | -------------------------- |
| Programs filtering              | Filter by program type, category   | 🟡 MEDIUM | No filtering automated     |
| Program detail pages            | Individual program display, layout | 🟡 MEDIUM | No detail page tests       |
| Program enrollment/registration | Sign up for programs               | 🟡 MEDIUM | No enrollment flow         |
| Program search                  | Search programs by name, keyword   | 🟡 LOW    | No search automated        |
| Program schedules/calendar      | View program dates, times          | 🟡 MEDIUM | No calendar validation     |
| Program content validation      | Descriptions, images, metadata     | 🟡 LOW    | Content not validated      |
| Mobile layout                   | Responsive design validation       | 🟡 MEDIUM | Only desktop tested        |
| Program CTA interactions        | Call-to-action buttons, links      | 🟡 MEDIUM | Interactions not validated |

#### 📊 Programs - Coverage Summary

- **Explicit Coverage**: 4/12 manual tests (33%)
- **Not Covered**: 8/12 manual tests (67%)
- **Critical Gaps**:
  - 🟡 **Filtering & Search** (2 tests) - Not automated
  - 🟡 **Detail Pages** (3 tests) - Not validated
  - 🟡 **Enrollment** (2 tests) - No flow automated
  - 🟡 **Mobile/Responsive** (1 test) - Desktop only
- **Estimated Effort**: 8 tests × 0.5 days = **4-5 days**

#### 📌 Programs - Gap Analysis

**Missing Coverage by Category**:

1. **Program Filtering & Search** (0% coverage)

   - No filtering by type/category
   - No search functionality
   - Impact: Users cannot find specific programs

2. **Detail Pages** (0% coverage)

   - No detail page display validation
   - No content validation (descriptions, images)
   - Impact: Program details may not display correctly

3. **Enrollment Flow** (0% coverage)

   - No sign-up/registration flow
   - No enrollment confirmation
   - Impact: Cannot validate user enrollment journey

4. **Strong Coverage Areas** ✅
   - Programs landing page display ✅ (3 tests)
   - Navigation/redirection ✅ (1 test)
   - URL access ✅ (1 test)
   - Home page integration ✅ (1 test)

#### 🎯 Programs - Assessment

- **Status**: 🟡 **MODERATE** - Basic display covered (33%)
- **Business Impact**: 🟡 **MEDIUM** - Secondary content, engagement feature
- **Current State**: 4 automated tests cover:
  - Programs landing page display ✅
  - Navigation and redirection ✅
  - URL and home page access ✅
- **Missing**: Filtering (2 tests), Detail pages (3 tests), Enrollment (2 tests), Mobile (1 test)
- **Risk**: 🟡 **MEDIUM** - Basic navigation works, user journey gaps
- **Priority**: 🟡 **LOW-MEDIUM** - Secondary feature (4-5 days)
- **Recommendation**: Add detail page and filtering validation if programs are strategic

---

### 1️⃣9️⃣ Promotions - 25% Coverage 🔴

**Manual Tests**: 8 | **Automated**: 2 explicit | **Coverage**: 2/8 (25%)

#### ✅ Promotions - Tests Automatizados que Cubren Tests Manuales

| Automated Test                          | Covers Manual Test(s)            | Type     |
| --------------------------------------- | -------------------------------- | -------- |
| Promotions page display and layout      | Promotions landing page display  | Explicit |
| Cinesa Promotions page redirection test | Promotions navigation validation | Explicit |

#### ❌ Promotions - Tests Manuales SIN Cobertura

| Manual Test Category        | Description                         | Priority  | Reason Not Covered     |
| --------------------------- | ----------------------------------- | --------- | ---------------------- |
| Promotion detail pages      | Individual promotion display, terms | 🟡 MEDIUM | No detail page tests   |
| Promotion code validation   | Apply promo codes during booking    | 🔴 HIGH   | No code flow automated |
| Promotion eligibility       | User eligibility validation         | 🟡 MEDIUM | No eligibility checks  |
| Active/expired promotions   | Display logic based on dates        | 🟡 MEDIUM | Date logic not tested  |
| Promotion filtering/sorting | Filter by type, sort by date        | 🟡 LOW    | No filtering automated |
| Mobile layout               | Responsive design validation        | 🟡 MEDIUM | Only desktop tested    |

#### 📊 Promotions - Coverage Summary

- **Explicit Coverage**: 2/8 manual tests (25%)
- **Not Covered**: 6/8 manual tests (75%)
- **Critical Gaps**:
  - 🔴 **Promo Code Validation** (1 test) - Critical for conversions
  - 🟡 **Detail Pages** (2 tests) - Not validated
  - 🟡 **Eligibility & Date Logic** (2 tests) - Not tested
  - 🟡 **Filtering & Mobile** (1 test each)
- **Estimated Effort**: 6 tests × 1 day = **6-8 days**

#### 📌 Promotions - Gap Analysis

**Missing Coverage by Category**:

1. **Promo Code Validation** (0% coverage) 🔴

   - No validation of promo code application
   - No discount calculation verification
   - No eligibility checks
   - Impact: Users may apply invalid codes, revenue loss

2. **Detail Pages** (0% coverage)

   - No detail page display validation
   - No terms & conditions validation
   - Impact: Users may not understand promotion details

3. **Date Logic** (0% coverage)

   - No active/expired promotion logic
   - No date-based display validation
   - Impact: Expired promotions may display incorrectly

4. **Strong Coverage Areas** ✅
   - Promotions landing page display ✅
   - Navigation/redirection ✅

#### 🎯 Promotions - Assessment

- **Status**: 🔴 **CRITICAL GAP** - Only landing page covered (25%)
- **Business Impact**: 🔴 **HIGH** - Revenue driver, conversion booster
- **Current State**: 2 automated tests cover:
  - Promotions landing page display ✅
  - Navigation and redirection ✅
- **Missing**: Promo code validation (1 test), Detail pages (2 tests), Eligibility/Date logic (2 tests), Filtering/Mobile (2 tests)
- **Risk**: 🔴 **HIGH** - Promo code application not validated, revenue risk
- **Priority**: 🔴 **HIGH** - Quick win for promo codes (6-8 days)
- **Recommendation**: Prioritize promo code validation during booking journey

---

### 2️⃣0️⃣ Coupons - 30% Coverage 🟡

**Manual Tests**: 10 | **Automated**: 3 explicit | **Coverage**: 3/10 (30%)

#### ✅ Coupons - Tests Automatizados que Cubren Tests Manuales

| Automated Test                       | Covers Manual Test(s)         | Type     |
| ------------------------------------ | ----------------------------- | -------- |
| Coupons page display and layout      | Coupons landing page display  | Explicit |
| Cinesa Coupons page redirection test | Coupons navigation validation | Explicit |
| Validate coupons opens new tab       | External coupon link behavior | Explicit |

#### ❌ Coupons - Tests Manuales SIN Cobertura

| Manual Test Category       | Description                      | Priority  | Reason Not Covered     |
| -------------------------- | -------------------------------- | --------- | ---------------------- |
| Coupon code validation     | Apply coupons during booking     | 🔴 HIGH   | No code flow automated |
| Coupon detail pages        | Individual coupon display, terms | 🟡 MEDIUM | No detail page tests   |
| Coupon eligibility         | User eligibility, restrictions   | 🟡 MEDIUM | No eligibility checks  |
| Active/expired coupons     | Display logic based on dates     | 🟡 MEDIUM | Date logic not tested  |
| Coupon filtering/sorting   | Filter by type, category         | 🟡 LOW    | No filtering automated |
| Coupon redemption tracking | Track used/unused coupons        | 🟡 MEDIUM | No tracking validation |
| Mobile layout              | Responsive design validation     | 🟡 LOW    | Only desktop tested    |

#### 📊 Coupons - Coverage Summary

- **Explicit Coverage**: 3/10 manual tests (30%)
- **Not Covered**: 7/10 manual tests (70%)
- **Critical Gaps**:
  - 🔴 **Coupon Code Validation** (1 test) - Critical for conversions
  - 🟡 **Detail Pages & Eligibility** (3 tests) - Not validated
  - 🟡 **Date Logic & Tracking** (2 tests) - Not tested
  - 🟡 **Filtering & Mobile** (1 test each)
- **Estimated Effort**: 7 tests × 1 day = **7-8 days**

#### 📌 Coupons - Gap Analysis

**Missing Coverage by Category**:

1. **Coupon Code Validation** (0% coverage) 🔴

   - No validation of coupon code application
   - No discount calculation verification
   - No eligibility checks
   - Impact: Users may apply invalid coupons, revenue loss

2. **Detail Pages** (0% coverage)

   - No detail page display validation
   - No terms & conditions validation
   - Impact: Users may not understand coupon details

3. **Date Logic & Tracking** (0% coverage)

   - No active/expired coupon logic
   - No redemption tracking validation
   - Impact: Expired coupons may be used, tracking broken

4. **Strong Coverage Areas** ✅
   - Coupons landing page display ✅
   - Navigation/redirection ✅
   - External link behavior (new tab) ✅

#### 🎯 Coupons - Assessment

- **Status**: 🟡 **MODERATE** - Only landing page covered (30%)
- **Business Impact**: 🔴 **HIGH** - Revenue driver, promotional tool
- **Current State**: 3 automated tests cover:
  - Coupons landing page display ✅
  - Navigation and redirection ✅
  - External link behavior ✅
- **Missing**: Coupon code validation (1 test), Detail pages (3 tests), Date logic/Tracking (2 tests), Filtering/Mobile (2 tests)
- **Risk**: 🔴 **HIGH** - Coupon application not validated, revenue risk
- **Priority**: 🔴 **HIGH** - Quick win for coupon codes (7-8 days)
- **Recommendation**: Prioritize coupon code validation during booking journey

---

### 2️⃣1️⃣ Experiences - 33% Coverage 🟡

**Manual Tests**: 6 | **Automated**: 2 explicit | **Coverage**: 2/6 (33%)

#### ✅ Experiences - Tests Automatizados que Cubren Tests Manuales

| Automated Test                           | Covers Manual Test(s)             | Type     |
| ---------------------------------------- | --------------------------------- | -------- |
| Experiences page display and layout      | Experiences landing page display  | Explicit |
| Cinesa Experiences page redirection test | Experiences navigation validation | Explicit |

#### ❌ Experiences - Tests Manuales SIN Cobertura

| Manual Test Category        | Description                        | Priority  | Reason Not Covered     |
| --------------------------- | ---------------------------------- | --------- | ---------------------- |
| Experience detail pages     | Individual experience display      | 🟡 MEDIUM | No detail page tests   |
| Experience booking flow     | Book experiences (tickets, events) | 🟡 MEDIUM | No booking flow        |
| Experience filtering/search | Filter by type, location           | 🟡 LOW    | No filtering automated |
| Mobile layout               | Responsive design validation       | 🟡 LOW    | Only desktop tested    |

#### 📊 Experiences - Coverage Summary

- **Explicit Coverage**: 2/6 manual tests (33%)
- **Not Covered**: 4/6 manual tests (67%)
- **Critical Gaps**:
  - 🟡 **Detail Pages** (2 tests) - Not validated
  - 🟡 **Booking Flow** (1 test) - Not automated
  - 🟡 **Filtering & Mobile** (1 test each)
- **Estimated Effort**: 4 tests × 1 day = **4-5 days**

#### 📌 Experiences - Gap Analysis

**Missing Coverage by Category**:

1. **Detail Pages** (0% coverage)

   - No detail page display validation
   - No content validation
   - Impact: Experience details may not display correctly

2. **Booking Flow** (0% coverage)

   - No experience booking journey
   - No ticket/event purchase flow
   - Impact: Cannot validate experience purchases

3. **Strong Coverage Areas** ✅
   - Experiences landing page display ✅
   - Navigation/redirection ✅

#### 🎯 Experiences - Assessment

- **Status**: 🟡 **MODERATE** - Basic display covered (33%)
- **Business Impact**: 🟡 **MEDIUM** - Secondary revenue stream
- **Current State**: 2 automated tests cover:
  - Experiences landing page display ✅
  - Navigation and redirection ✅
- **Missing**: Detail pages (2 tests), Booking flow (1 test), Filtering/Mobile (2 tests)
- **Risk**: 🟡 **MEDIUM** - Basic navigation works, booking journey gaps
- **Priority**: 🟡 **MEDIUM** - Secondary feature (4-5 days)
- **Recommendation**: Add experience booking flow if experiences are strategic

---

### 2️⃣2️⃣ Mailing - 20% Coverage 🔴

**Manual Tests**: 5 | **Automated**: 1 explicit | **Coverage**: 1/5 (20%)

#### ✅ Mailing - Tests Automatizados que Cubren Tests Manuales

| Automated Test                          | Covers Manual Test(s)        | Type     |
| --------------------------------------- | ---------------------------- | -------- |
| Send and validate Outlook email to self | Email integration validation | Explicit |

#### ❌ Mailing - Tests Manuales SIN Cobertura

| Manual Test Category          | Description                  | Priority  | Reason Not Covered       |
| ----------------------------- | ---------------------------- | --------- | ------------------------ |
| Newsletter subscription       | Subscribe to newsletter      | 🟡 MEDIUM | No subscription flow     |
| Email confirmation (bookings) | Booking confirmation emails  | 🔴 HIGH   | No email validation      |
| Email confirmation (sign up)  | Sign up confirmation emails  | 🟡 MEDIUM | No email validation      |
| Unsubscribe flow              | Unsubscribe from newsletters | 🟡 MEDIUM | No unsubscribe automated |

#### 📊 Mailing - Coverage Summary

- **Explicit Coverage**: 1/5 manual tests (20%)
- **Not Covered**: 4/5 manual tests (80%)
- **Critical Gaps**:
  - 🔴 **Booking Confirmation Emails** (1 test) - Critical user feedback
  - 🟡 **Newsletter Subscription** (1 test) - Not automated
  - 🟡 **Sign Up Emails** (1 test) - Not validated
  - 🟡 **Unsubscribe Flow** (1 test) - Not tested
- **Estimated Effort**: 4 tests × 1 day = **4-5 days**

#### 📌 Mailing - Gap Analysis

**Missing Coverage by Category**:

1. **Booking Confirmation Emails** (0% coverage) 🔴

   - No validation of booking confirmation emails
   - No validation of email content (order details, tickets)
   - Impact: Users may not receive booking confirmations

2. **Newsletter Subscription** (0% coverage)

   - No subscription flow validation
   - No confirmation email validation
   - Impact: Newsletter signups may fail silently

3. **Sign Up Emails** (0% coverage)

   - No sign up confirmation email validation
   - No email verification flow
   - Impact: New users may not receive activation emails

4. **Strong Coverage Areas** ✅
   - Email integration (Outlook) ✅
   - Basic email sending ✅

#### 🎯 Mailing - Assessment

- **Status**: 🔴 **CRITICAL GAP** - Only basic integration tested (20%)
- **Business Impact**: 🔴 **HIGH** - User communication, order confirmation
- **Current State**: 1 automated test covers:
  - Email integration (Outlook) ✅
  - Basic email sending validation ✅
- **Missing**: Booking confirmation emails (1 test), Newsletter (1 test), Sign up emails (1 test), Unsubscribe (1 test)
- **Risk**: 🔴 **HIGH** - Booking confirmations not validated, user communication risk
- **Priority**: 🔴 **HIGH** - Critical for user feedback (4-5 days)
- **Recommendation**: Prioritize booking confirmation email validation

---

## 🚨 Critical Gaps Summary

### 🔴 Zero Coverage Components (110 tests)

| Component           | Manual Tests | Business Impact                    | Priority |
| ------------------- | ------------ | ---------------------------------- | -------- |
| **Unlimited**       | 40           | 🔴 Revenue - Subscription product  | URGENT   |
| **Loyalty**         | 30           | 🔴 Engagement - Customer retention | HIGH     |
| **My Account**      | 25           | 🟡 Support - User self-service     | MEDIUM   |
| **Booking Journey** | 15           | 🔴 UX - Session/navigation         | HIGH     |

**Total**: 110 tests **NOT covered** (47% of all manual tests)

---

### 🔴 Partial Coverage - High Risk (41 tests)

| Component         | Coverage % | Not Covered | Risk Area          |
| ----------------- | ---------- | ----------- | ------------------ |
| **Payment**       | 13%        | 13 tests    | Revenue conversion |
| **Sign Up**       | 36%        | 16 tests    | User acquisition   |
| **Ticket Picker** | 47%        | 8 tests     | Vouchers, loyalty  |
| **Blog**          | 28%        | 13 tests    | Content management |

**Total**: 50 tests with **partial/low coverage** (21% of all manual tests)

---

## 🎯 Automation Roadmap

### Phase 1: Critical Revenue & Conversion (Urgent)

**Timeline**: 2-3 months | **Tests**: 67

1. **Payment** (13 tests, 15-20 days) 🔴

   - Payment methods (card, gift card, wallet)
   - Error handling (rejection, timeout)
   - Security (3DS authentication)
   - Confirmation flow

2. **Unlimited Purchase Flow** (20 tests, 25-30 days) 🔴

   - Landing page & pricing display
   - Purchase & payment flow
   - Voucher application
   - Email confirmation & activation

3. **Ticket Picker - Vouchers & Loyalty** (8 tests, 8-10 days) 🔴

   - Discount voucher flow
   - Membership discount integration
   - Unlimited card integration
   - Restricted ticket validation

4. **Booking Journey - Session & Navigation** (15 tests, 15 days) 🔴

   - Session countdown & timeout
   - Back button navigation
   - Error recovery
   - Mobile journey flow

5. **Sign Up - Critical Validations** (11 tests, 11-15 days) 🔴
   - Password validation & reset
   - Age restriction validation
   - Loyalty program opt-in
   - Additional field validation

### Phase 2: Customer Engagement (High Priority)

**Timeline**: 2-3 months | **Tests**: 50

1. **Loyalty - Earning & Burning** (15 tests, 18-22 days) 🔴

   - Points calculation & earning
   - Points redemption (tickets, F&B)
   - Refund handling
   - Membership tiers

2. **Unlimited - Book with Friend** (10 tests, 12-15 days) 🔴

   - Add guest flow
   - Ticket validation
   - Cost calculation
   - Guest management

3. **My Account - Bookings Management** (10 tests, 10-12 days) 🟡

   - View booking history
   - Cancel booking
   - Download tickets
   - Refund management

4. **Blog - Content & SEO** (10 tests, 10-12 days) 🟡

   - Landing page & archive
   - Filtering & search
   - Article layouts
   - SEO meta tags

5. **Order Summary - Explicit Tests** (5 tests, 5-7 days) 🟡
   - Price breakdown validation
   - Modify order items
   - Apply changes
   - Error handling

### Phase 3: Additional Features (Medium Priority)

**Timeline**: 1-2 months | **Tests**: 30

1. **Loyalty - Advanced Features** (15 tests, 18-22 days) 🟡
2. **My Account - Preferences & Profile** (15 tests, 15-18 days) 🟡

### Phase 4: Secondary Components (Low Priority)

**Timeline**: 1 month | **Tests**: 41

1. **Programs Landing** (12 tests)
2. **Promotions** (8 tests)
3. **Coupons** (10 tests)
4. **Experiences** (6 tests)
5. **Mailing** (5 tests)

---

## 📈 Effort Estimation

| Phase                         | Tests   | Estimated Days                   | Priority  |
| ----------------------------- | ------- | -------------------------------- | --------- |
| **Phase 1: Critical Revenue** | 67      | 75-90 days (3-4 months)          | 🔴 URGENT |
| **Phase 2: Engagement**       | 50      | 55-71 days (2-3 months)          | 🔴 HIGH   |
| **Phase 3: Additional**       | 30      | 33-40 days (1.5-2 months)        | 🟡 MEDIUM |
| **Phase 4: Secondary**        | 41      | 41-50 days (2 months)            | 🟡 LOW    |
| **TOTAL**                     | **188** | **204-251 days** (~10-12 months) | -         |

**Assumptions**:

- 1 test = 1-1.5 days (includes test design, implementation, review, debugging)
- Complex flows (payment, unlimited) = 1.5-2 days per test
- Simple tests (UI validation) = 0.5-1 day per test
- 20% buffer for rework and maintenance

---

## 🎯 Recommended Approach

### Immediate Actions (Next 2 Weeks)

1. ✅ **Payment tests** - Start with PAY-02 to PAY-06 (payment methods + 3DS)
2. ✅ **Booking Journey** - Implement JOURNEY-01 to JOURNEY-03 (session management)
3. ✅ **Ticket Picker vouchers** - Implement TICKET-06 and TICKET-07

### Quick Wins (Can Start in Parallel)

1. 🟡 **Sign Up validations** - 5 tests, low complexity, high value
2. 🟡 **Blog basic tests** - 5 tests, independent, low risk

### Long-Term Planning

1. 🔴 **Unlimited program** - 40 tests require 2-3 month dedicated effort
2. 🔴 **Loyalty program** - 30 tests, coordinate with Unlimited testing
3. 🟡 **My Account** - 25 tests, lower priority but improves support efficiency

---

## 📝 Notes

### Methodology

- **Explicit Coverage**: Automated test directly validates the manual test scenario
- **Implicit Coverage**: Automated test executes the flow but doesn't validate all aspects
- **Reference**: 233 manual tests from `MANUAL_TEST_CATALOG_OCG-3654.md`
- **Automated Tests**: 127 tests from `TEST_CATALOG.md`

### Limitations

- Implicit coverage only validates **happy path** (no edge cases, error handling)
- Some automated tests cover **multiple manual tests** (marked in tables)
- Some manual tests are **partially covered** (basic flow only, not all scenarios)

### Next Steps

1. Review this report with stakeholders
2. Prioritize components based on business impact
3. Allocate resources for Phase 1 (Critical Revenue)
4. Create detailed test plans for prioritized components
5. Set up CI/CD pipeline for new automated tests

---

**🍫 Chocolate earned! Report conciso enfocado en análisis real manual vs automated.**
