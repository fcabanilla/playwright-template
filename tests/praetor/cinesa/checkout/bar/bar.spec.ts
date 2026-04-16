/**
 * PRAETOR Bar tests — Wave 2.
 *
 * Validates bar/food services on lab Oasiz_ cinema.
 * Flow: seat selection → login (guest) → ticket → bar.
 */
import {
  test,
  expect,
} from '../../../../../fixtures/praetor/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { PraetorBarAssertions } from './bar.assertions';
import { checkoutBaseUrl, barUrls } from './bar.data';
import { COMPONENT_SHOWTIMES } from '../seatPicker/seatPicker.data';

let assertions: PraetorBarAssertions;

test.describe('PRAETOR · Bar · Oasiz Preprod', () => {
  test.beforeEach(
    async ({ page, seatPicker, loginPage, ticketPicker }, testInfo) => {
      await allure.epic('PRAETOR Checkout');
      await allure.feature('Bar & Food Services');
      await enrichTestMetadata(testInfo);

      assertions = new PraetorBarAssertions(page);

      // Navigate: seat picker → login (guest) → ticket → bar
      await seatPicker.navigateToShowtime(checkoutBaseUrl, COMPONENT_SHOWTIMES.bar);
      await seatPicker.dismissBlockingModals();
      await seatPicker.selectFirstAvailableSeat();
      const seatCount = await seatPicker.getSelectedSeatCount();
      await seatPicker.confirmSeats();
      await loginPage.tryLoginAsGuest(15000);
      await ticketPicker.selectTicketAndConfirm(seatCount || 1);

      // Wait for bar page
      await page.waitForURL(barUrls.barPage, { timeout: 25000, waitUntil: 'domcontentloaded' });
    }
  );

  test(
    'Bar · Visibility · Bar page loads with skip button',
    { tag: ['@praetor', '@bar', '@cinesa', '@smoke'] },
    async ({ barPage }) => {
      await allure.story('Display bar page with skip option');
      await allure.description(
        'Verifies that the Bar & Food page loads correctly after ticket selection, displaying the skip button that allows users to proceed without ordering food.'
      );

      await barPage.handleBarModal();
      await barPage.handleGaliciaModal();
      await assertions.expectSkipButtonVisible();
    }
  );

  test(
    'Bar · Skip · Skip bar navigates to purchase summary',
    { tag: ['@praetor', '@bar', '@cinesa', '@critical'] },
    async ({ barPage }) => {
      await allure.story('Skip bar and proceed to summary');
      await allure.description(
        'Clicks the skip button on the Bar page and verifies the user is navigated to the Purchase Summary page. This is the fastest path through the booking flow.'
      );

      await barPage.skipBar();
      await assertions.expectNavigatedToSummary();
    }
  );

  test(
    'Bar · Menu · MENUS tab accessible with menu cards',
    { tag: ['@praetor', '@bar', '@cinesa', '@regression'] },
    async ({ barPage }) => {
      await allure.story('MENUS tab displays menu items');

      await barPage.handleBarModal();
      await barPage.handleGaliciaModal();
      await assertions.expectMenusTabAccessible();

      await barPage.selectMenusTab();
      await assertions.expectMenuItemsVisible();

      const names = await barPage.getMenuItemNames();
      await allure.parameter('Menu items', names.join(', '));
      expect(names.length).toBeGreaterThan(0);
    }
  );

  test(
    'Bar · Menu · Select classic menu and proceed',
    { tag: ['@praetor', '@bar', '@cinesa', '@e2e'] },
    async ({ barPage }) => {
      await allure.story('Select classic menu and continue to summary');
      await allure.description(
        'Selects the Classic Menu combo from the food menu, adds it to the order, and verifies navigation to the Purchase Summary. Tests the full food ordering sub-flow.'
      );

      await barPage.buyClassicMenu();
      await assertions.expectNavigatedToSummary();
    }
  );
});
