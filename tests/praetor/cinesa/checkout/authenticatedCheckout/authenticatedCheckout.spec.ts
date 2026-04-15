/**
 * PRAETOR Authenticated Checkout Tests — Full checkout flow with user login.
 *
 * These tests login with credentials at the checkout login step (Registro)
 * instead of continuing as guest. The checkout login page does NOT have
 * reCAPTCHA, so credentials can be filled directly. This validates that:
 * 1. The checkout flow supports user login with valid credentials
 * 2. User data is pre-filled in the purchase summary after login
 * 3. The full flow completes to payment for authenticated users
 *
 * Prerequisites:
 * ```bash
 * # 1. Generate consent state
 * TEST_ENV=preprod npx playwright test --project=setup
 *
 * # 2. Run authenticated checkout tests
 * TEST_ENV=preprod npx playwright test --project=Praetor-Cinesa --grep "@authenticated"
 * ```
 */
import {
  test,
  expect,
} from '../../../../../fixtures/praetor/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { runCheckoutFlow } from '../../../../../core/testBuilder/checkoutFlow';
import { AuthenticatedCheckoutAssertions } from './authenticatedCheckout.assertions';
import {
  authenticatedCheckoutBaseUrl,
  AUTH_SHOWTIMES,
} from './authenticatedCheckout.data';
import { cinesaTestAccounts } from '../../../../../config/testAccounts';

const account = cinesaTestAccounts.valid.loyalty;
const resolvedEmail =
  account.email || process.env.TEST_USER_EMAIL || '';
const resolvedPassword =
  account.password || process.env.TEST_USER_PASSWORD || '';

let assertions: AuthenticatedCheckoutAssertions;

test.describe('PRAETOR · Authenticated Checkout · E2E · Oasiz Preprod', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await allure.epic('PRAETOR Checkout');
    await allure.feature('Authentication - User Access');
    await enrichTestMetadata(testInfo);
    assertions = new AuthenticatedCheckoutAssertions(page);
  });

  test(
    'Authenticated Checkout · E2E · Full flow to payment — Oasiz',
    {
      tag: [
        '@praetor',
        '@authenticated',
        '@checkout',
        '@e2e',
        '@cinesa',
        '@smoke',
      ],
      annotation: {
        type: 'feature',
        description: 'Validates checkout flow with logged-in user session (login step skipped)',
      },
    },
    async ({
      seatPicker,
      loginPage,
      ticketPicker,
      barPage,
      purchaseSummary,
    }) => {
      await allure.story(
        'Authenticated checkout — Skip login and reach payment',
      );
      test.setTimeout(150_000);

      await runCheckoutFlow(
        { seatPicker, loginPage, ticketPicker, barPage, purchaseSummary },
        {
          baseUrl: authenticatedCheckoutBaseUrl,
          showtimeId: AUTH_SHOWTIMES.fullFlow,
          stopAfter: 'payment',
          loginStrategy: 'login',
          loginCredentials: { email: resolvedEmail, password: resolvedPassword },
        },
      );

      await assertions.expectOnPaymentPage();
      await assertions.expectPaymentHeading();
      await assertions.expectRedsysVisible();
    },
  );

  test(
    'Authenticated Checkout · E2E · Verify user data pre-filled in summary — Oasiz',
    {
      tag: ['@praetor', '@authenticated', '@checkout', '@e2e', '@cinesa'],
      annotation: {
        type: 'feature',
        description:
          'Validates that logged-in user data is pre-filled in purchase summary',
      },
    },
    async ({
      seatPicker,
      loginPage,
      ticketPicker,
      barPage,
      purchaseSummary,
    }) => {
      await allure.story(
        'Authenticated checkout — User data pre-filled in summary',
      );
      test.setTimeout(150_000);

      await runCheckoutFlow(
        { seatPicker, loginPage, ticketPicker, barPage, purchaseSummary },
        {
          baseUrl: authenticatedCheckoutBaseUrl,
          showtimeId: AUTH_SHOWTIMES.summaryVerify,
          stopAfter: 'summary',
          loginStrategy: 'login',
          loginCredentials: { email: resolvedEmail, password: resolvedPassword },
        },
      );

      await assertions.expectOnPurchaseSummary();
      await assertions.expectSummaryFormVisible();
      await assertions.expectUserDataPreFilled();
    },
  );
});
