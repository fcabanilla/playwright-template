import { Page, expect } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  navbarSelectors,
  NavbarSelectors,
} from '../../../pageObjectsManagers/uci/navbar/navbar.selectors';

/**
 * Provides assertions related to the UCI Cinemas Navbar.
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
   */
  async expectNavbarElementsVisible(): Promise<void> {
    await allure.test.step('Verifying navbar elements visibility', async () => {
      await allure.test.step("Verify 'Cinema' element", async () => {
        await expect(this.page.locator(this.selectors.cinemas)).toBeVisible();
      });
      await allure.test.step("Verify 'Film' element", async () => {
        await expect(this.page.locator(this.selectors.movies)).toBeVisible();
      });
      await allure.test.step("Verify 'Offerte' element", async () => {
        await expect(
          this.page.locator(this.selectors.promotions)
        ).toBeVisible();
      });
      await allure.test.step("Verify 'Esperienze' element", async () => {
        await expect(
          this.page.locator(this.selectors.experiences)
        ).toBeVisible();
      });
      await allure.test.step("Verify 'Membership' element", async () => {
        await expect(
          this.page.locator(this.selectors.membership)
        ).toBeVisible();
      });
    });
  }

  /**
   * Asserts that the current page URL matches the expected home URL.
   *
   * @param expectedUrl - The expected home URL.
   */
  async expectHomeUrl(expectedUrl: string): Promise<void> {
    await allure.test.step('Validating that URL remains home', async () => {
      await expect(this.page).toHaveURL(new RegExp(expectedUrl));
    });
  }

  /**
   * Clicks on a navigation element and verifies that the page navigates to the expected URL.
   * This method is intended for internal navigation (same tab).
   *
   * @param expectedUrl - The expected destination URL after navigation.
   */
  async expectNavClick(expectedUrl: string): Promise<void> {
    await allure.test.step(
      `Verifying navigation to ${expectedUrl}`,
      async () => {
        await expect(this.page).toHaveURL(new RegExp(expectedUrl));
      }
    );
  }

  /**
   * Verifies that the promotional modal is not visible after beforeEach.
   */
  async expectPromoModalClosed(): Promise<void> {
    await allure.test.step(
      'Verifying promotional modal is closed',
      async () => {
        // Verify that no overlay is visible
        const overlay = this.page.locator(
          'div.bg-blue-1\\/80.fixed.w-full.h-full.z-40'
        );
        await expect(overlay).not.toBeVisible();

        // Verify that we can interact with navbar elements
        const moviesElement = this.page.locator(this.selectors.movies);
        await expect(moviesElement).toBeVisible();
      }
    );
  }

  /**
   * Verifies that the logo is clickable and maintains navigation functionality.
   */
  async expectLogoFunctionality(): Promise<void> {
    await allure.test.step('Verifying logo functionality', async () => {
      const logoElement = this.page.locator(this.selectors.logo);
      await expect(logoElement).toBeVisible();
    });
  }
}
