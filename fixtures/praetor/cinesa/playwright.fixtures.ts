import { test as base } from '@playwright/test';
import { WebActions } from '../../../core/webactions/webActions';
import { createCinesaContext } from '../../shared/contextFactory';
import { PraetorSeatPicker } from '../../../pageObjectsManagers/praetor/cinesa/checkout/seatPicker/seatPicker.page';
import { PraetorLogin } from '../../../pageObjectsManagers/praetor/cinesa/checkout/login/login.page';
import { PraetorTicketPicker } from '../../../pageObjectsManagers/praetor/cinesa/checkout/ticketPicker/ticketPicker.page';
import { PraetorBar } from '../../../pageObjectsManagers/praetor/cinesa/checkout/bar/bar.page';
import { PraetorPurchaseSummary } from '../../../pageObjectsManagers/praetor/cinesa/checkout/purchaseSummary/purchaseSummary.page';
import { PraetorPayment } from '../../../pageObjectsManagers/praetor/cinesa/checkout/payment/payment.page';

/**
 * PRAETOR fixtures — Cinesa España checkout flow.
 *
 * Uses shared contextFactory for Cloudflare + consent + storageState.
 * New POMs will be added as each wave is implemented.
 */

type PraetorFixtures = {
  webActions: WebActions;
  seatPicker: PraetorSeatPicker;
  loginPage: PraetorLogin;
  purchaseSummary: PraetorPurchaseSummary;
  paymentPage: PraetorPayment;
  ticketPicker: PraetorTicketPicker;
  barPage: PraetorBar;
};

export const test = base.extend<PraetorFixtures>({
  // Shared context: Cloudflare + consent + storageState
  context: async ({ browser }, use) => {
    const context = await createCinesaContext(browser);
    await use(context);
    await context.close();
  },

  // Shared WebActions instance
  webActions: async ({ page }, use) => {
    const webActions = new WebActions(page);
    await use(webActions);
  },

  // SeatPicker POM
  seatPicker: async ({ page }, use) => {
    await use(new PraetorSeatPicker(page));
  },

  // Login POM
  loginPage: async ({ page }, use) => {
    await use(new PraetorLogin(page));
  },

  // TicketPicker POM
  ticketPicker: async ({ page }, use) => {
    await use(new PraetorTicketPicker(page));
  },

  // Bar POM
  barPage: async ({ page }, use) => {
    await use(new PraetorBar(page));
  },

  // PurchaseSummary POM
  purchaseSummary: async ({ page }, use) => {
    await use(new PraetorPurchaseSummary(page));
  },

  // Payment POM
  paymentPage: async ({ page }, use) => {
    await use(new PraetorPayment(page));
  },
});

export { expect } from '@playwright/test';
