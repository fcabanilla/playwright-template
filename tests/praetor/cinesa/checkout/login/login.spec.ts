/**
 * PRAETOR Login tests — Wave 1.
 *
 * Validates login/guest checkout step after seat selection.
 * MCP-verified DOM structure and selectors.
 */
import { test } from '../../../../../fixtures/praetor/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import {
  COMPONENT_SHOWTIMES,
  checkoutBaseUrl,
} from '../seatPicker/seatPicker.data';

test.describe('PRAETOR · Login · Oasiz Preprod', () => {
  test.beforeEach(async ({ page, seatPicker }, testInfo) => {
    await allure.epic('PRAETOR Checkout');
    await allure.feature('Authentication - User Access');
    await enrichTestMetadata(testInfo);

    // Navigate through seat picker to reach login
    await seatPicker.navigateToShowtime(checkoutBaseUrl, COMPONENT_SHOWTIMES.login);
    await seatPicker.dismissBlockingModals();
    await seatPicker.selectFirstAvailableSeat();
    await seatPicker.confirmSeats();

    // Wait for login page
    await page.waitForURL('**/compra/inicio-de-sesion/**', { timeout: 15000, waitUntil: 'domcontentloaded' });
  });

  test(
    'Login · Visibility · Display login sections',
    { tag: ['@praetor', '@login', '@cinesa', '@smoke'] },
    async ({ loginPage }) => {
      await allure.story('Display login, register and guest sections');

      await loginPage.waitForLoginPage();

      const loginVisible = await loginPage.isLoginFormVisible();
      const guestVisible = await loginPage.isGuestCheckoutVisible();
      const registerVisible = await loginPage.isRegisterButtonVisible();

      test.expect(loginVisible).toBe(true);
      test.expect(guestVisible).toBe(true);
      test.expect(registerVisible).toBe(true);
    }
  );

  test(
    'Login · Guest · Continue as guest proceeds to next step',
    { tag: ['@praetor', '@login', '@cinesa', '@e2e', '@critical'] },
    async ({ page, loginPage }) => {
      await allure.story('Guest checkout advances to ticket picker');

      await loginPage.waitForLoginPage();
      await loginPage.continueAsGuest();

      // After guest checkout, should proceed past login (to ticket picker or next step)
      await page.waitForURL(
        (url: URL) => !url.pathname.includes('/inicio-de-sesion/'),
        {
          timeout: 15000,
          waitUntil: 'domcontentloaded',
        }
      );
      test.expect(page.url()).not.toContain('/inicio-de-sesion/');
    }
  );
});
