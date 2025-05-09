import { Page } from '@playwright/test';
import { SEAT_PICKER_SELECTORS } from '../../../pageObjectsManagers/cinesa/seatPicker/seatPicker.selectors';

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
