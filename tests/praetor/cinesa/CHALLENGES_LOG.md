# Praetor Implementation — Challenges Log

> Registro de desafíos encontrados durante la implementación de los 7 tests praetor, cómo se resolvieron y cómo prevenir que ocurran de nuevo.

---

## Challenge #1: Expired Showtimes Pool

**Date:** 2026-04-13
**Phase:** MCP Exploration (Phase 1)
**Severity:** 🔴 Blocker

### Problem
The hardcoded `OASIZ_SHOWTIMES` in `seatPicker.data.ts` (IDs: 138-36863, 138-36871, 138-36875) are all expired. Navigating to `/compra/butacas/?showtimeId=138-36875` returns "Esta sesión no está disponible".

### Root Cause
Preprod showtimes rotate — they have expiration dates tied to the cinema schedule. The pool was verified for lab environment months ago and never updated for preprod.

### Resolution
Discovered new active showtimes via MCP browser on Oasiz cinema page (`/cines/oasiz/`):

| ID | Room | Time | Type |
|----|------|------|------|
| 138-43532 | Sala 5 | 17:35 | Standard |
| 138-43531 | Sala 4 D-BOX | 17:50 | D-BOX |
| 138-43529 | Sala 3 | 19:35 | Standard |
| 138-43530 | Sala 5 | 20:20 | Standard |
| 138-43533 | Sala 7 iSense | 17:20 | iSense |
| 138-43528 | Sala 3 | 16:05 | Standard |
| 138-43537 | Sala 1 | 15:55 | Standard |
| 138-43536 | Sala 2 | 17:50 | Standard |
| 138-43535 | Sala 7 iSense | 19:35 | iSense |
| 138-43534 | Sala 2 | 21:40 | Standard |

### Prevention
- **Dynamic showtime discovery:** Tests should fetch available showtimes from the cinema page instead of relying on hardcoded IDs.
- **Data helper function:** Create `getActiveShowtimes()` that scrapes `/cines/oasiz/` for current IDs.
- **Fallback strategy:** If a showtime returns "no disponible", the test should skip gracefully instead of failing with a timeout.

---

## Challenge #2: ScreenX Attribute Modal Blocking Seat Selection

**Date:** 2026-04-13
**Phase:** MCP Exploration — Seat Picker
**Severity:** 🟡 Medium

### Problem
Navigating to showtime 138-43537 (Sala 1, ScreenX) triggers a blocking `.showtime-attribute-modal` ("Aviso importante" about ScreenX 270°). This overlay intercepts all pointer events, preventing seat selection.

### Root Cause
Premium format showtimes (ScreenX, iSense, D-BOX) display informational modals about the experience before the user can interact with seats.

### Resolution
The `PraetorSeatPicker.dismissBlockingModals()` method already handles generic modals via `.genericModalAccept` selector (`.btn--blue--medium`). The ScreenX modal uses the same button class, so it's automatically dismissed.

### Prevention
- Always call `dismissBlockingModals()` after `navigateToShowtime()` — this is enforced in every `beforeEach` in the test specs.
- The generic modal pattern (3-attempt loop with accept/close fallback) covers future attribute modals too.

---

## Challenge #3: Terms Checkbox Input Intercepted by Styled Wrapper

**Date:** 2026-04-13
**Phase:** MCP Exploration — Purchase Summary
**Severity:** 🟡 Medium

### Problem
Clicking the privacy/terms checkbox input directly fails because a styled `.v-checkbox-input__button` wrapper div intercepts the pointer event. Playwright throws "element is not clickable at point" error.

### Root Cause
Vue component renders a custom checkbox with a decorative wrapper div on top of the native `<input>`. The wrapper captures clicks for visual styling.

### Resolution
`PraetorPurchaseSummary.acceptTerms()` clicks the wrapper div (`.v-checkbox-input__button`) instead of the native input. Selector: `purchaseSummarySelectors.termsCheckboxWrapper`.

### Prevention
- Always use MCP browser exploration to verify clickability of form elements before writing selectors.
- Prefer wrapper/container selectors for styled checkbox/radio components in Vue apps.

---

## Challenge #4: Hidden Email Confirmation Modal After Summary Continue

**Date:** 2026-04-13
**Phase:** MCP Exploration — Purchase Summary → Payment Transition
**Severity:** 🟠 High

### Problem
After clicking "Continuar" on the purchase summary page, an `.email-confirmation-modal` appears requiring an explicit "Confirmar" click before navigation to payment. The modal has class `hide-modal` initially and is not visible in the initial DOM scan.

### Root Cause
The checkout flow validates the guest email and shows a confirmation popup as a security step. This is not documented in any ADR.

### Resolution
`PraetorPurchaseSummary.confirmEmailModal()` waits for the modal to become visible and clicks the confirm button. The `acceptAndContinue()` orchestrator method calls this automatically after `clickContinue()`.

### Prevention
- The `acceptAndContinue()` method chains: `fillCustomerDetails() → acceptTerms() → clickContinue() → confirmEmailModal()`.
- All E2E tests use `acceptAndContinue()` instead of individual steps, ensuring the modal is always handled.

---

## Challenge #5: Gift Card Payment Disabled on Preprod

**Date:** 2026-04-13
**Phase:** MCP Exploration — Payment Page
**Severity:** 🟡 Medium (known bug)

### Problem
On the payment page, the gift card number input (`spinbutton "Número de la tarjeta"`) is disabled. Users cannot enter a gift card number to pay.

### Root Cause
Known preprod backend limitation — gift card service is not fully configured in the preprod environment.

### Resolution
- Tests verify the gift card **section is visible** (structural assertion) but do NOT attempt to fill in the form.
- `PraetorPayment.isGiftCardEnabled()` returns `false` on preprod — this is expected behavior, not a failure.

### Prevention
- E2E tests that validate payment focus on Redsys credit card presence, NOT gift card interaction.
- The gift card test (`Checkout · E2E · Gift card section visible`) validates presence only, not functionality.
