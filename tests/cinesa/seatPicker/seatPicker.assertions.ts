import { Page, expect } from '@playwright/test';
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
export async function assertWarningMessageNotDisplayed(page: Page): Promise<void> {
  const warningMessage = page.locator(SEAT_PICKER_SELECTORS.warningMessage);
  await expect(warningMessage).not.toBeVisible();
}

/**
 * Asserts that the "Continuar" button is disabled.
 * @param page Playwright Page object.
 */
export async function assertConfirmButtonDisabled(page: Page): Promise<void> {
  const confirmButton = page.locator(SEAT_PICKER_SELECTORS.confirmSeatsButton);
  await expect(confirmButton).toBeDisabled();
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
 * Asserts that the first N seats are deselected (state is 'available').
 * @param seats Array of Seat objects.
 */
export async function assertFirstSeatsDeselected(seats: Seat[]): Promise<void> {
  const extraSeatsToTest = 3; // Number of extra seats to test
  const seatsToDeselect = extraSeatsToTest; // First N seats to check for deselection
  for (let i = 0; i < seatsToDeselect; i++) {
    await expect(
      seats[i].seatState,
      `Seat [Row ${seats[i].row}, Seat ${seats[i].seatNumber}] should be deselected`
    ).toBe('available');
  }
}

/**
 * Asserts that the last N seats are selected (state is 'selected').
 * @param seats Array of Seat objects.
 */
export async function assertLastSeatsSelected(seats: Seat[]): Promise<void> {
  const seatsToSelect = 3; // Last N seats to check for selection
  for (let i = seats.length - seatsToSelect; i < seats.length; i++) {
    await expect(
      seats[i].seatState,
      `Seat [Row ${seats[i].row}, Seat ${seats[i].seatNumber}] should be selected`
    ).toBe('selected');
  }
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
    /.*Luxe$/,           // Any ticket ending with "Luxe"
    /.*D-BOX$/,          // Any ticket ending with "D-BOX"
    /.*Sofa$/,           // Any ticket ending with "Sofa"
    /Bonificada Senior/, // Senior discount tickets
    /Fiesta del cine/,   // Festival tickets
    /^-?Normal/,         // Normal tickets
    /^-?Menores/,        // Children tickets
    /^-?Carnet Joven/,   // Youth card tickets
    /^-?Estudiante/,     // Student tickets
    /^-?Paro/,           // Unemployed tickets
    /^-?Discapacitado/,  // Disability tickets
    /^-?Familia Numerosa/, // Large family tickets
  ];

  for (const name of ticketTypeNames) {
    const isValidPattern = validTicketPatterns.some(pattern => pattern.test(name));
    
    if (!isValidPattern) {
      // If it doesn't match a pattern, check the old logic as fallback
      const found = ticketTypeMappings.some(mapping =>
        mapping.expectedTicketText.some(expectedText =>
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
