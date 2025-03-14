import { Page, expect } from '@playwright/test';
import { NavbarSelectors } from '../../pageObjectsManagers/cinesa/navbar.selectors';
import * as allure from 'allure-playwright';

/**
 * Asserts that all navbar elements are visible on the page.
 *
 * @param page - The Playwright page object to interact with
 * @param selectors - The NavbarSelectors object containing all navbar element selectors
 * @returns A Promise that resolves when all assertions are complete
 */
export async function assertNavbarElementsVisible(
  page: Page,
  selectors: NavbarSelectors
): Promise<void> {
  await allure.test.step('Verifying navbar elements visibility', async () => {
    // Validate each navbar element with a substep for better readability
    await allure.test.step("Verify 'cines' element", async () => {
      await expect(page.locator(selectors.cines)).toBeVisible();
    });
    await allure.test.step("Verify 'peliculas' element", async () => {
      await expect(page.locator(selectors.peliculas)).toBeVisible();
    });
    await allure.test.step("Verify 'promociones' element", async () => {
      await expect(page.locator(selectors.promociones)).toBeVisible();
    });
    await allure.test.step("Verify 'experiencias' element", async () => {
      await expect(page.locator(selectors.experiencias)).toBeVisible();
    });
    await allure.test.step("Verify 'programas' element", async () => {
      await expect(page.locator(selectors.programas)).toBeVisible();
    });
    await allure.test.step("Verify 'bonos' element", async () => {
      await expect(page.locator(selectors.bonos)).toBeVisible();
    });
  });
}

/**
 * Verifies that the current page URL matches the expected home URL.
 *
 * @param page - The Playwright page object to interact with
 * @param expectedUrl - The expected URL string to compare against
 * @returns A Promise that resolves when the assertion is complete
 */
export async function assertHomeUrl(
  page: Page,
  expectedUrl: string
): Promise<void> {
  await allure.test.step('Validating that URL remains home', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}

/**
 * Clicks on a navigation element and verifies navigation to the expected URL.
 * Used for internal navigation that happens in the same tab.
 *
 * @param page - The Playwright page object to interact with
 * @param selector - The selector string for the navigation element to click
 * @param expectedUrl - The expected destination URL after navigation
 * @returns A Promise that resolves when navigation and assertion are complete
 */
export async function assertNavClick(
  page: Page,
  selector: string,
  expectedUrl: string
): Promise<void> {
  await allure.test.step(
    `Clicking on nav element and verifying navigation to ${expectedUrl}`,
    async () => {
      await page.click(selector);
      await expect(page).toHaveURL(expectedUrl);
    }
  );
}

/**
 * Clicks on an external navigation element that opens in a new tab and verifies the URL.
 * Handles the popup event and validates the URL in the new tab before closing it.
 *
 * @param page - The Playwright page object to interact with
 * @param selector - The selector string for the external navigation element to click
 * @param expectedUrl - The expected URL in the new tab after clicking
 * @returns A Promise that resolves when navigation, assertion, and tab closure are complete
 */
export async function assertExternalNavClick(
  page: Page,
  selector: string,
  expectedUrl: string
): Promise<void> {
  await allure.test.step(
    `Clicking on external nav element and verifying navigation to ${expectedUrl} in new tab`,
    async () => {
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        page.click(selector),
      ]);
      await newPage.waitForLoadState();
      await expect(newPage).toHaveURL(expectedUrl);
      await newPage.close();
    }
  );
}
