import { expect, Page, Locator } from '@playwright/test';
import { allure } from 'allure-playwright';
import { CorsHandler } from './corsHandler';

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
 * - Allure 2 step integration for enhanced reporting
 *
 * @example
 * ```typescript
 * const webActions = new WebActions(page);
 * await webActions.clickWithOverlayHandling('.movie-button', 'Click on movie button');
 * const isVisible = await webActions.isVisible('.navbar');
 * ```
 *
 * @since 1.0.0
 * @author UCI Automation Team
 */
export class WebActions {
  readonly page: Page;
  private corsHandler: CorsHandler;

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
    this.corsHandler = new CorsHandler(page);
    // Initialize CORS handling automatically
    this.initializeCorsHandling();
  }

  /**
   * Gets the underlying Page instance for assertions that require direct Page access.
   * This is allowed in ADR-0009 for test assertions only.
   */
  getPage(): Page {
    return this.page;
  }

  /**
   * Updates the page context to a new page (used for handling new tabs/windows).
   * This method allows continuing the same WebActions instance with a different page context.
   *
   * @param {Page} newPage - The new page to switch context to
   *
   * @example
   * ```typescript
   * // Handle new tab opening
   * const pagePromise = page.context().waitForEvent('page');
   * await button.click(); // Action that opens new tab
   * const newTab = await pagePromise;
   * webActions.updatePage(newTab);
   * ```
   *
   * @since 1.1.0
   */
  updatePage(newPage: Page): void {
    (this as any).page = newPage;
    this.corsHandler = new CorsHandler(newPage);
    this.initializeCorsHandling();
  }

  /**
   * Initialize CORS handling automatically for all WebActions instances
   */
  private async initializeCorsHandling(): Promise<void> {
    try {
      await this.corsHandler.initialize();
    } catch (error) {
      // CORS handler initialization is optional
    }
  }

  /**
   * Navigates to the specified URL using standard Playwright navigation.
   *
   * @param {string} url - The target URL to navigate to
   * @param {string} stepMessage - Optional custom message for Allure report step
   * @returns {Promise<void>} Resolves when navigation is complete
   *
   * @throws {Error} When navigation fails or times out
   *
   * @example
   * ```typescript
   * await webActions.navigateTo('https://www.ucicinemas.it/about', 'Navigate to About page');
   * ```
   *
   * @since 1.0.0
   */
  async navigateTo(url: string, stepMessage?: string): Promise<void> {
    const message = stepMessage || `Navigate to ${url}`;
    await allure.step(message, async () => {
      // Only essential parameters: URL and Environment
      await allure.parameter('URL', url);
      await allure.parameter(
        'Environment',
        process.env.TEST_ENV || 'production'
      );
      await this.page.goto(url);
    });
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
   * @param {string} stepMessage - Optional custom message for Allure report step
   * @returns {Promise<void>} Resolves when click action is complete
   *
   * @throws {Error} When element is not found or not clickable
   *
   * @example
   * ```typescript
   * await webActions.click('.movie-card[data-id="123"]', 'Click on movie card');
   * ```
   *
   * @since 1.0.0
   */
  async click(selector: string, stepMessage?: string): Promise<void> {
    const message = stepMessage || `Click on ${selector}`;
    await allure.step(message, async () => {
      // Selector already in step message, no need to duplicate as parameter
      await this.page.locator(selector).click();
    });
  }

  /**
   * Performs a click action with intelligent overlay detection and handling.
   * Automatically detects and attempts to close common overlays (modals, dropdowns, etc.)
   * that might intercept click events. Uses force click as fallback strategy.
   *
   * @param {string} selector - CSS selector for the target element
   * @param {string} stepMessage - Optional custom message for Allure report step
   * @returns {Promise<void>} Resolves when click action is complete and overlays are handled
   *
   * @throws {Error} When element is not found after overlay handling
   *
   * @example
   * ```typescript
   * // Will handle promotional modals, cookie banners, etc. automatically
   * await webActions.clickWithOverlayHandling('.navbar-cinemas', 'Click on Cinemas menu');
   * ```
   *
   * @since 1.0.0
   */
  async clickWithOverlayHandling(
    selector: string,
    stepMessage?: string
  ): Promise<void> {
    const message = stepMessage || `Click ${selector} (with overlay handling)`;
    await allure.step(message, async () => {
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
    });
  }

  /**
   * Click on an element and wait for it to be actionable
   *
   * @param {string} selector - CSS selector for the target element
   * @param {string} stepMessage - Optional custom message for Allure report step
   */
  async clickAndWait(selector: string, stepMessage?: string): Promise<void> {
    const message = stepMessage || `Click ${selector} and wait for load`;
    await allure.step(message, async () => {
      await this.page.locator(selector).click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  /**
   * Fill text into an input field
   *
   * @param {string} selector - CSS selector for the input field
   * @param {string} text - Text to fill
   * @param {string} stepMessage - Optional custom message for Allure report step
   */
  async fill(
    selector: string,
    text: string,
    stepMessage?: string
  ): Promise<void> {
    const message = stepMessage || `Fill ${selector} with text`;
    await allure.step(message, async () => {
      // Only show value for important fields, masked by default for security
      if (stepMessage && !stepMessage.toLowerCase().includes('password')) {
        await allure.parameter('Value', text);
      }
      await this.page.locator(selector).fill(text);
    });
  }

  /**
   * Get text content from an element
   */
  async getText(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent()) || '';
  }

  /**
   * Get the value of an input field
   */
  async getInputValue(selector: string): Promise<string> {
    return await this.page.locator(selector).inputValue();
  }

  /**
   * Check if an element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Wait for an element to be visible
   *
   * @param {string} selector - CSS selector for the element
   * @param {number} timeout - Optional timeout in milliseconds
   * @param {string} stepMessage - Optional custom message for Allure report step
   */
  async waitForVisible(
    selector: string,
    timeout?: number,
    stepMessage?: string
  ): Promise<void> {
    const message = stepMessage || `Wait for ${selector} to be visible`;
    await allure.step(message, async () => {
      try {
        await this.page.locator(selector).waitFor({
          state: 'visible',
          timeout: timeout || 30000,
        });
      } catch (error) {
        // Handle page closure gracefully - common in production environment
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage?.includes('Target page, context or browser has been closed')) {
          throw new Error(`Page was closed while waiting for ${selector}. This may indicate navigation/redirect in production environment.`);
        }
        throw error;
      }
    });
  }

  /**
   * Get the count of elements matching a selector
   */
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Hover over an element
   *
   * @param {string} selector - CSS selector for the element
   * @param {string} stepMessage - Optional custom message for Allure report step
   */
  async hover(selector: string, stepMessage?: string): Promise<void> {
    const message = stepMessage || `Hover over ${selector}`;
    await allure.step(message, async () => {
      await this.page.locator(selector).hover();
    });
  }

  /**
   * Wait for page to load
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for a specific load state
   * @param state - The load state to wait for: 'load' | 'domcontentloaded' | 'networkidle'
   */
  async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle'
  ): Promise<void> {
    await this.page.waitForLoadState(state);
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

  /**
   * Add script to be evaluated before page loads.
   * Used for advanced analytics and browser instrumentation.
   *
   * @param script - Function to be executed in browser context before page load
   *
   * @example
   * ```typescript
   * await webActions.addInitScript(() => {
   *   window.dataLayer = window.dataLayer || [];
   * });
   * ```
   *
   * @since 1.1.0
   */
  async addInitScript(script: () => unknown | string): Promise<void> {
    await this.page.addInitScript(script);
  }

  /**
   * Execute JavaScript code in the browser context and return the result.
   * Used for advanced DOM manipulation and data extraction.
   *
   * @param script - Function to be executed in browser context
   * @param arg - Optional argument to pass to the script
   * @returns Result returned by the script
   *
   * @example
   * ```typescript
   * const events = await webActions.evaluate(() => {
   *   return window.dataLayer || [];
   * });
   * ```
   *
   * @since 1.1.0
   */
  async evaluate<T>(
    script: (arg?: unknown) => T | Promise<T>,
    arg?: unknown
  ): Promise<T> {
    return await this.page.evaluate(script, arg);
  }

  /**
   * Wait for element to be available in DOM with selector
   */
  async waitForSelector(
    selector: string,
    options?: {
      timeout?: number;
      state?: 'attached' | 'detached' | 'visible' | 'hidden';
    }
  ): Promise<void> {
    await this.page.waitForSelector(selector, {
      timeout: options?.timeout,
      state: options?.state || 'visible',
    });
  }

  /**
   * Get a locator for the given selector
   */
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Navigate back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Get all elements matching the selector
   */
  async getAllElements(selector: string): Promise<Locator[]> {
    const elements = await this.page.locator(selector).all();
    return elements;
  }

  /**
   * Scroll element into view if needed
   */
  async scrollIntoView(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Handle PDF link interactions that may result in download or popup
   * Sets up event listeners before executing click action
   *
   * @param clickAction - Function that performs the click
   * @returns Object with download or popup (one will be null)
   */
  async handlePDFInteraction(
    clickAction: () => Promise<void>
  ): Promise<{ download: any | null; popup: Page | null }> {
    // Set up event listeners before clicking
    const downloadPromise = this.page
      .waitForEvent('download')
      .catch(() => null);
    const popupPromise = this.page
      .context()
      .waitForEvent('page')
      .catch(() => null);

    // Execute the click action
    const clickPromise = clickAction();

    // Wait for all promises to resolve
    const [download, popup] = await Promise.all([
      downloadPromise,
      popupPromise,
      clickPromise,
    ]);

    return { download, popup };
  }
}
