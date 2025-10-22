import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import {
  CookieBannerSelectors,
  cookieBannerSelectors,
} from './cookieBanner.selectors';

/**
 * CookieBanner Page Object
 *
 * Handles OneTrust cookie consent banner interactions.
 * Follows framework architecture: delegates Playwright API calls to WebActions where possible.
 *
 * Architecture Notes:
 * - Uses WebActions for: click(), fill(), isVisible(), waitForVisible()
 * - Uses page.locator() for: waitFor({ state: 'hidden' }), click({ force: true })
 * - Uses page.evaluate() for: JavaScript DOM manipulation
 *
 * Rationale:
 * - WebActions doesn't currently expose waitFor with state options or force click
 * - JavaScript evaluation is needed for bypassing overlay blocking
 * - This is acceptable as these are specialized cookie banner interactions
 *
 * @see docs/adrs/0009-page-object-architecture-rules.md
 */
export class CookieBanner {
  private readonly page: Page; // For evaluate() and specialized waitFor operations
  private readonly webActions: WebActions;
  private readonly selectors: CookieBannerSelectors;

  /**
   * Constructor - Accepts Page and creates WebActions internally
   *
   * @param page - Playwright Page instance (required for evaluate and advanced operations)
   */
  constructor(page: Page) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.selectors = cookieBannerSelectors;
  } /**
   * Accept cookies using the simple "Accept All" button
   * @deprecated Use acceptAllCookies() instead for better reliability
   */
  async acceptCookies(): Promise<void> {
    const isVisible = await this.webActions.isVisible(
      this.selectors.acceptButton
    );
    if (isVisible) {
      await allure.test.step('Accepting cookies', async () => {
        await this.webActions.click(this.selectors.acceptButton);
      });
    }
  }

  /**
   * Accept all cookies and dismiss any cookie-related overlays
   *
   * Uses dynamic waiting based on actual DOM state changes instead of fixed timeouts.
   * This method handles:
   * - Cookie banner (may or may not appear)
   * - Cookie settings modal
   * - Dark overlay that blocks interactions
   *
   * The banner may not appear if:
   * - Cookies were already accepted in a previous session
   * - Storage state is being reused
   * - User preferences are cached
   */
  async acceptAllCookies(): Promise<void> {
    await allure.test.step(
      'Accepting all cookies and dismissing overlays',
      async () => {
        try {
          console.log('🍪 Checking for cookie banner...');

          // Wait for the banner to appear with a short timeout (3s)
          // Short timeout to avoid slowing down tests when banner doesn't appear
          const bannerAppeared = await this.webActions
            .waitForVisible(this.selectors.banner, 3000)
            .then(() => true)
            .catch(() => false);

          if (!bannerAppeared) {
            console.log(
              '✅ No cookie banner detected (cookies already accepted or not required)'
            );
            // ⚠️ CRITICAL: Even if banner doesn't appear, overlay might still exist
            // Check and clean up any remaining OneTrust overlays
            console.log('🔍 Checking for lingering OneTrust overlays...');
            await this.waitForOneTrustCleanup();
            console.log('✅ Cookie overlay cleanup completed');
            return;
          }

          console.log('🍪 Cookie banner detected! Clicking accept button...');

          // Wait for accept button to be ready
          await this.webActions.waitForVisible(
            this.selectors.acceptButton,
            5000
          );

          // Use JavaScript to click the button directly (bypasses overlay blocking)
          // Note: Using page.evaluate() here is acceptable as WebActions doesn't expose evaluate()
          const clicked = await this.page.evaluate(() => {
            const acceptButton = document.querySelector(
              '#onetrust-accept-btn-handler'
            ) as HTMLButtonElement;
            if (acceptButton) {
              acceptButton.click();
              return true;
            }
            return false;
          });

          if (clicked) {
            console.log('✅ Clicked accept button via JS');
          } else {
            console.log(
              '⚠️ Accept button not found, trying force click via page.locator()...'
            );
            // Note: Using page.locator() here as WebActions doesn't expose force click
            await this.page
              .locator(this.selectors.acceptButton)
              .click({ force: true, timeout: 5000 });
          }

          // Wait dynamically for banner to disappear (DOM state change)
          // Note: Using page.locator() here as WebActions doesn't expose waitFor with state
          await this.page
            .locator(this.selectors.banner)
            .waitFor({ state: 'hidden', timeout: 5000 })
            .catch(() =>
              console.log('⚠️ Banner still visible, forcing removal...')
            );

          // Wait for any remaining OneTrust elements to be removed from DOM
          // This is a dynamic wait for the SDK to clean up after acceptance
          await this.waitForOneTrustCleanup();

          console.log('✅ Cookie handling completed successfully');
        } catch (error) {
          console.log('⚠️ Error handling cookies:', (error as Error).message);

          // Emergency cleanup - force remove everything
          console.log('🔧 Running emergency cleanup...');
          await this.forceRemoveOneTrustElements();
          console.log('✅ Emergency cleanup completed');
        }
      }
    );
  }

  /**
   * Wait dynamically for OneTrust SDK to clean up after cookie acceptance
   * Uses MutationObserver to detect when elements are removed from DOM
   */
  private async waitForOneTrustCleanup(): Promise<void> {
    try {
      // Use Playwright's built-in wait for selector to be detached/hidden
      await Promise.race([
        // Wait for overlay to be detached from DOM
        this.page
          .locator(this.selectors.overlay)
          .waitFor({ state: 'detached', timeout: 2000 })
          .catch(() => {}),

        // Or wait for consent SDK container to be hidden
        this.page
          .locator(this.selectors.consentSdk)
          .waitFor({ state: 'hidden', timeout: 2000 })
          .catch(() => {}),
      ]);

      // If elements still exist, force remove them
      const stillVisible = await this.hasVisibleOneTrustElements();
      if (stillVisible) {
        console.log('⚠️ OneTrust elements still present, forcing removal...');
        await this.forceRemoveOneTrustElements();
      }
    } catch (error) {
      // If waiting fails, force cleanup
      await this.forceRemoveOneTrustElements();
    }
  }

  /**
   * Check if any OneTrust elements are still visible in the DOM
   */
  private async hasVisibleOneTrustElements(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const selectors = [
        '#onetrust-banner-sdk',
        '#onetrust-pc-sdk',
        '.onetrust-pc-dark-filter',
      ];

      return selectors.some((selector) => {
        const element = document.querySelector(selector);
        if (!element) return false;

        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
    });
  }

  /**
   * Force remove all OneTrust elements from DOM
   * Used as fallback when dynamic waiting doesn't work
   */
  private async forceRemoveOneTrustElements(): Promise<void> {
    await this.page.evaluate(() => {
      const elementsToRemove = [
        '#onetrust-banner-sdk',
        '#onetrust-pc-sdk',
        '#onetrust-consent-sdk',
        '.onetrust-pc-dark-filter',
      ];

      let removedCount = 0;
      elementsToRemove.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          el.remove();
          removedCount++;
        });
      });

      if (removedCount > 0) {
        console.log(`✅ Forcefully removed ${removedCount} OneTrust elements`);
      }
    });
  }

  /**
   * Wait for cookie banner to disappear (useful after navigation)
   *
   * Note: Uses page.locator() as WebActions doesn't expose waitFor with state: 'hidden'
   */
  async waitForBannerToDisappear(): Promise<void> {
    try {
      await this.page
        .locator(this.selectors.banner)
        .waitFor({ state: 'hidden', timeout: 3000 });
    } catch {
      // Banner was not present or already hidden
    }
  }

  /**
   * Check if cookie banner is currently visible
   */
  async isBannerVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.banner);
  }
}
