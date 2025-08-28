# UCI Cinemas - Epic Fase 1: Smoke Tests

## Epic Summary

**Epic Name**: UCI Cinemas - Smoke Test Automation (Phase 1)

**Epic Goal**: Implement basic smoke test automation for UCI Cinemas critical purchase flow

**Business Value**: Enable early detection of critical regressions and reduce manual testing effort by 80%

---

## User Stories

### Story 1: Cinema Selection Page Objects
**As a** QA Engineer  
**I want** to have Page Objects for UCI cinema selection  
**So that** I can automate cinema navigation tests

**Acceptance Criteria:**
- [ ] Cinema.page.ts implemented with selectors
- [ ] Can navigate to cinemas section
- [ ] Can select specific cinema
- [ ] Selectors work on production site

**Story Points**: 3  
**Priority**: High

---

### Story 2: Seat Selection Page Objects
**As a** QA Engineer  
**I want** to have Page Objects for UCI seat selection  
**So that** I can automate seat booking tests

**Acceptance Criteria:**
- [ ] SeatPicker.page.ts implemented
- [ ] Can select available seats
- [ ] Can validate seat selection
- [ ] Can confirm seat selection

**Story Points**: 5  
**Priority**: High

---

### Story 3: Purchase Flow Page Objects
**As a** QA Engineer  
**I want** to have Page Objects for UCI purchase flow  
**So that** I can automate ticket purchase tests

**Acceptance Criteria:**
- [ ] TicketPicker.page.ts implemented
- [ ] LoginPage.page.ts implemented
- [ ] PurchaseSummary.page.ts implemented
- [ ] PaymentPage.page.ts implemented

**Story Points**: 8  
**Priority**: High

---

### Story 4: Complete Smoke Test
**As a** QA Engineer  
**I want** to have a complete smoke test for UCI purchase flow  
**So that** I can validate critical functionality automatically

**Acceptance Criteria:**
- [ ] End-to-end purchase flow test implemented
- [ ] Test passes consistently (>95% success rate)
- [ ] Test execution time < 5 minutes
- [ ] Proper error handling and reporting

**Story Points**: 5  
**Priority**: Critical

---

## Technical Requirements

### Definition of Done
- [ ] All Page Objects follow established patterns from Cinesa
- [ ] Selectors are tested against production UCI site
- [ ] Tests include proper assertions and error handling
- [ ] Documentation is updated
- [ ] CI/CD integration configured

### Dependencies
- Access to UCI production site for selector validation
- Playwright environment setup
- Allure reporting configuration

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cloudflare blocking | High | Use anti-detection headers |
| Unstable selectors | Medium | Implement robust selector strategy |
| Site structure changes | Low | Use flexible selector patterns |

---

## Acceptance Criteria (Epic Level)

### Functional
- [ ] Complete purchase flow automation works end-to-end
- [ ] All critical page objects implemented
- [ ] Tests run successfully in CI/CD pipeline
- [ ] Smoke test suite execution time under 5 minutes

### Technical
- [ ] Code follows established architecture patterns
- [ ] Page Objects are properly encapsulated
- [ ] Error handling implemented
- [ ] Reporting and screenshots on failure

### Quality
- [ ] Test success rate > 95%
- [ ] Documentation complete
- [ ] Peer review completed
- [ ] Manual validation performed

---

## Jira Task Breakdown

### Epic: UCI-SMOKE-001
**Parent Tasks:**

1. **UCI-001**: Implement Cinema Page Objects (3 days)
   - Cinema selection functionality
   - Cinema detail navigation
   - Movie and showtime selection

2. **UCI-002**: Implement SeatPicker Page Objects (2 days)
   - Seat selection logic
   - Seat validation
   - Confirmation handling

3. **UCI-003**: Implement Purchase Flow Page Objects (2 days)
   - Ticket selection
   - Login/guest flow
   - Purchase summary
   - Payment validation

4. **UCI-004**: Create Smoke Test Suite (1 day)
   - End-to-end purchase test
   - Component-level tests
   - Error scenarios

5. **UCI-005**: Testing and Validation (1 day)
   - Production site validation
   - CI/CD integration
   - Documentation update

---

## Timeline

**Sprint 1 (Week 1)**: Tasks UCI-001, UCI-002  
**Sprint 2 (Week 2)**: Tasks UCI-003, UCI-004, UCI-005

**Total Duration**: 9 days  
**Target Completion**: September 6, 2025

---

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|---------|
| Page Objects Implemented | 7 | 3 | 🔴 |
| Test Coverage (Critical Flow) | 100% | 0% | 🔴 |
| Test Success Rate | >95% | - | ⚪ |
| Execution Time | <5 min | - | ⚪ |

---

## Resources Required

- **Developer**: 1 FTE for 9 days
- **QA**: 0.5 FTE for validation
- **Infrastructure**: CI/CD pipeline access
- **Tools**: Playwright, Allure, Node.js environment

---

**Created**: August 28, 2025  
**Last Updated**: August 28, 2025  
**Epic Owner**: QA Team Lead  
**Sprint**: TBD
