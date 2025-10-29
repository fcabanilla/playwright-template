import { allure } from 'allure-playwright';
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
  private readonly webActions: WebActions;
  private readonly selectors: CookieBannerSelectors;

  /**
   * Constructor - Accepts WebActions for ADR-0009 compliance
   * Follows ADR-0009: Uses WebActions abstraction, no direct Playwright API access.
   *
   * @param webActions - WebActions instance for all browser interactions
   */
  constructor(webActions: WebActions) {
    this.webActions = webActions;
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
      await allure.step('Accepting cookies', async () => {
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
    await allure.step(
      'Accepting all cookies and dismissing overlays',
      async () => {
        try {
          await allure.step('🍪 Check for cookie banner', async () => {
            // Wait for the banner to appear with a short timeout (3s)
            const bannerAppeared = await this.webActions
              .waitForVisible(this.selectors.banner, 3000)
              .then(() => true)
              .catch(() => false);

            await allure.parameter(
              'Banner Detected',
              bannerAppeared ? 'Yes' : 'No'
            );

            if (!bannerAppeared) {
              await allure.step(
                '✅ No cookie banner detected - checking overlays',
                async () => {
                  // ⚠️ CRITICAL: Even if banner doesn't appear, overlay might still exist
                  await this.waitForOneTrustCleanup();
                }
              );
              return;
            }

            await allure.step(
              '🍪 Cookie banner detected - accepting cookies',
              async () => {
                // Wait for accept button to be ready
                await this.webActions.waitForVisible(
                  this.selectors.acceptButton,
                  5000,
                  'Wait for accept button to be visible'
                );

                // Use JavaScript to click the button directly (bypasses overlay blocking)
                const clicked = await this.webActions.evaluate(() => {
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
                  await allure.step(
                    '✅ Clicked accept button via JavaScript',
                    async () => {}
                  );
                } else {
                  await allure.step(
                    '⚠️ Fallback: Force click accept button',
                    async () => {
                      await this.webActions.clickWithOverlayHandling(
                        this.selectors.acceptButton
                      );
                    }
                  );
                }

                // Wait dynamically for banner to disappear (DOM state change)
                await this.webActions
                  .waitForSelector(this.selectors.banner, {
                    state: 'hidden',
                    timeout: 5000,
                  })
                  .catch(() => {
                    // Banner still visible, will be handled by cleanup
                  });

                // Wait for any remaining OneTrust elements to be removed from DOM
                await this.waitForOneTrustCleanup();
              }
            );
          });
        } catch (error) {
          await allure.step(
            '⚠️ Error handling cookies - running emergency cleanup',
            async () => {
              await allure.parameter('Error Message', (error as Error).message);
              await this.forceRemoveOneTrustElements();
            }
          );
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
        this.webActions
          .waitForSelector(this.selectors.overlay, {
            state: 'detached',
            timeout: 2000,
          })
          .catch(() => {}),

        // Or wait for consent SDK container to be hidden
        this.webActions
          .waitForSelector(this.selectors.consentSdk, {
            state: 'hidden',
            timeout: 2000,
          })
          .catch(() => {}),
      ]);

      // If elements still exist, force remove them
      const stillVisible = await this.hasVisibleOneTrustElements();
      if (stillVisible) {
        await allure.step(
          '⚠️ OneTrust elements still present - forcing removal',
          async () => {
            await this.forceRemoveOneTrustElements();
          }
        );
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
    return await this.webActions.evaluate(() => {
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
    const removedCount = await this.webActions.evaluate(() => {
      const elementsToRemove = [
        '#onetrust-banner-sdk',
        '#onetrust-pc-sdk',
        '#onetrust-consent-sdk',
        '.onetrust-pc-dark-filter',
      ];

      let count = 0;
      elementsToRemove.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          el.remove();
          count++;
        });
      });

      return count;
    });

    if (removedCount > 0) {
      await allure.step(
        `✅ Forcefully removed ${removedCount} OneTrust elements`,
        async () => {
          await allure.parameter('Elements Removed', removedCount.toString());
        }
      );
    }
  }

  /**
   * Wait for cookie banner to disappear (useful after navigation)
   *
   * Note: Uses page.locator() as WebActions doesn't expose waitFor with state: 'hidden'
   */
  async waitForBannerToDisappear(): Promise<void> {
    try {
      await this.webActions.waitForSelector(this.selectors.banner, {
        state: 'hidden',
        timeout: 3000,
      });
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
