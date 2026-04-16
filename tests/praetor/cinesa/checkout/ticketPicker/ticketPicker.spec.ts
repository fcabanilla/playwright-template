/**
 * PRAETOR TicketPicker tests — Wave 2.
 *
 * Validates ticket selection on lab Oasiz_ cinema.
 * Flow: seat selection → login (guest) → ticket picker.
 */
import {
  test,
  expect,
} from '../../../../../fixtures/praetor/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { PraetorTicketPickerAssertions } from './ticketPicker.assertions';
import {
  checkoutBaseUrl,
  ticketPickerExpected,
  ticketPickerUrls,
} from './ticketPicker.data';
import { COMPONENT_SHOWTIMES } from '../seatPicker/seatPicker.data';

let assertions: PraetorTicketPickerAssertions;

test.describe('PRAETOR · Ticket Picker · Oasiz Preprod', () => {
  test.beforeEach(async ({ page, seatPicker, loginPage }, testInfo) => {
    await allure.epic('PRAETOR Checkout');
    await allure.feature('Ticket Picker - Entry Selection');
    await enrichTestMetadata(testInfo);

    assertions = new PraetorTicketPickerAssertions(page);

    // Navigate through seat picker → login → ticket picker
    await seatPicker.navigateToShowtime(
      checkoutBaseUrl,
      COMPONENT_SHOWTIMES.ticketPicker
    );
    await seatPicker.dismissBlockingModals();
    await seatPicker.selectFirstAvailableSeat();
    await seatPicker.confirmSeats();
    await loginPage.tryLoginAsGuest();

    // Wait for ticket picker page
    await page.waitForURL(ticketPickerUrls.ticketPage, {
      timeout: 20000,
      waitUntil: 'domcontentloaded',
    });
  });

  test(
    'Ticket Picker · Visibility · Display ticket rows with types and prices',
    { tag: ['@praetor', '@ticketpicker', '@cinesa', '@smoke'] },
    async ({ ticketPicker }) => {
      await allure.story('Display ticket types on load');
      await allure.description(
        'Verifies that the ticket picker page displays available ticket types (Adult, Child, Senior, etc.) with their prices after completing seat selection and guest login.'
      );

      await assertions.expectTicketRowsVisible();
      await assertions.expectMinimumTicketRows(
        ticketPickerExpected.minTicketRows
      );
      await assertions.expectTicketPricesVisible();

      const names = await ticketPicker.getTicketTypeNames();
      await allure.parameter('Ticket types', names.join(', '));
      expect(names.length).toBeGreaterThan(0);
    }
  );

  test(
    'Ticket Picker · Default State · Confirm button disabled with zero tickets',
    { tag: ['@praetor', '@ticketpicker', '@cinesa', '@smoke'] },
    async () => {
      await allure.story('Confirm button disabled by default');
      await allure.description(
        'Ensures the confirm button is disabled when no ticket type has been selected, preventing users from proceeding without choosing at least one ticket.'
      );

      await assertions.expectTicketRowsVisible();
      await assertions.expectConfirmButtonDisabled();
    }
  );

  test(
    'Ticket Picker · Selection · Add one ticket enables confirm',
    { tag: ['@praetor', '@ticketpicker', '@cinesa', '@critical'] },
    async ({ ticketPicker }) => {
      await allure.story('Select ticket enables confirm button');
      await allure.description(
        'Adds one ticket of the first available type and verifies the confirm button becomes enabled.'
      );

      await ticketPicker.selectTicket(1);
      await assertions.expectConfirmButtonEnabled();
    }
  );

  test(
    'Ticket Picker · Data · Ticket types include adult or normal',
    { tag: ['@praetor', '@ticketpicker', '@cinesa', '@regression'] },
    async ({ ticketPicker }) => {
      await allure.story('Ticket types contain standard entry');

      const names = await ticketPicker.getTicketTypeNames();
      await allure.parameter('Ticket types', names.join(', '));

      const hasStandardTicket = names.some((name) =>
        ticketPickerExpected.primaryTicketPatterns.some((p) => p.test(name))
      );
      expect(hasStandardTicket).toBe(true);
    }
  );

  test(
    'Ticket Picker · Flow · Select ticket and navigate to bar',
    { tag: ['@praetor', '@ticketpicker', '@cinesa', '@e2e', '@critical'] },
    async ({ ticketPicker }) => {
      await allure.story('Complete ticket selection and proceed to bar');
      await allure.description(
        'End-to-end flow: selects a ticket type, confirms the selection, and verifies navigation to the Bar & Food page. This is the critical transition from ticket selection to food services.'
      );

      await ticketPicker.selectTicketAndConfirm(1);
      await assertions.expectNavigatedToBar();
    }
  );
});
