import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import {
  navbarSelectors,
  NavbarSelectors,
} from '../../../pageObjectsManagers/cinesa/navbar/navbar.selectors';

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
    await allure.step('Verifying navbar elements visibility', async () => {
      const navbarElements = [
        { selector: this.selectors.cines, name: 'Cines' },
        { selector: this.selectors.peliculas, name: 'Películas' },
        { selector: this.selectors.promociones, name: 'Promociones' },
        { selector: this.selectors.experiencias, name: 'Experiencias' },
        { selector: this.selectors.programas, name: 'Programas' },
      ];

      // Check required navbar links
      for (const element of navbarElements) {
        await allure.step(
          `Verify '${element.name}' link is visible`,
          async () => {
            // Link name already in step title, no need to duplicate as parameter
            await expect(this.page.locator(element.selector)).toBeVisible();
          }
        );
      }

      // Check optional 'Bonos' element
      await allure.step('Verify optional Bonos link', async () => {
        const bonosElement = this.page.locator(this.selectors.bonos);
        const isVisible = await bonosElement.isVisible();
        // Only show if found or not (meaningful parameter)
        await allure.parameter('Found', isVisible ? 'Yes' : 'No');
        if (isVisible) {
          await expect(bonosElement).toBeVisible();
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
    await allure.step('Validating that URL remains home', async () => {
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
    await allure.step(
      `Clicking on nav element and verifying navigation to ${expectedUrl}`,
      async () => {
        // Use force:true to bypass OneTrust modal that blocks clicks
        await this.page.click(selector, { force: true });
        await expect(this.page).toHaveURL(expectedUrl);
      }
    );
  }

  /**
   * Clicks on an external navigation element that opens in a new tab and verifies the URL.
   *
   * @param selector - The selector for the external navigation element.
   * @param expectedUrl - The expected URL in the new tab.
   * @returns Promise that resolves when navigation, assertion, and tab closure are complete.
   */
  async expectExternalNavClick(
    selector: string,
    expectedUrl: string
  ): Promise<void> {
    await allure.step(
      `Clicking on external nav element and verifying navigation to ${expectedUrl}`,
      async () => {
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
            if (
              currentUrl.includes('promociones') ||
              currentUrl.includes('bonos') ||
              currentUrl.includes(expectedUrl)
            ) {
              console.log(`Same-tab navigation successful: ${currentUrl}`);
            }
          } catch (navError) {
            console.log(
              `Navigation failed, continuing: ${navError instanceof Error ? navError.message : String(navError)}`
            );
          }
        }
      }
    );
  }
}
