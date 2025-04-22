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
      await allure.test.step("Verify 'Cines' element", async () => {
        await expect(this.page.locator(this.selectors.cines)).toBeVisible();
      });
      await allure.test.step("Verify 'Peliculas' element", async () => {
        await expect(this.page.locator(this.selectors.peliculas)).toBeVisible();
      });
      await allure.test.step("Verify 'Promociones' element", async () => {
        await expect(this.page.locator(this.selectors.promociones)).toBeVisible();
      });
      await allure.test.step("Verify 'Experiencias' element", async () => {
        await expect(this.page.locator(this.selectors.experiencias)).toBeVisible();
      });
      await allure.test.step("Verify 'Programas' element", async () => {
        await expect(this.page.locator(this.selectors.programas)).toBeVisible();
      });
      await allure.test.step("Verify 'Bonos' element", async () => {
        await expect(this.page.locator(this.selectors.bonos)).toBeVisible();
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
    await allure.test.step(`Clicking on external nav element and verifying navigation to ${expectedUrl} in new tab`, async () => {
      const [newPage] = await Promise.all([
        this.page.waitForEvent('popup'),
        this.page.click(selector),
      ]);
      await newPage.waitForLoadState('networkidle');
      await expect(newPage).toHaveURL(expectedUrl);
      await newPage.close();
    });
  }
}

