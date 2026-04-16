import { WebActions } from '../../../core/webactions/webActions';
import {
  CookieBannerSelectors,
  cookieBannerSelectors,
} from './cookieBanner.selectors';
import { allure } from 'allure-playwright';

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
   * Helper function to get environment-specific selector
   */
  private getEnvironmentSelector(
    selectorName: keyof CookieBannerSelectors
  ): string {
    const env = process.env.TEST_ENV || 'production';
    const prodSelectorName =
      `${String(selectorName)}Prod` as keyof CookieBannerSelectors;
    const preprodSelectorName =
      `${String(selectorName)}Preprod` as keyof CookieBannerSelectors;

    if (env === 'production' && this.selectors[prodSelectorName]) {
      return this.selectors[prodSelectorName] as string;
    } else if (
      (env === 'preprod' || env === 'lab') &&
      this.selectors[preprodSelectorName]
    ) {
      return this.selectors[preprodSelectorName] as string;
    }

    // Fallback to default selector
    return this.selectors[selectorName] as string;
  }

  /**
   * Accept all cookies and dismiss overlays
   * Complete operation including waiting for banner to fully disappear.
   * Simple orchestration - delegates to WebActions.
   *
   * @param waitForDisappear - Whether to wait for banner to fully disappear (default: true)
   */
  async acceptAllCookies(waitForDisappear: boolean = true): Promise<void> {
    await allure.step(
      'Accept all cookies and wait for banner to disappear',
      async () => {
        const bannerSelector = this.getEnvironmentSelector('banner');
        const acceptButtonSelector =
          this.getEnvironmentSelector('acceptButton');
        //const overlaySelector = this.getEnvironmentSelector('overlay');

        // Check if banner appears (uses waitForVisible with timeout)
        const bannerVisible = await this.webActions
          .waitForVisible(bannerSelector, 3000)
          .then(() => true)
          .catch(() => false);

        if (!bannerVisible) {
          // No banner, but may have leftover overlays
          await this.removeOverlays();
          return;
        }

        // Click accept button (WebActions handles overlay blocking)
        await this.webActions.clickWithOverlayHandling(acceptButtonSelector);
      }
    );
  }

  /**
   * Remove OneTrust overlay elements
   * Uses selectors from cookieBannerSelectors - no hardcoded selectors
   */
  private async removeOverlays(): Promise<void> {
    const overlaySelector = this.getEnvironmentSelector('overlay');
    const consentSdkSelector = this.getEnvironmentSelector('consentSdk');
    const bannerSelector = this.getEnvironmentSelector('banner');

    // Wait for overlays to detach naturally first (with timeout)
    await Promise.race([
      this.webActions
        .waitForSelector(overlaySelector, {
          state: 'detached',
          timeout: 2000,
        })
        .catch(() => {}),
      this.webActions
        .waitForSelector(consentSdkSelector, {
          state: 'hidden',
          timeout: 2000,
        })
        .catch(() => {}),
    ]);

    // Check if overlay still exists (quick check with 500ms timeout)
    const overlayGone = await this.webActions
      .waitForSelector(overlaySelector, {
        state: 'detached',
        timeout: 500,
      })
      .then(() => true)
      .catch(() => false);

    // If overlay still present, force remove elements
    if (!overlayGone) {
      const selectorsToRemove = [
        overlaySelector,
        bannerSelector,
        consentSdkSelector,
        this.selectors.settingsModal,
      ];

      await this.webActions.evaluate((arg) => {
        const selectors = arg as string[];
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
