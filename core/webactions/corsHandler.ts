/**
 * CORS Handler for LAB Environment
 * 
 * This module provides utilities to handle CORS issues in the LAB environment.
 * The LAB API has strict CORS policies that reject certain headers sent by Playwright,
 * specifically 'cache-control' and 'pragma' headers.
 * 
 * Usage:
 * - Call setupCorsHandlerForLab(page) at the beginning of any test that needs to work in LAB
 * - This will intercept all requests and remove problematic headers
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */

import { Page } from '@playwright/test';

/**
 * Sets up a route handler to remove CORS-problematic headers for LAB environment.
 * 
 * The LAB environment's API (lab-vwc.ocgtest.es) has strict CORS policies that
 * reject requests containing certain headers that Playwright automatically adds.
 * This function intercepts all requests and removes those headers.
 * 
 * Headers removed:
 * - cache-control: Causes CORS preflight failures in LAB
 * - pragma: Additional caching header that may cause issues
 * 
 * @param page - The Playwright Page object
 * @returns Promise that resolves when the route handler is set up
 * 
 * @example
 * ```typescript
 * test('My test', async ({ page }) => {
 *   await setupCorsHandlerForLab(page);
 *   // Rest of your test...
 * });
 * ```
 */
export async function setupCorsHandlerForLab(page: Page): Promise<void> {
  await page.route('**/*', async (route) => {
    const request = route.request();
    const headers = { ...request.headers() };

    // Remove headers that cause CORS issues with LAB API
    delete headers['cache-control'];
    delete headers['pragma'];

    await route.continue({ headers });
  });
}

/**
 * Checks if CORS handler should be applied based on environment.
 * 
 * @returns true if current environment is LAB
 */
export function shouldApplyCorsHandler(): boolean {
  return process.env.TEST_ENV === 'lab';
}

/**
 * Conditionally sets up CORS handler only if running in LAB environment.
 * 
 * @param page - The Playwright Page object
 * @returns Promise that resolves when setup is complete (or immediately if not LAB)
 * 
 * @example
 * ```typescript
 * test('My test', async ({ page }) => {
 *   await setupCorsHandlerIfNeeded(page);
 *   // Test will work in all environments
 * });
 * ```
 */
export async function setupCorsHandlerIfNeeded(page: Page): Promise<void> {
  if (shouldApplyCorsHandler()) {
    await setupCorsHandlerForLab(page);
  }
}
