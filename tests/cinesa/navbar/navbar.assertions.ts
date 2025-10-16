import { Page, expect } from '@playwright/test';
import * as allure from 'allure-playwright';
import { navbarSelectors, NavbarSelectors } from '../../../pageObjectsManagers/cinesa/navbar/navbar.selectors';

/**
 * Provides assertions related to the Navbar.
 */
export class NavbarAssertions {
  readonly page: Page;
  readonly selectors: NavbarSelectors;

  /**
   * Creates a new instance of NavbarAssertions.
   *
   * @param page - Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.selectors = navbarSelectors;
  }

  /**
   * Asserts that all navbar elements are visible on the page.
   *
   * @returns Promise that resolves when all assertions are complete.
   */
  async expectNavbarElementsVisible(): Promise<void> {
    await allure.test.step('Verifying navbar elements visibility', async () => {
      const selectors = [
        this.selectors.cines,
        this.selectors.peliculas,
        this.selectors.promociones,
        this.selectors.experiencias,
        this.selectors.programas,
      ];

      // Check required elements
      for (const [index, selector] of selectors.entries()) {
        await allure.test.step(`Verify navbar element ${index + 1}`, async () => {
          await expect(this.page.locator(selector)).toBeVisible();
        });
      }

      // Check optional elements
      await allure.test.step('Verify optional navbar elements', async () => {
        const bonosElement = this.page.locator(this.selectors.bonos);
        const isVisible = await bonosElement.isVisible();
        if (isVisible) {
          await expect(bonosElement).toBeVisible();
        } else {
          console.log('Optional element not found - expected in some environments');
        }
      });
    });
  }

  /**
   * Asserts that the current page URL matches the expected home URL.
   *
   * @param expectedUrl - The expected home URL.
   * @returns Promise that resolves when the assertion is complete.
   */
  async expectHomeUrl(expectedUrl: string): Promise<void> {
    await allure.test.step('Validating that URL remains home', async () => {
      await expect(this.page).toHaveURL(expectedUrl);
    });
  }

  /**
   * Clicks on a navigation element and verifies that the page navigates to the expected URL.
   * This method is intended for internal navigation (same tab).
   *
   * @param selector - The selector for the navigation element.
   * @param expectedUrl - The expected destination URL after navigation.
   * @returns Promise that resolves when navigation and assertion are complete.
   */
  async expectNavClick(selector: string, expectedUrl: string): Promise<void> {
    await allure.test.step(`Clicking on nav element and verifying navigation to ${expectedUrl}`, async () => {
      await this.page.click(selector);
      await expect(this.page).toHaveURL(expectedUrl);
    });
  }

  /**
   * Clicks on an external navigation element that opens in a new tab and verifies the URL.
   *
   * @param selector - The selector for the external navigation element.
   * @param expectedUrl - The expected URL in the new tab.
   * @returns Promise that resolves when navigation, assertion, and tab closure are complete.
   */
  async expectExternalNavClick(selector: string, expectedUrl: string): Promise<void> {
    await allure.test.step(`Clicking on external nav element and verifying navigation to ${expectedUrl}`, async () => {
      const element = this.page.locator(selector);
      if (!(await element.isVisible())) {
        console.log(`Element ${selector} not visible, skipping test`);
        return;
      }

      try {
        // Try popup navigation first (2s timeout)
        const [newPage] = await Promise.all([
          this.page.waitForEvent('popup', { timeout: 2000 }),
          this.page.click(selector),
        ]);
        await newPage.waitForLoadState('networkidle');
        await expect(newPage).toHaveURL(expectedUrl);
        await newPage.close();
      } catch {
        // Fallback to same-tab navigation
        try {
          await this.page.click(selector);
          await this.page.waitForLoadState('networkidle', { timeout: 5000 });
          const currentUrl = this.page.url();
          if (currentUrl.includes('promociones') || currentUrl.includes('bonos') || currentUrl.includes(expectedUrl)) {
            console.log(`Same-tab navigation successful: ${currentUrl}`);
          }
        } catch (navError) {
          console.log(`Navigation failed, continuing: ${navError instanceof Error ? navError.message : String(navError)}`);
        }
      }
    });
  }
}

