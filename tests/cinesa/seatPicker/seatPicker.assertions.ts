import { Page } from '@playwright/test';
import { SEAT_PICKER_SELECTORS } from '../../../pageObjectsManagers/cinesa/seatPicker/seatPicker.selectors';

/**
 * Asserts that the red warning message is displayed.
 */
export async function assertWarningMessageDisplayed(page: Page): Promise<void> {
  const warningMessage = page.locator(SEAT_PICKER_SELECTORS.warningMessage);
  await warningMessage.waitFor({ state: 'visible', timeout: 5000 }); // Wait for the message to appear
  if (!(await warningMessage.isVisible())) {
    throw new Error('Red warning message is not displayed');
  }
}

/**
 * Asserts that the "Continuar" button is disabled.
 */
export async function assertConfirmButtonDisabled(page: Page): Promise<void> {
  const confirmButton = page.locator(SEAT_PICKER_SELECTORS.disabledConfirmButton);
  if (!(await confirmButton.isVisible())) {
    throw new Error('"Continuar" button is not disabled');
  }
}
