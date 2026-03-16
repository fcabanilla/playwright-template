/**
 * Standardized Allure step helpers for consistent reporting.
 * Implements ADR-0015 taxonomy: [NAV], [ACT], [WAIT], [ASSERT], [DATA]
 *
 * @see docs/adrs/0015-standardize-allure-steps-in-webActions.md
 */

import { allure } from 'allure-playwright';

/**
 * Wrapper around allure.step with type safety.
 * Centralizes all Allure step creation for consistency.
 *
 * @param title - Step title following taxonomy: [PREFIX] Verb | Target=key | Extra=value
 * @param fn - Async function to execute within the step
 * @returns Result of the function execution
 *
 * @example
 * ```typescript
 * await step('[ACT] Click | Target=loginButton', async () => {
 *   await page.click('#login');
 * });
 * ```
 */
export async function step<T>(title: string, fn: () => Promise<T>): Promise<T> {
  return allure.step(title, fn);
}

/**
 * Masks sensitive values for security, keeping only the last N characters.
 * Used for passwords, credit cards, and other sensitive data in Allure reports.
 *
 * @param value - Value to mask
 * @param keepEnd - Number of characters to keep at the end (default: 4)
 * @returns Masked string with bullet points
 *
 * @example
 * ```typescript
 * mask('password123')        // → '••••••••d123'
 * mask('4532123456789012', 4) // → '••••••••••••9012'
 * mask('short', 10)          // → 'short' (no masking if value shorter than keepEnd)
 * ```
 */
export function mask(value: string, keepEnd = 4): string {
  if (!value || value.length <= keepEnd) {
    return value;
  }
  const tail = value.slice(-keepEnd);
  return '•'.repeat(value.length - keepEnd) + tail;
}

/**
 * Truncates long strings for cleaner Allure reports.
 * Prevents parameter pollution in step logs.
 *
 * @param value - Value to truncate
 * @param maxLength - Maximum length before truncation (default: 80)
 * @returns Truncated string with ellipsis if needed
 *
 * @example
 * ```typescript
 * truncate('Long text...', 10) // → 'Long text…'
 * ```
 */
export function truncate(value: string, maxLength = 80): string {
  if (!value || value.length <= maxLength) {
    return value;
  }
  return value.slice(0, maxLength) + '…';
}
