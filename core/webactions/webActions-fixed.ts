import { Page, Locator, expect } from '@playwright/test';
import { CloudflareHandler } from './cloudflareHandler';

/**
 * WebActions provides a unified interface for all Playwright interactions.
 * This is the only layer that should directly access the Playwright API.
 */
export class WebActions {
  readonly page: Page;
  readonly cloudflareHandler: CloudflareHandler;

  constructor(page: Page) {
    this.page = page;
    this.cloudflareHandler = new CloudflareHandler(page);
  }

  /**
   * Navigate to a URL
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Navigate to a URL with Cloudflare protection handling
   */
  async navigateToWithCloudflareHandling(url: string): Promise<boolean> {
    // Setup anti-detection measures first
    await this.cloudflareHandler.setupAntiDetection();

    // Navigate with Cloudflare handling
    return await this.cloudflareHandler.navigateWithCloudflareHandling(url);
  }

  /**
   * Click on an element by selector
   */
  async click(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Click on an element with overlay handling
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
