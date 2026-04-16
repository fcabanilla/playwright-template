import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { SEAT_PICKER_SELECTORS } from '../../../pageObjectsManagers/cinesa/seatPicker/seatPicker.selectors';
import { Seat } from '../../../pageObjectsManagers/cinesa/seatPicker/seatPicker.page';

/**
 * Asserts that the red warning message is displayed.
 * @param page Playwright Page object.
 */
export async function assertWarningMessageDisplayed(page: Page): Promise<void> {
  const warningMessage = page.locator(SEAT_PICKER_SELECTORS.warningMessage);
  await expect(warningMessage).toBeVisible({ timeout: 5000 });
}

/**
 * Asserts that the red warning message is NOT displayed.
 * @param page Playwright Page object.
 */
export async function assertWarningMessageNotDisplayed(
  page: Page
): Promise<void> {
  const warningMessage = page.locator(SEAT_PICKER_SELECTORS.warningMessage);
  await expect(warningMessage).not.toBeVisible();
}

/**
 * Asserts that the "Continuar" button is disabled.
 * @param page Playwright Page object.
 */
export async function assertConfirmButtonDisabled(page: Page): Promise<void> {
  const confirmButton = page.locator(SEAT_PICKER_SELECTORS.confirmSeatsButton);
  await expect(confirmButton).toBeDisabled({ timeout: 15000 });
}

/**
 * Asserts that the "Continuar" button is enabled.
 * @param page Playwright Page object.
 */
export async function assertConfirmButtonEnabled(page: Page): Promise<void> {
  const confirmButton = page.locator(SEAT_PICKER_SELECTORS.confirmSeatsButton);
  await expect(confirmButton).toBeEnabled();
}

/**
 * Asserts that the first N seats (overflow) are deselected (state is 'available').
 * Dynamically determines how many seats should be deselected from the actual seat states
 * rather than hardcoding a count — works for any room max (standard=9, IMAX=12, etc.).
 * @param seats Array of Seat objects returned by selectMoreThanMaxSeats().
 */
export async function assertFirstSeatsDeselected(seats: Seat[]): Promise<void> {
  await allure.step('Verify first seats were FIFO-deselected', async () => {
    // Count deselected seats from the front (FIFO order)
    const deselectedCount = seats.filter(
      (s) => s.seatState === 'available'
    ).length;

    // At least 1 seat must have been deselected by the FIFO overflow
    expect(
      deselectedCount,
      `Expected at least 1 seat to be deselected by FIFO overflow, but found ${deselectedCount}`
    ).toBeGreaterThan(0);

    // Verify the deselected seats are at the START of the array (FIFO order)
    for (let i = 0; i < deselectedCount; i++) {
      expect(
        seats[i].seatState,
        `Seat [Row ${seats[i].row}, Seat ${seats[i].seatNumber}] at position ${i} should be deselected (FIFO)`
      ).toBe('available');
    }
  });
}

/**
 * Asserts that the last N seats remain selected after FIFO overflow.
 * Dynamically determines which seats should be selected based on actual states.
 * @param seats Array of Seat objects returned by selectMoreThanMaxSeats().
 */
export async function assertLastSeatsSelected(seats: Seat[]): Promise<void> {
  await allure.step('Verify last seats remain selected', async () => {
    const deselectedCount = seats.filter(
      (s) => s.seatState === 'available'
    ).length;

    // All seats after the deselected ones should be 'selected'
    for (let i = deselectedCount; i < seats.length; i++) {
      expect(
        seats[i].seatState,
        `Seat [Row ${seats[i].row}, Seat ${seats[i].seatNumber}] at position ${i} should be selected`
      ).toBe('selected');
    }
  });
}

/**
 * Asserts that all ticketTypeNames are valid ticket types based on common patterns.
 * @param ticketTypeNames List of ticket type names retrieved from the UI.
 * @param ticketTypeMappings List of mappings with expected texts.
 */
export function assertTicketTypeNamesMatchExpectedTexts(
  ticketTypeNames: string[],
  ticketTypeMappings: { expectedTicketText: string[] }[]
): void {
  // Common ticket type patterns that should be valid
  const validTicketPatterns = [
    /.*Luxe$/, // Any ticket ending with "Luxe"
    /.*D-?BOX$/, // Any ticket ending with "D-BOX" or "DBOX"
    /.*Sofa$/, // Any ticket ending with "Sofa"
    /VIP Bed/, // VIP Bed premium seats
    /LUXE Premium/, // LUXE Premium seats
    /LUXE Plus/, // LUXE Plus seats
    /Recliner Extra/, // Recliner Extra seats
    /Bonificada Senior/, // Senior discount tickets
    /Fiesta del cine/, // Festival tickets
    /Dimecres al Cinema/, // Wednesday cinema promo (Catalan)
    /^-?Normal/, // Normal tickets
    /^-?Menores/, // Children tickets
    /^-?Carnet Joven/, // Youth card tickets
    /^-?Estudiante/, // Student tickets
    /^-?Paro/, // Unemployed tickets
    /^-?Discapacitado/, // Disability tickets
    /^-?Familia Numerosa/, // Large family tickets
    /^-?Precio MyCinesa/, // MyCinesa loyalty program discount tickets
    /^-?Pack Familia/, // Family pack tickets
    /^-?Mayores \d+/, // Senior tickets (age-based)
    /^-?Adulto/, // Adult base ticket (preprod)
    /^-?Infantil/, // Children base ticket (preprod)
    /^-?Adult$/i, // English ticket name (Lab environment)
  ];

  for (const name of ticketTypeNames) {
    const isValidPattern = validTicketPatterns.some((pattern) =>
      pattern.test(name)
    );

    if (!isValidPattern) {
      // If it doesn't match a pattern, check the old logic as fallback
      const found = ticketTypeMappings.some((mapping) =>
        mapping.expectedTicketText.some((expectedText) =>
          name.includes(expectedText)
        )
      );
      expect(
        found,
        `The ticketTypeName "${name}" is not a valid ticket type pattern and is not included in the mappings`
      ).toBeTruthy();
    }
  }
}
