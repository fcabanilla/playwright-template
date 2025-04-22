import { expect } from '@playwright/test';

/**
 * Asserts that the ticket count matches the expected value.
 *
 * @param actualCount - The actual ticket count retrieved from the input field
 * @param expectedCount - The expected ticket count
 */
export async function assertTicketCount(actualCount: number, expectedCount: number): Promise<void> {
  await expect(actualCount).toBe(expectedCount);
}
