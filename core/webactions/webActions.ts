import { expect } from '@playwright/test';

type Page = any;
type Locator = any;

/**
 * WebActions provides a unified, abstracted interface for all Playwright browser interactions.
 * This is the ONLY layer that should directly access the Playwright API, ensuring consistency
 * and maintainability across the entire test automation framework.
 *
 * Features:
 * - Overlay and modal management
 * - Robust element interaction with wait strategies
 * - Screenshot and debugging capabilities
 * - Consistent error handling and reporting
 *
 * @example
 * ```typescript
 * const webActions = new WebActions(page);
 * await webActions.clickWithOverlayHandling('.movie-button');
 * const isVisible = await webActions.isVisible('.navbar');
 * ```
 *
 * @since 1.0.0
 * @author UCI Automation Team
 */
export class WebActions {
  readonly page: Page;

  /**
   * Creates a new WebActions instance with the provided page context.
   *
   * @param {Page} page - Playwright Page object for browser interactions
   *
   * @example
   * ```typescript
   * const webActions = new WebActions(page);
   * ```
   *
   * @since 1.0.0
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the specified URL using standard Playwright navigation.
   *
   * @param {string} url - The target URL to navigate to
   * @returns {Promise<void>} Resolves when navigation is complete
   *
   * @throws {Error} When navigation fails or times out
   *
   * @example
   * ```typescript
   * await webActions.navigateTo('https://www.ucicinemas.it/about');
   * ```
   *
   * @since 1.0.0
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Navigates to a URL with comprehensive Cloudflare protection handling.
   * Implements anti-detection measures and bypass strategies for protected sites.
   * Should be used for the initial navigation to UCI Cinemas website.
   *
   * @param {string} url - The target URL with potential Cloudflare protection
   * @returns {Promise<boolean>} True if navigation successful, false if Cloudflare bypass failed
   *
   * @example
   * ```typescript
   * const success = await webActions.navigateToWithCloudflareHandling('https://www.ucicinemas.it');
   * if (!success) {
   *   throw new Error('Failed to bypass Cloudflare protection');
   * }
   * ```
   *
   * @since 1.0.0
   */

  /**
   * Performs a standard click action on an element identified by CSS selector.
   * For elements that might be blocked by overlays, use clickWithOverlayHandling instead.
   *
   * @param {string} selector - CSS selector for the target element
   * @returns {Promise<void>} Resolves when click action is complete
   *
   * @throws {Error} When element is not found or not clickable
   *
   * @example
   * ```typescript
   * await webActions.click('.movie-card[data-id="123"]');
   * ```
   *
   * @since 1.0.0
   */
  async click(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Performs a click action with intelligent overlay detection and handling.
   * Automatically detects and attempts to close common overlays (modals, dropdowns, etc.)
   * that might intercept click events. Uses force click as fallback strategy.
   *
   * @param {string} selector - CSS selector for the target element
   * @returns {Promise<void>} Resolves when click action is complete and overlays are handled
   *
   * @throws {Error} When element is not found after overlay handling
   *
   * @example
   * ```typescript
   * // Will handle promotional modals, cookie banners, etc. automatically
   * await webActions.clickWithOverlayHandling('.navbar-cinemas');
   * ```
   *
   * @since 1.0.0
   */
  async clickWithOverlayHandling(selector: string): Promise<void> {
    // Wait for element to be visible first
    await this.page.locator(selector).waitFor({ state: 'visible' });

    // Check for common overlays that might intercept clicks
    const overlaySelectors = [
      '.bg-blue-1\\/80',
      '[class*="fixed"][class*="z-"]',
      '.modal-backdrop',
      '.overlay',
      '[role="dialog"]',
    ];

    for (const overlaySelector of overlaySelectors) {
      try {
        const overlay = this.page.locator(overlaySelector).first();
        if (await overlay.isVisible({ timeout: 1000 })) {
          console.log(
            `Detected overlay: ${overlaySelector}, attempting to close...`
          );
          // Try clicking the overlay to close it
          await overlay.click({ timeout: 2000 });
          await this.page.waitForTimeout(1000);
        }
      } catch {
        // Continue if overlay selector doesn't exist or can't be clicked
      }
    }

    // Now try to click the target element
    await this.page.locator(selector).click({ force: true });
  }

  /**
   * Click on an element and wait for it to be actionable
   */
  async clickAndWait(selector: string): Promise<void> {
    await this.page.locator(selector).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill text into an input field
   */
  async fill(selector: string, text: string): Promise<void> {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Get text content from an element
   */
  async getText(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent()) || '';
  }

  /**
   * Check if an element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Wait for an element to be visible
   */
  async waitForVisible(selector: string, timeout?: number): Promise<void> {
    await this.page.locator(selector).waitFor({
      state: 'visible',
      timeout: timeout || 30000,
    });
  }

  /**
   * Get the current page URL
   *
   * @returns {string} The current page URL
   *
   * @example
   * ```typescript
   * const currentUrl = webActions.getCurrentUrl();
   * console.log(`Current page: ${currentUrl}`);
   * ```
   *
   * @since 1.1.0
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Execute JavaScript code in the browser context
   *
   * @template T - The return type of the evaluation
   * @param {Function | string} script - JavaScript function or code to execute
   * @returns {Promise<T>} The result of the script execution
   *
   * @example
   * ```typescript
   * // Get browser fingerprint
   * const fingerprint = await webActions.evaluateScript(() => {
   *   return {
   *     userAgent: navigator.userAgent,
   *     platform: navigator.platform,
   *     languages: Array.from(navigator.languages),
   *   };
   * });
   * ```
   *
   * @since 1.1.0
   */
  async evaluateScript<T>(script: () => T | Promise<T>): Promise<T> {
    return await this.page.evaluate(script);
  }

  /**
   * Get the count of elements matching a selector
   */
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Hover over an element
   */
  async hover(selector: string): Promise<void> {
    await this.page.locator(selector).hover();
  }

  /**
   * Wait for page to load
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for a page function to return truthy.
   * @param fn
   * @param arg
   * @param timeout
   */
  async waitForFunction(
    fn: Function | string,
    arg?: any,
    timeout?: number
  ): Promise<void> {
    await this.page.waitForFunction(fn as any, arg, {
      timeout: timeout || 30000,
    });
  }

  /**
   * Wait for a network response matching a predicate.
   */
  async waitForResponse(
    predicate: (response: any) => boolean,
    timeout?: number
  ): Promise<void> {
    await this.page.waitForResponse(predicate as any, {
      timeout: timeout || 30000,
    });
  }

  /**
   * Expect page to have URL
   */
  async expectUrl(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  /**
   * Expect element to be visible
   */
  async expectVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Expect element to have text
   */
  async expectText(selector: string, expectedText: string): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(expectedText);
  }

  /**
   * Get a locator for an element
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Take a screenshot
   */
  async screenshot(path?: string): Promise<Buffer> {
    return await this.page.screenshot({ path });
  }

  /**
   * Wait for a specific time
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }
}
