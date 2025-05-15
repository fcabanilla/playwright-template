import { Page } from '@playwright/test';
import { SEAT_PICKER_SELECTORS } from '../../../pageObjectsManagers/cinesa/seatPicker/seatPicker.selectors';
import { Seat } from '../../../pageObjectsManagers/cinesa/seatPicker/seatPicker.page';

/**
 * Asserts that the red warning message is displayed.
 */
export async function assertWarningMessageDisplayed(page: Page): Promise<void> {
  const warningMessage = page.locator(SEAT_PICKER_SELECTORS.warningMessage);
  await warningMessage.waitFor({ state: 'visible', timeout: 5000 });
  if (!(await warningMessage.isVisible())) {
    throw new Error('Red warning message is not displayed');
  }
}

/**
 * Asserts that the red warning message is NOT displayed.
 */
export async function assertWarningMessageNotDisplayed(page: Page): Promise<void> {
  const warningMessage = page.locator(SEAT_PICKER_SELECTORS.warningMessage);
  const isVisible = await warningMessage.isVisible();
  if (isVisible) {
    throw new Error('Red warning message is displayed when it should not be');
  }
}

/**
 * Asserts that the "Continuar" button is disabled.
 */
export async function assertConfirmButtonDisabled(page: Page): Promise<void> {
  const confirmButton = page.locator(SEAT_PICKER_SELECTORS.confirmSeatsButton);
  const isDisabled = await confirmButton.getAttribute('disabled');
  if (isDisabled === null) {
    throw new Error('"Continuar" button is not disabled');
  }
}

/**
 * Asserts that the "Continuar" button is enabled.
 */
export async function assertConfirmButtonEnabled(page: Page): Promise<void> {
  const confirmButton = page.locator(SEAT_PICKER_SELECTORS.confirmSeatsButton);
  if (!(await confirmButton.isEnabled())) {
    throw new Error('"Continuar" button is not enabled');
  }
}

/**
 * Asserts that the first N seats are deselected.
 */
export async function assertFirstSeatsDeselected(seats: Seat[]): Promise<void> {
  const extraSeatsToTest = 3; // Number of extra seats to test
  const seatsToDeselect = extraSeatsToTest; // First N seats to check for deselection
  for (let i = 0; i < seatsToDeselect; i++) {
    if (seats[i].seatState !== 'available') {
      throw new Error(`Seat [Row ${seats[i].row}, Seat ${seats[i].seatNumber}] should be deselected`);
    }
  }
}

/**
 * Asserts that the last N seats are selected.
 */
export async function assertLastSeatsSelected(seats: Seat[]): Promise<void> {
  const seatsToSelect = 3; // Last N seats to check for selection
  for (let i = seats.length - seatsToSelect; i < seats.length; i++) {
    if (seats[i].seatState !== 'selected') {
      throw new Error(`Seat [Row ${seats[i].row}, Seat ${seats[i].seatNumber}] should be selected`);
    }
  }
}
