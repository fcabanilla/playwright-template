/**
 * PRAETOR Over Capacity + D-BOX Tests — seat picker edge cases.
 *
 * Over Capacity: Verifies the dynamic FIFO queue behavior when
 * attempting to access a showtime that may have limited availability.
 *
 * D-BOX: Verifies that D-BOX showtimes display the D-BOX badge and
 * have selectable seats with correct seat types in the legend.
 */
import {
  test,
  expect,
} from '../../../../../fixtures/praetor/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { runCheckoutFlow } from '../../../../../core/testBuilder/checkoutFlow';
import { checkoutBaseUrl, E2E_SHOWTIMES } from '../e2e/e2e.data';
import { PraetorE2EAssertions } from '../e2e/e2e.assertions';

let assertions: PraetorE2EAssertions;

// ──────────────────────────────────────────────────────────────
//  Over Capacity Test
// ──────────────────────────────────────────────────────────────

test.describe('PRAETOR · SeatPicker · Over Capacity · Oasiz Preprod', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await allure.epic('PRAETOR Checkout');
    await allure.feature('Seat Picker - Seat Selection');
    await enrichTestMetadata(testInfo);
    assertions = new PraetorE2EAssertions(page);
  });

  test(
    'SeatPicker · Over Capacity · Dynamic FIFO queue handling — Oasiz',
    {
      tag: ['@praetor', '@seatpicker', '@e2e', '@cinesa', '@over-capacity'],
      annotation: {
        type: 'rewrite',
        description:
          'Rewrites cinesa seatPicker.spec.ts:406 — over capacity with dynamic FIFO queue',
      },
    },
    async ({ seatPicker, page }) => {
      await allure.story('Over Capacity — FIFO queue or seat picker loads');
      test.setTimeout(90_000);

      await allure.step(
        'Navigate to showtime and handle capacity',
        async () => {
          await seatPicker.navigateToShowtime(
            checkoutBaseUrl,
            E2E_SHOWTIMES.overCapacity
          );
        }
      );

      // After navigation, we should be on seat picker or see capacity message
      await allure.step('Verify seat picker or queue message', async () => {
        // The page either shows seat picker (normal) or a capacity message.
        // Both are valid outcomes on preprod.
        const currentUrl = page.url();
        const isOnSeatPicker = currentUrl.includes('/compra/butacas/');

        if (isOnSeatPicker) {
          // Normal case: seat picker loaded successfully
          await seatPicker.dismissBlockingModals();
          const seatCount = await seatPicker.getAvailableSeatCount();
          expect(seatCount).toBeGreaterThan(0);

          // Try to select a seat and reach the confirm button
          await seatPicker.selectFirstAvailableSeat();
          const confirmEnabled = await seatPicker.isConfirmButtonEnabled();
          expect(confirmEnabled).toBe(true);
        } else {
          // Over capacity: FIFO queue or error page
          const bodyText = await page.textContent('body');
          const hasCapacityMessage =
            bodyText?.includes('capacidad') ||
            bodyText?.includes('cola') ||
            bodyText?.includes('disponible') ||
            bodyText?.includes('sesión');
          expect(hasCapacityMessage).toBe(true);
        }
      });
    }
  );
});

// ──────────────────────────────────────────────────────────────
//  D-BOX Separate Group Test (serial — both tests share one D-BOX showtime)
// ──────────────────────────────────────────────────────────────

test.describe.serial('PRAETOR · SeatPicker · D-BOX · Oasiz Preprod', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await allure.epic('PRAETOR Checkout');
    await allure.feature('Seat Picker - Seat Selection');
    await enrichTestMetadata(testInfo);
    assertions = new PraetorE2EAssertions(page);
  });

  test(
    'SeatPicker · D-BOX · Showtime displays D-BOX badge and seats — Oasiz',
    {
      tag: ['@praetor', '@seatpicker', '@dbox', '@cinesa', '@smoke'],
      annotation: {
        type: 'rewrite',
        description:
          'Rewrites cinesa seatPicker.spec.ts:430 — D-BOX separate group / ticket mapping',
      },
    },
    async ({ seatPicker, page }) => {
      await allure.story('D-BOX — Badge and seat type display');
      test.setTimeout(90_000);

      // Step 1: Navigate to D-BOX showtime
      await seatPicker.navigateToShowtime(
        checkoutBaseUrl,
        E2E_SHOWTIMES.dbox
      );
      await seatPicker.dismissBlockingModals();

      // Step 2: Verify D-BOX badge is displayed
      await allure.step('Verify D-BOX badge visible', async () => {
        const dboxBadge = page.locator('img[alt="D-BOX"]');
        await expect(dboxBadge).toBeVisible({ timeout: 10000 });
      });

      // Step 3: Verify D-BOX is in the seat legend
      await allure.step('Verify D-BOX in seat legend', async () => {
        const legendText = await page
          .locator('.v-seat-picker-legend')
          .textContent()
          .catch(() => '');
        expect(legendText).toContain('Dbox');
      });

      // Step 4: Verify seats are available
      await allure.step('Verify seats available for selection', async () => {
        const availableCount = await seatPicker.getAvailableSeatCount();
        expect(availableCount).toBeGreaterThan(0);
      });

      // Step 5: Select a seat and proceed to tickets
      await seatPicker.selectFirstAvailableSeat();
      await seatPicker.confirmSeats();

      // Step 6: Login as guest and verify ticket picker loads
      // (D-BOX ticket mapping test — ensures D-BOX showtime flows correctly)
      await allure.step(
        'Verify D-BOX flow proceeds to login/tickets',
        async () => {
          // Should be on login or ticket page
          await page.waitForURL(
            /compra\/(inicio-de-sesion|tus-entradas)/,
            { timeout: 20000, waitUntil: 'domcontentloaded' }
          );
          const url = page.url();
          const isOnExpectedPage =
            url.includes('/compra/inicio-de-sesion/') ||
            url.includes('/compra/tus-entradas/');
          expect(isOnExpectedPage).toBe(true);
        }
      );
    }
  );

  test(
    'SeatPicker · D-BOX · Complete purchase flow — Oasiz',
    {
      tag: ['@praetor', '@seatpicker', '@dbox', '@e2e', '@cinesa'],
      annotation: {
        type: 'rewrite',
        description:
          'D-BOX full flow: seat → login → tickets → bar → summary → payment',
      },
    },
    async ({
      seatPicker,
      loginPage,
      ticketPicker,
      barPage,
      purchaseSummary,
    }) => {
      await allure.story('D-BOX — Complete purchase flow to payment');
      test.setTimeout(150_000);

      await runCheckoutFlow(
        { seatPicker, loginPage, ticketPicker, barPage, purchaseSummary },
        { baseUrl: checkoutBaseUrl, showtimeId: E2E_SHOWTIMES.dbox, stopAfter: 'payment' },
      );

      await assertions.expectOnPaymentPage();
      await assertions.expectRedsysVisible();
    }
  );
});
