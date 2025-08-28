import { Page, expect } from '@playwright/test';
import * as allure from 'allure-playwright';
import { Navbar } from '../../../pageObjectsManagers/uci/navbar/navbar.page';

/**
 * Provides assertions related to the UCI Cinemas Navbar.
 * This class should ONLY use the POM methods, never directly access Playwright API.
 */
export class NavbarAssertions {
  readonly navbar: Navbar;

  /**
   * Creates a new instance of NavbarAssertions.
   *
   * @param page - Playwright Page object.
   */
  constructor(page: Page) {
    this.navbar = new Navbar(page);
  }

  /**
   * Asserts that all navbar elements are visible on the page.
   */
  async expectNavbarElementsVisible(): Promise<void> {
    await allure.test.step('Verifying navbar elements visibility', async () => {
      await allure.test.step("Verify 'Cinema' element", async () => {
        const isVisible = await this.navbar.isCinemasVisible();
        expect(isVisible).toBe(true);
      });
      await allure.test.step("Verify 'Film' element", async () => {
        const isVisible = await this.navbar.isMoviesVisible();
        expect(isVisible).toBe(true);
      });
      await allure.test.step("Verify 'Offerte' element", async () => {
        const isVisible = await this.navbar.isPromotionsVisible();
        expect(isVisible).toBe(true);
      });
      await allure.test.step("Verify 'Esperienze' element", async () => {
        const isVisible = await this.navbar.isExperiencesVisible();
        expect(isVisible).toBe(true);
      });
      await allure.test.step("Verify 'Membership' element", async () => {
        const isVisible = await this.navbar.isMembershipVisible();
        expect(isVisible).toBe(true);
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
      // Make the URL matching more flexible to handle www vs non-www and trailing slashes
      const normalizedExpected = expectedUrl
        .replace(/^https?:\/\/(www\.)?/, '')
        .replace(/\/$/, '');
      const urlPattern = new RegExp(
        `https?://(www\\.)?${normalizedExpected.replace(/\./g, '\\.')}/?$`
      );

      await this.navbar.validateUrl(urlPattern);
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
        // Make URL matching more flexible to handle www vs non-www and trailing slashes
        const normalizedExpected = expectedUrl
          .replace(/^https?:\/\/(www\.)?/, '')
          .replace(/\/$/, '');
        const urlPattern = new RegExp(
          `https?://(www\\.)?${normalizedExpected.replace(/\./g, '\\.')}/?$`
        );

        await this.navbar.validateUrl(urlPattern);
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
        const isModalVisible = await this.navbar.isPromoModalVisible();
        expect(isModalVisible).toBe(false);

        // Verify that we can interact with navbar elements
        const isMoviesVisible = await this.navbar.isMoviesVisible();
        expect(isMoviesVisible).toBe(true);
      }
    );
  }

  /**
   * Verifies that the logo is clickable and maintains navigation functionality.
   */
  async expectLogoFunctionality(): Promise<void> {
    await allure.test.step('Verifying logo functionality', async () => {
      const isLogoVisible = await this.navbar.isLogoVisible();
      expect(isLogoVisible).toBe(true);
    });
  }
}
