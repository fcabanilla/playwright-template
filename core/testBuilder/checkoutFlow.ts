/**
 * Checkout flow runner — eliminates repetitive step sequences in E2E specs.
 *
 * The full checkout flow is: seats → login → tickets → bar → summary → payment.
 * Most E2E tests execute the same steps, varying only:
 *   - showtimeId (which showtime to target)
 *   - seatCount (1 or N seats)
 *   - stopAfter (how far through the flow to go)
 *   - skipBar (whether to skip bar or interact with it)
 *
 * Usage:
 * ```ts
 * await runCheckoutFlow(
 *   { seatPicker, loginPage, ticketPicker, barPage, purchaseSummary },
 *   { baseUrl: checkoutBaseUrl, showtimeId: '123', seatCount: 1, stopAfter: 'payment' }
 * );
 * // now run test-specific assertions
 * ```
 */

import { allure } from 'allure-playwright';
import type { PraetorSeatPicker } from '../../pageObjectsManagers/praetor/cinesa/checkout/seatPicker/seatPicker.page';
import type { PraetorLogin } from '../../pageObjectsManagers/praetor/cinesa/checkout/login/login.page';
import type { PraetorTicketPicker } from '../../pageObjectsManagers/praetor/cinesa/checkout/ticketPicker/ticketPicker.page';
import type { PraetorBar } from '../../pageObjectsManagers/praetor/cinesa/checkout/bar/bar.page';
import type { PraetorPurchaseSummary } from '../../pageObjectsManagers/praetor/cinesa/checkout/purchaseSummary/purchaseSummary.page';

/** Subset of PraetorFixtures needed by the checkout flow runner */
export interface CheckoutFixtures {
  seatPicker: PraetorSeatPicker;
  loginPage: PraetorLogin;
  ticketPicker: PraetorTicketPicker;
  barPage: PraetorBar;
  purchaseSummary: PraetorPurchaseSummary;
}

/** Flow stops — ordered by checkout progression */
export type FlowStop =
  | 'seats'
  | 'login'
  | 'tickets'
  | 'bar'
  | 'summary'
  | 'payment';

/** Configuration for a checkout flow run */
export interface CheckoutFlowConfig {
  /** Base URL for checkout (from environment config) */
  baseUrl: string;
  /** Showtime ID to navigate to */
  showtimeId: string;
  /** Number of seats to select (default: 1) */
  seatCount?: number;
  /** Seat selection strategy (default: 'first') */
  seatSelection?: 'first' | 'random';
  /** Stop the flow after this step (default: 'payment') */
  stopAfter?: FlowStop;
  /** Skip bar step — true = click skip, false = leave for manual handling (default: true) */
  skipBar?: boolean;
  /** Guest login timeout in ms (default: 15000) */
  loginTimeout?: number;
}

const FLOW_ORDER: FlowStop[] = [
  'seats',
  'login',
  'tickets',
  'bar',
  'summary',
  'payment',
];

/**
 * Runs the checkout flow up to the specified stop point.
 *
 * Each step is wrapped in an `allure.step()` for clear reporting.
 * Returns the actual seat count (useful when seatCount > 1 and
 * some selections may fail).
 */
export async function runCheckoutFlow(
  fixtures: CheckoutFixtures,
  config: CheckoutFlowConfig,
): Promise<{ seatCount: number }> {
  const {
    seatPicker,
    loginPage,
    ticketPicker,
    barPage,
    purchaseSummary,
  } = fixtures;

  const seatCount = config.seatCount ?? 1;
  const stopAfter = config.stopAfter ?? 'payment';
  const skipBar = config.skipBar ?? true;
  const loginTimeout = config.loginTimeout ?? 15000;
  const stopIndex = FLOW_ORDER.indexOf(stopAfter);

  // ── Step 1: Seats ──────────────────────────────────────────
  await allure.step(
    `[FLOW] Navigate to showtime and select ${seatCount} seat(s)`,
    async () => {
      await seatPicker.navigateToShowtime(config.baseUrl, config.showtimeId);
      await seatPicker.dismissBlockingModals();

      if (config.seatSelection === 'random') {
        for (let i = 0; i < seatCount; i++) {
          await seatPicker.selectRandomAvailableSeat();
        }
      } else {
        // Use sequential selection for all seats to minimize gap issues
        for (let i = 0; i < seatCount; i++) {
          await seatPicker.selectFirstAvailableSeat();
        }
      }
      await seatPicker.confirmSeats();
    },
  );
  if (stopIndex <= 0) return { seatCount };

  // ── Step 2: Login ──────────────────────────────────────────
  await allure.step('[FLOW] Login as guest', async () => {
    await loginPage.tryLoginAsGuest(loginTimeout);
  });
  if (stopIndex <= 1) return { seatCount };

  // ── Step 3: Tickets ────────────────────────────────────────
  await allure.step(
    `[FLOW] Select ${seatCount} ticket(s) and confirm`,
    async () => {
      await ticketPicker.selectTicketAndConfirm(seatCount);
    },
  );
  if (stopIndex <= 2) return { seatCount };

  // ── Step 4: Bar ────────────────────────────────────────────
  if (skipBar) {
    await allure.step('[FLOW] Skip bar', async () => {
      await barPage.skipBar();
    });
  }
  if (stopIndex <= 3) return { seatCount };

  // ── Step 5: Summary ────────────────────────────────────────
  await allure.step(
    '[FLOW] Accept terms and continue to payment',
    async () => {
      await purchaseSummary.acceptAndContinue();
    },
  );
  if (stopIndex <= 4) return { seatCount };

  // ── Step 6: Payment ────────────────────────────────────────
  // No action needed — the page loads after summary continues.
  // Test-specific assertions should validate payment page content.

  return { seatCount };
}
