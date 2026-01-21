import { expect, Page, Locator } from '@playwright/test';
import { allure } from 'allure-playwright';
import { CorsHandler } from './corsHandler';
import { step, mask, truncate } from './steps';

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
   * Automatically creates Allure step with standardized format: [NAV] Goto | URL=...
   *
   * @param {string} url - The target URL to navigate to
   * @returns {Promise<void>} Resolves when navigation is complete
   *
   * @throws {Error} When navigation fails or times out
   *
   * @example
   * ```typescript
   * await webActions.navigateTo('https://www.ucicinemas.it/peliculas');
   * // Allure step: "[NAV] Goto | URL=/peliculas | Env=production"
   * ```
   *
   * @since 1.0.0
   */
  async navigateTo(url: string): Promise<void> {
    const env = process.env.TEST_ENV || 'production';
    const urlPath = this.extractPath(url);

    await step(`[NAV] Goto | URL=${urlPath} | Env=${env}`, async () => {
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
   * Automatically creates Allure step with standardized format: [ACT] Click | Target=...
   *
   * For elements that might be blocked by overlays, use clickWithOverlayHandling instead.
   *
   * @param {string} selector - CSS selector for the target element
   * @param {string} [targetName] - Optional logical name from selectors file (e.g., 'loginButton')
   * @returns {Promise<void>} Resolves when click action is complete
   *
   * @throws {Error} When element is not found or not clickable
   *
   * @example
   * ```typescript
   * // With logical name (preferred - from selectors file)
   * await webActions.click(this.selectors.loginButton, 'loginButton');
   * // Allure step: "[ACT] Click | Target=loginButton"
   *
   * // Without logical name (fallback to selector)
   * await webActions.click('.btn-submit');
   * // Allure step: "[ACT] Click | Target=.btn-submit"
   * ```
   *
   * @since 1.0.0
   */
  async click(selector: string, targetName?: string): Promise<void> {
    const target = targetName || selector;
    await step(`[ACT] Click | Target=${target}`, async () => {
      // Use force:true to bypass OneTrust Privacy Center modal that blocks clicks
      // even when consent cookies are loaded via storageState
      await this.page.locator(selector).click({ force: true });
    });
  }

  /**
   * Performs a click action with intelligent overlay detection and handling.
   * Automatically creates Allure step: [ACT] Click (with overlay handling) | Target=...
   *
   * Automatically detects and attempts to close common overlays (modals, dropdowns, etc.)
   * that might intercept click events. Uses force click as fallback strategy.
   *
   * @param {string} selector - CSS selector for the target element
   * @param {string} [targetName] - Optional logical name from selectors file
   * @returns {Promise<void>} Resolves when click action is complete and overlays are handled
   *
   * @throws {Error} When element is not found after overlay handling
   *
   * @example
   * ```typescript
   * // Will handle promotional modals, cookie banners, etc. automatically
   * await webActions.clickWithOverlayHandling(this.selectors.cinemas, 'cinemasButton');
   * // Allure step: "[ACT] Click (with overlay handling) | Target=cinemasButton"
   * ```
   *
   * @since 1.0.0
   */
  async clickWithOverlayHandling(
    selector: string,
    targetName?: string
  ): Promise<void> {
    const target = targetName || selector;
    await step(
      `[ACT] Click (with overlay handling) | Target=${target}`,
      async () => {
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
      }
    );
  }

  /**
   * Click on an element and wait for network to be idle.
   * Automatically creates Allure step: [ACT] Click and wait | Target=...
   *
   * @param {string} selector - CSS selector for the target element
   * @param {string} [targetName] - Optional logical name from selectors file
   * @returns {Promise<void>} Resolves when click and network idle complete
   *
   * @example
   * ```typescript
   * await webActions.clickAndWait(this.selectors.submitButton, 'submitButton');
   * // Allure step: "[ACT] Click and wait | Target=submitButton"
   * ```
   */
  async clickAndWait(selector: string, targetName?: string): Promise<void> {
    const target = targetName || selector;
    await step(`[ACT] Click and wait | Target=${target}`, async () => {
      await this.page.locator(selector).click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  /**
   * Fill text into an input field with automatic masking for sensitive data.
   * Automatically creates Allure step: [ACT] Fill | Field=... | Value=••••
   *
   * **Security:** Values are automatically masked in Allure reports by default.
   * Only the last 4 characters are visible.
   *
   * @param {string} selector - CSS selector for the input field
   * @param {string} text - Text to fill
   * @param {string} [fieldName] - Optional logical name from selectors file (e.g., 'emailInput')
   * @returns {Promise<void>} Resolves when fill is complete
   *
   * @example
   * ```typescript
   * await webActions.fill(this.selectors.emailInput, 'user@example.com', 'emailInput');
   * // Allure step: "[ACT] Fill | Field=emailInput | Value=••••••••••••.com"
   *
   * await webActions.fill(this.selectors.passwordInput, 'secret123', 'passwordInput');
   * // Allure step: "[ACT] Fill | Field=passwordInput | Value=••••••t123"
   * ```
   */
  async fill(
    selector: string,
    text: string,
    fieldName?: string
  ): Promise<void> {
    const field = fieldName || selector;
    const displayValue = mask(truncate(text, 80));

    await step(
      `[ACT] Fill | Field=${field} | Value=${displayValue}`,
      async () => {
        await this.page.locator(selector).fill(text);
      }
    );
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
   * Wait for an element to be visible.
   * Automatically creates Allure step: [WAIT] Visible | Target=... | Timeout=...
   *
   * @param {string} selector - CSS selector for the element
   * @param {number} [timeout] - Optional timeout in milliseconds (default: 30000)
   * @param {string} [targetName] - Optional logical name from selectors file
   * @returns {Promise<void>} Resolves when element is visible
   *
   * @throws {Error} When element is not visible within timeout or page closes
   *
   * @example
   * ```typescript
   * await webActions.waitForVisible(this.selectors.movieCard, 10000, 'movieCard');
   * // Allure step: "[WAIT] Visible | Target=movieCard | Timeout=10.0s"
   * ```
   */
  async waitForVisible(
    selector: string,
    timeout?: number,
    targetName?: string
  ): Promise<void> {
    const target = targetName || selector;
    const timeoutMs = timeout || 30000;
    const timeoutSec = (timeoutMs / 1000).toFixed(1);

    await step(
      `[WAIT] Visible | Target=${target} | Timeout=${timeoutSec}s`,
      async () => {
        try {
          await this.page.locator(selector).waitFor({
            state: 'visible',
            timeout: timeoutMs,
          });
        } catch (error) {
          // Handle page closure gracefully - common in production environment
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          if (
            errorMessage?.includes(
              'Target page, context or browser has been closed'
            )
          ) {
            throw new Error(
              `Page was closed while waiting for ${target}. This may indicate navigation/redirect in production environment.`
            );
          }
          throw error;
        }
      }
    );
  }

  /**
   * Get the count of elements matching a selector
   */
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Hover over an element.
   * Automatically creates Allure step: [ACT] Hover | Target=...
   *
   * @param {string} selector - CSS selector for the element
   * @param {string} [targetName] - Optional logical name from selectors file
   * @returns {Promise<void>} Resolves when hover is complete
   *
   * @example
   * ```typescript
   * await webActions.hover(this.selectors.menuItem, 'menuItem');
   * // Allure step: "[ACT] Hover | Target=menuItem"
   * ```
   */
  async hover(selector: string, targetName?: string): Promise<void> {
    const target = targetName || selector;
    await step(`[ACT] Hover | Target=${target}`, async () => {
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

  /**
   * Apply consent cookies for a given URL before navigation.
   * Automatically creates Allure step: [DATA] Apply consent seeds | Host=...
   *
   * Uses ConsentSeedRegistry to inject OneTrust consent cookies directly
   * into the browser context, bypassing the need for UI interaction with cookie banners.
   *
   * **Architecture Note:**
   * This method accesses `page.context().addCookies()` which is a BrowserContext-level API.
   * Per ADR-0009, WebActions is the ONLY layer allowed to access Playwright APIs directly.
   * Page Objects MUST NOT call this method directly; use fixtures or test setup instead.
   *
   * **Implementation Details:**
   * 1. Resolves hostname from URL
   * 2. Looks up consent seeds from ConsentSeedRegistry
   * 3. Converts ConsentCookie format → Playwright Cookie format
   * 4. Injects cookies using BrowserContext.addCookies()
   * 5. Logs result in Allure step
   *
   * **When to Use:**
   * - **Before** navigating to a new domain for the first time in a test
   * - When storageState is NOT configured in playwright.config.ts
   * - For multi-domain flows (e.g., www.cinesa.es → cdn.cinesa.es)
   *
   * **When NOT to Use:**
   * - If storageState is already configured (seeds are redundant)
   * - After navigation (cookies must be set BEFORE page.goto())
   * - For non-consent cookies (use page.context().addCookies() directly)
   *
   * @param {string} url - Target URL to apply consent cookies for (full URL or hostname)
   * @returns {Promise<void>} Resolves when cookies are applied (or skipped if no seeds)
   *
   * @throws {Error} When cookie injection fails (e.g., invalid cookie format, browser context closed)
   *
   * @example
   * ```typescript
   * // Typical usage in fixture or test setup
   * const webActions = new WebActions(page);
   * await webActions.applyConsentSeedsFor('https://www.cinesa.es');
   * // Allure step: "[DATA] Apply consent seeds | Host=www.cinesa.es | Status=Seeds applied (3)"
   * await webActions.navigateTo('https://www.cinesa.es/peliculas');
   * ```
   *
   * @example
   * ```typescript
   * // Multi-domain flow
   * await webActions.applyConsentSeedsFor('https://www.cinesa.es');
   * await webActions.navigateTo('https://www.cinesa.es/cines');
   * await webActions.applyConsentSeedsFor('https://cdn.cinesa.es'); // Different domain
   * await webActions.navigateTo('https://cdn.cinesa.es/assets');
   * ```
   *
   * @see https://playwright.dev/docs/api/class-browsercontext#browser-context-add-cookies
   * @see docs/adrs/0014-cookie-consent-persistence-with-storage-state.md
   * @see core/consent/consentSeeds.ts
   *
   * @since 1.0.0
   */
  async applyConsentSeedsFor(url: string): Promise<void> {
    const host = this.extractHostname(url);

    await step(`[DATA] Apply consent seeds | Host=${host}`, async () => {
      // Dynamic import to avoid circular dependencies
      const { getConsentSeedsFor } = await import('../consent/consentSeeds');
      const seeds = getConsentSeedsFor(url);

      if (!seeds || seeds.length === 0) {
        await allure.parameter('Status', 'No seeds found');
        return;
      }

      try {
        // Convert ConsentCookie format to Playwright Cookie format
        // Playwright expects domain, not url, so we extract hostname
        const playwrightCookies = seeds.map((seed: any) => ({
          name: seed.name,
          value: seed.value,
          domain: seed.domain,
          path: seed.path,
          expires: seed.expires,
          httpOnly: seed.httpOnly,
          secure: seed.secure,
          sameSite: seed.sameSite,
        }));

        // Inject cookies via BrowserContext API
        // This is the official Playwright way to add cookies BEFORE navigation
        await this.page.context().addCookies(playwrightCookies);

        await allure.parameter('Status', `Seeds applied (${seeds.length})`);
      } catch (error) {
        await allure.parameter('Status', 'Failed to apply seeds');
        throw new Error(`Failed to apply consent seeds for ${url}: ${error}`);
      }
    });
  }

  /**
   * Navigate to URL with automatic consent seed application.
   * Wraps navigateTo() with consent pre-seeding logic for convenience.
   *
   * **Execution Flow:**
   * 1. Apply consent seeds (if available) for target URL
   * 2. Navigate to URL using standard navigateTo()
   *
   * **Use Case:**
   * Simplified API for tests that need consent cookies but don't want
   * to call applyConsentSeedsFor() + navigateTo() separately.
   *
   * @param {string} url - The target URL to navigate to
   * @returns {Promise<void>} Resolves when navigation is complete
   *
   * @throws {Error} When consent seed application or navigation fails
   *
   * @example
   * ```typescript
   * // Automatically applies consent seeds if available for host
   * await webActions.navigateToWithConsent('https://www.cinesa.es/peliculas');
   *
   * // Equivalent to:
   * // await webActions.applyConsentSeedsFor('https://www.cinesa.es/peliculas');
   * // await webActions.navigateTo('https://www.cinesa.es/peliculas');
   * ```
   *
   * @see applyConsentSeedsFor
   * @see navigateTo
   *
   * @since 1.0.0
   */
  async navigateToWithConsent(url: string): Promise<void> {
    await this.applyConsentSeedsFor(url);
    await this.navigateTo(url);
  }

  /**
   * Helper method to extract hostname from URL or return as-is if already hostname.
   * Used internally by applyConsentSeedsFor() for logging purposes.
   *
   * @private
   * @param {string} urlOrHostname - Full URL or hostname
   * @returns {string} Extracted hostname or original string
   */
  private extractHostname(urlOrHostname: string): string {
    try {
      const parsedUrl = new URL(urlOrHostname);
      return parsedUrl.hostname;
    } catch {
      // If URL parsing fails, assume it's already a hostname
      return urlOrHostname;
    }
  }

  /**
   * Helper method to extract path from URL for cleaner Allure steps.
   * Falls back to full URL if parsing fails.
   *
   * @private
   * @param {string} url - Full URL
   * @returns {string} Path portion of URL (e.g., "/peliculas") or full URL
   */
  private extractPath(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname + parsedUrl.search;
    } catch {
      return url;
    }
  }
}
