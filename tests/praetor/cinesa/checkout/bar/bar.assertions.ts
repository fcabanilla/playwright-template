/**
 * PRAETOR Bar assertions — Allure-wrapped expect() calls.
 *
 * Receives Page directly (ADR-0009 exception for assertions layer).
 */
import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import {
  barSelectors,
  BarSelectors,
} from '../../../../../core/selectors/checkout';

export class PraetorBarAssertions {
  private readonly page: Page;
  private readonly selectors: BarSelectors;

  constructor(page: Page) {
    this.page = page;
    this.selectors = barSelectors;
  }

  /** Verify the bar skip/continue button is visible */
  async expectSkipButtonVisible(): Promise<void> {
    await allure.step('Verify bar skip button is visible', async () => {
      const button = this.page.locator(this.selectors.barMainButton);
      await expect(button).toBeVisible({ timeout: 15000 });
    });
  }

  /** Verify menu items are visible in the current tab */
  async expectMenuItemsVisible(): Promise<void> {
    await allure.step('Verify menu items are visible', async () => {
      const items = this.page.locator(this.selectors.menuItems);
      await expect(items.first()).toBeVisible({ timeout: 10000 });
    });
  }

  /** Verify navigated to purchase summary after bar */
  async expectNavigatedToSummary(): Promise<void> {
    await allure.step('Verify navigation to purchase summary', async () => {
      await this.page.waitForURL('**/compra/resumen-de-tu-compra/**', {
        timeout: 15000,
        waitUntil: 'domcontentloaded',
      });
      expect(this.page.url()).toContain('/compra/resumen-de-tu-compra/');
    });
  }

  /** Verify MENUS tab is accessible */
  async expectMenusTabAccessible(): Promise<void> {
    await allure.step('Verify MENUS tab is accessible', async () => {
      const tab = this.page.locator(this.selectors.menusTab);
      await expect(tab).toBeVisible({ timeout: 10000 });
    });
  }
}
