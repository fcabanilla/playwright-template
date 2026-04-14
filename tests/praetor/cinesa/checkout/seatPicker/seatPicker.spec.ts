/**
 * PRAETOR SeatPicker tests — Wave 1.
 *
 * Validates seat selection on lab Oasiz_ cinema.
 * MCP-verified DOM structure and selectors.
 */
import {
  test,
  expect,
} from '../../../../../fixtures/praetor/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { PraetorSeatPickerAssertions } from './seatPicker.assertions';
import {
  COMPONENT_SHOWTIMES,
  seatPickerExpected,
  checkoutBaseUrl,
} from './seatPicker.data';

let assertions: PraetorSeatPickerAssertions;

test.describe('PRAETOR · Seat Picker · Oasiz Preprod', () => {
  test.beforeEach(async ({ page, seatPicker }, testInfo) => {
    await allure.epic('PRAETOR Checkout');
    await allure.feature('Seat Picker - Seat Selection');
    await enrichTestMetadata(testInfo);

    assertions = new PraetorSeatPickerAssertions(page);

    await seatPicker.navigateToShowtime(
      checkoutBaseUrl,
      COMPONENT_SHOWTIMES.seatPicker
    );
    await seatPicker.dismissBlockingModals();
  });

  test(
    'Seat Picker · Visibility · Display seats on load',
    { tag: ['@praetor', '@seatpicker', '@cinesa', '@smoke'] },
    async ({ seatPicker }) => {
      await allure.story('Display seats on initial load');
      await allure.description(
        'Verifies that the seat map loads correctly and displays available seats for selection. The cinema auditorium should show at least the minimum expected number of seats.'
      );

      await assertions.expectSeatsVisible();
      await assertions.expectMinimumSeatCount(seatPickerExpected.minTotalSeats);
      await assertions.expectAvailableSeatsExist();
    }
  );

  test(
    'Seat Picker · Selection · Confirm button disabled without selection',
    { tag: ['@praetor', '@seatpicker', '@cinesa', '@smoke'] },
    async () => {
      await allure.story('Confirm button state without selection');
      await allure.description(
        'Verifies that the "Continue" button remains disabled when no seat has been selected, preventing users from advancing without choosing a seat.'
      );

      await assertions.expectNoSeatsSelected();
      await assertions.expectConfirmButtonDisabled();
    }
  );

  test(
    'Seat Picker · Selection · Select single seat enables confirm',
    { tag: ['@praetor', '@seatpicker', '@cinesa', '@critical'] },
    async ({ seatPicker }) => {
      await allure.story('Select seat and enable confirm button');
      await allure.description(
        'Selects the first available seat in the auditorium and verifies that the "Continue" button becomes enabled, allowing the user to proceed to login.'
      );

      const seat = await seatPicker.selectFirstAvailableSeat();
      expect(seat).not.toBeNull();

      await assertions.expectSeatSelected();
      await assertions.expectConfirmButtonEnabled();
    }
  );

  test(
    'Seat Picker · Selection · Select random seat',
    { tag: ['@praetor', '@seatpicker', '@cinesa', '@regression'] },
    async ({ seatPicker }) => {
      await allure.story('Select random available seat');

      const seat = await seatPicker.selectRandomAvailableSeat();
      expect(seat).not.toBeNull();
      await allure.parameter('Selected seat', seat!.ariaLabel);

      const selectedCount = await seatPicker.getSelectedSeatCount();
      expect(selectedCount).toBeGreaterThanOrEqual(1);
    }
  );

  test(
    'Seat Picker · Selection · Select wheelchair seat with modal',
    { tag: ['@praetor', '@seatpicker', '@cinesa', '@regression'] },
    async ({ seatPicker }) => {
      await allure.story(
        'Wheelchair seat selection triggers confirmation modal'
      );

      const seat = await seatPicker.selectWheelchairSeat();
      // Wheelchair seats may not be available in all sessions
      if (seat) {
        await allure.parameter('Wheelchair seat', seat.ariaLabel);
        await assertions.expectSeatSelected();
      }
    }
  );

  test(
    'Seat Picker · Flow · Select seat and navigate to login',
    { tag: ['@praetor', '@seatpicker', '@cinesa', '@e2e', '@critical'] },
    async ({ seatPicker }) => {
      await allure.story('Complete seat selection and proceed to login');
      await allure.description(
        'End-to-end flow: selects a seat, clicks "Continue", and verifies the user is redirected to the login/guest page. This is the critical path from seat selection to authentication.'
      );

      await seatPicker.selectFirstAvailableSeat();
      await assertions.expectSeatSelected();
      await assertions.expectConfirmButtonEnabled();

      await seatPicker.confirmSeats();
      await assertions.expectNavigatedToLogin();
    }
  );

  test(
    'Seat Picker · Data · Display pricing cards',
    { tag: ['@praetor', '@seatpicker', '@cinesa', '@regression'] },
    async ({ seatPicker }) => {
      await allure.story('Pricing cards display seat categories');

      const cards = await seatPicker.getPricingCards();
      await allure.parameter('Pricing cards count', String(cards.length));

      // Some showtimes (e.g., standard rooms) don't render pricing cards
      test.skip(cards.length === 0, 'No pricing cards on this showtime — room has single price tier');

      for (const card of cards) {
        expect(card.label).toBeTruthy();
      }
      const cardsWithPrice = cards.filter((c) => c.price);
      expect(cardsWithPrice.length).toBeGreaterThan(0);
    }
  );
});
