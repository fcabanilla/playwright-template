import { Page } from '@playwright/test';

const SELECTORS = {
  banner: '#onetrust-banner-sdk',
  acceptButton: '#onetrust-accept-btn-handler',
  preferenceCenter: '#onetrust-pc-sdk',
  closeButtons: ['#close-pc-btn-handler', '.ot-close-icon', '.onetrust-close-btn-handler'],
  overlays: [
    '.onetrust-pc-dark-filter',
    '.banner-actions-container',
    '#onetrust-consent-sdk',
  ],
} as const;

async function locatorVisible(page: Page, selector: string): Promise<boolean> {
  try {
    return await page.locator(selector).isVisible();
  } catch {
    return false;
  }
}

async function waitForHidden(page: Page, selector: string, timeout = 5000): Promise<void> {
  try {
    await page.locator(selector).waitFor({ state: 'hidden', timeout });
  } catch {
    // Swallow timeout - we'll neutralize overlays later if needed
  }
}

function log(message: string): void {
  console.log(`ℹ️ [ConsentGuard] ${message}`);
}

/**
 * Ensure OneTrust consent UI elements are fully dismissed before interacting with the page.
 *
 * The helper is idempotent and safe to call multiple times within the same test.
 * It performs three steps:
 * 1. Accept the cookie banner when present
 * 2. Close the preference center if it is open
 * 3. Neutralize leftover overlay layers that could intercept clicks
 */
export async function ensureConsentClosed(page: Page): Promise<void> {
  if (!page) {
    return;
  }

  const bannerVisible = await locatorVisible(page, SELECTORS.banner);
  if (bannerVisible) {
    log('Cookie banner detected – accepting all cookies.');
    const acceptButton = page.locator(SELECTORS.acceptButton);
    try {
      await acceptButton.click({ timeout: 5000 });
    } catch (error) {
      log(`Accept button click failed (${String(error)}).`);
    }
    await waitForHidden(page, SELECTORS.banner);
  }

  const preferenceCenterVisible = await locatorVisible(page, SELECTORS.preferenceCenter);
  if (preferenceCenterVisible) {
    log('Preference center detected – attempting graceful close.');
    for (const closeSelector of SELECTORS.closeButtons) {
      if (await locatorVisible(page, closeSelector)) {
        try {
          await page.locator(closeSelector).click({ timeout: 3000 });
          break;
        } catch (error) {
          log(`Close button ${closeSelector} click failed (${String(error)}).`);
        }
      }
    }
    await waitForHidden(page, SELECTORS.preferenceCenter, 4000);
  }

  const overlaysStillBlocking = [] as string[];
  for (const selector of SELECTORS.overlays) {
    if (await locatorVisible(page, selector)) {
      overlaysStillBlocking.push(selector);
    }
  }

  if (overlaysStillBlocking.length > 0) {
    log(
      `Neutralizing persistent overlays: ${overlaysStillBlocking
        .map((selector) => selector)
        .join(', ')}`
    );
    await page.evaluate((blockingSelectors) => {
      blockingSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          const el = element as HTMLElement;
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
          el.style.setProperty('pointer-events', 'none', 'important');
          el.setAttribute('data-consent-guard', 'neutralized');
        });
      });
    }, overlaysStillBlocking);

    await page
      .waitForFunction((blockingSelectors) => {
        return blockingSelectors.every((selector) => {
          const node = document.querySelector(selector) as HTMLElement | null;
          if (!node) {
            return true;
          }
          const styles = window.getComputedStyle(node);
          const invisible =
            styles.visibility === 'hidden' ||
            styles.display === 'none' ||
            styles.opacity === '0' ||
            node.offsetParent === null;
          return invisible;
        });
      }, overlaysStillBlocking, { timeout: 2000 })
      .catch(() => {});
  }
}
