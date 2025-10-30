import { WebActions } from '../../../core/webactions/webActions';
import {
  CookieBannerSelectors,
  cookieBannerSelectors,
} from './cookieBanner.selectors';

/**
 * CookieBanner Page Object
 *
 * Handles OneTrust cookie consent banner interactions.
 * Follows ADR-0009: Only uses WebActions, no direct Playwright API access.
 * Simple orchestration layer - complex logic belongs in WebActions.
 *
 * @see docs/adrs/0009-page-object-architecture-rules.md
 */
export class CookieBanner {
  private readonly webActions: WebActions;
  private readonly selectors: CookieBannerSelectors;

  constructor(webActions: WebActions) {
    this.webActions = webActions;
    this.selectors = cookieBannerSelectors;
  }

  /**
   * Accept all cookies and dismiss overlays
   * Simple orchestration - delegates to WebActions
   */
  async acceptAllCookies(): Promise<void> {
    // Check if banner appears (uses waitForVisible with timeout)
    const bannerVisible = await this.webActions
      .waitForVisible(this.selectors.banner, 3000)
      .then(() => true)
      .catch(() => false);

    if (!bannerVisible) {
      // No banner, but may have leftover overlays
      await this.removeOverlays();
      return;
    }

    // Click accept button (WebActions handles overlay blocking)
    await this.webActions.clickWithOverlayHandling(this.selectors.acceptButton);

    // Wait for banner to disappear
    await this.webActions
      .waitForSelector(this.selectors.banner, {
        state: 'hidden',
        timeout: 5000,
      })
      .catch(() => {});

    // 🔧 PHASE 1: Wait for overlay to disappear
    await this.webActions
      .waitForSelector(this.selectors.overlay, {
        state: 'hidden',
        timeout: 10000,
      })
      .catch(() => {});

    // Clean up any remaining overlays
    await this.removeOverlays();

    // 🔧 PHASE 1: Wait for page stability
    await this.webActions.waitForLoadState('networkidle').catch(() => {});
  }

  /**
   * Remove OneTrust overlay elements
   * Uses selectors from cookieBannerSelectors - no hardcoded selectors
   */
  private async removeOverlays(): Promise<void> {
    // Wait for overlays to detach naturally first (with timeout)
    await Promise.race([
      this.webActions
        .waitForSelector(this.selectors.overlay, {
          state: 'detached',
          timeout: 2000,
        })
        .catch(() => {}),
      this.webActions
        .waitForSelector(this.selectors.consentSdk, {
          state: 'hidden',
          timeout: 2000,
        })
        .catch(() => {}),
    ]);

    // Check if overlay still exists (quick check with 500ms timeout)
    const overlayGone = await this.webActions
      .waitForSelector(this.selectors.overlay, {
        state: 'detached',
        timeout: 500,
      })
      .then(() => true)
      .catch(() => false);

    // If overlay still present, force remove elements
    if (!overlayGone) {
      const selectorsToRemove = [
        this.selectors.overlay,
        this.selectors.banner,
        this.selectors.consentSdk,
        this.selectors.settingsModal,
      ];

      await this.webActions.evaluate((selectors: string[]) => {
        selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => el.remove());
        });
      }, selectorsToRemove);
    }
  }

  /**
   * Wait for cookie banner to disappear
   */
  async waitForBannerToDisappear(): Promise<void> {
    await this.webActions
      .waitForSelector(this.selectors.banner, {
        state: 'hidden',
        timeout: 3000,
      })
      .catch(() => {});
  }

  /**
   * Check if cookie banner is visible
   */
  async isBannerVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.banner);
  }
}
