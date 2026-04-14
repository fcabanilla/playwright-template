/**
 * PRAETOR E2E Tests — Full checkout flow validation on preprod.
 *
 * Rewrites of 7 failing cinesa tests adapted to preprod reality.
 * Uses dedicated showtimes per test to avoid seat contention.
 * Uses `runCheckoutFlow` to eliminate repetitive step sequences.
 *
 * Tests: Bar (single/multi), Checkout (credit card/gift card/complete).
 */
import {
  test,
  expect,
} from '../../../../../fixtures/praetor/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { runCheckoutFlow } from '../../../../../core/testBuilder/checkoutFlow';
import { PraetorE2EAssertions } from './e2e.assertions';
import {
  checkoutBaseUrl,
  E2E_SHOWTIMES,
} from './e2e.data';

let assertions: PraetorE2EAssertions;

// ──────────────────────────────────────────────────────────────
//  Bar E2E Tests (Single + Multiple Seats)
// ──────────────────────────────────────────────────────────────

test.describe('PRAETOR · Bar · E2E · Oasiz Preprod', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await allure.epic('PRAETOR Checkout');
    await allure.feature('Bar & Food Services');
    await enrichTestMetadata(testInfo);
    assertions = new PraetorE2EAssertions(page);
  });

  test(
    'Bar · E2E · Skip bar with single seat — Oasiz',
    {
      tag: ['@praetor', '@bar', '@e2e', '@cinesa', '@smoke'],
      annotation: { type: 'rewrite', description: 'Rewrites cinesa bar.spec.ts:25 — single seat skip bar to payment' },
    },
    async ({ seatPicker, loginPage, ticketPicker, barPage, purchaseSummary }) => {
      await allure.story('Bar E2E — Single seat skip to payment');
      test.setTimeout(120_000);

      await runCheckoutFlow(
        { seatPicker, loginPage, ticketPicker, barPage, purchaseSummary },
        { baseUrl: checkoutBaseUrl, showtimeId: E2E_SHOWTIMES.barSingleSeat, stopAfter: 'payment' },
      );

      await assertions.expectOnPaymentPage();
      await assertions.expectPaymentHeading();
      await assertions.expectRedsysVisible();
    }
  );

  test(
    'Bar · E2E · Skip bar with multiple seats — Oasiz',
    {
      tag: ['@praetor', '@bar', '@e2e', '@cinesa'],
      annotation: { type: 'rewrite', description: 'Rewrites cinesa bar.spec.ts:78 — multiple seats skip bar to payment' },
    },
    async ({ seatPicker, loginPage, ticketPicker, barPage, purchaseSummary }) => {
      await allure.story('Bar E2E — Multiple seats skip to payment');
      test.setTimeout(120_000);

      await runCheckoutFlow(
        { seatPicker, loginPage, ticketPicker, barPage, purchaseSummary },
        { baseUrl: checkoutBaseUrl, showtimeId: E2E_SHOWTIMES.barMultipleSeats, seatCount: 2, seatSelection: 'random', stopAfter: 'payment' },
      );

      await assertions.expectOnPaymentPage();
      await assertions.expectRedsysVisible();
    }
  );
});

// ──────────────────────────────────────────────────────────────
//  Checkout E2E Tests (Credit Card, Gift Card, Complete Purchase)
// ──────────────────────────────────────────────────────────────

test.describe('PRAETOR · Checkout · E2E · Oasiz Preprod', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await allure.epic('PRAETOR Checkout');
    await allure.feature('Purchase Summary - Order Review');
    await enrichTestMetadata(testInfo);
    assertions = new PraetorE2EAssertions(page);
  });

  test(
    'Checkout · E2E · Reach payment page (credit card) — Oasiz',
    {
      tag: ['@praetor', '@checkout', '@e2e', '@cinesa', '@smoke'],
      annotation: { type: 'rewrite', description: 'Rewrites cinesa checkout.smoke.spec.ts:22 — single seat to payment' },
    },
    async ({ seatPicker, loginPage, ticketPicker, barPage, purchaseSummary }) => {
      await allure.story('Checkout E2E — Credit card payment page');
      test.setTimeout(150_000);

      await runCheckoutFlow(
        { seatPicker, loginPage, ticketPicker, barPage, purchaseSummary },
        { baseUrl: checkoutBaseUrl, showtimeId: E2E_SHOWTIMES.checkoutCreditCard, stopAfter: 'payment' },
      );

      await assertions.expectOnPaymentPage();
      await assertions.expectPaymentHeading();
      await assertions.expectRedsysVisible();
      await assertions.expectGiftCardSection();
    }
  );

  test(
    'Checkout · E2E · Gift card section visible on payment — Oasiz',
    {
      tag: ['@praetor', '@checkout', '@e2e', '@cinesa', '@giftcard'],
      annotation: { type: 'rewrite', description: 'Rewrites cinesa checkout.giftcard.spec.ts:24 — validates gift card presence' },
    },
    async ({ seatPicker, loginPage, ticketPicker, barPage, purchaseSummary, paymentPage }) => {
      await allure.story('Checkout E2E — Gift card section on payment page');
      test.setTimeout(150_000);

      await runCheckoutFlow(
        { seatPicker, loginPage, ticketPicker, barPage, purchaseSummary },
        { baseUrl: checkoutBaseUrl, showtimeId: E2E_SHOWTIMES.checkoutGiftCard, stopAfter: 'payment' },
      );

      await assertions.expectOnPaymentPage();
      await assertions.expectGiftCardSection();

      const giftCardVisible = await paymentPage.isGiftCardSectionVisible();
      expect(giftCardVisible).toBe(true);
    }
  );

  test(
    'Checkout · E2E · Complete purchase flow (single seat) — Oasiz',
    {
      tag: ['@praetor', '@checkout', '@e2e', '@cinesa', '@critical'],
      annotation: { type: 'rewrite', description: 'Rewrites cinesa seatPicker.spec.ts:41 — complete purchase flow to payment' },
    },
    async ({ seatPicker, loginPage, ticketPicker, barPage, purchaseSummary }) => {
      await allure.story('Checkout E2E — Complete single seat purchase flow');
      test.setTimeout(150_000);

      // Run flow to bar, then manually handle summary for mid-flow assertions
      await runCheckoutFlow(
        { seatPicker, loginPage, ticketPicker, barPage, purchaseSummary },
        { baseUrl: checkoutBaseUrl, showtimeId: E2E_SHOWTIMES.seatPickerComplete, stopAfter: 'bar' },
      );

      await assertions.expectOnPurchaseSummary();
      await assertions.expectSummaryFormVisible();
      await assertions.expectTicketCountInSummary(1);
      await purchaseSummary.acceptAndContinue();

      await assertions.expectOnPaymentPage();
      await assertions.expectPaymentHeading();
      await assertions.expectRedsysVisible();
    }
  );
});
