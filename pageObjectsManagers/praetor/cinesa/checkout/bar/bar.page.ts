import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import { barSelectors, BarSelectors } from '../../../../../core/selectors/checkout';
import { WebActions } from '../../../../../core/webactions/webActions';

/**
 * PRAETOR Bar Page Object — Cinesa checkout step 4 (Bar & Food Services).
 *
 * Handles bar modal, menu selection, Galicia legal modal, and skip flow.
 * Based on legacy BarPage patterns with strict-mode-safe methods.
 */
export class PraetorBar {
  private readonly webActions: WebActions;
  private readonly page: Page;
  private readonly selectors: BarSelectors;

  constructor(page: Page) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.selectors = barSelectors;
  }

  /** Handle the bar entry modal (legal/info) — dismiss if visible */
  async handleBarModal(): Promise<void> {
    await allure.step('Handle bar modal', async () => {
      try {
        const modal = this.page.locator(this.selectors.modal);
        await modal.waitFor({ state: 'visible', timeout: 10000 });

        if (await modal.isVisible()) {
          const modalButton = this.page
            .locator(this.selectors.modalButton)
            .first();
          await modalButton.waitFor({ state: 'visible', timeout: 5000 });
          await modalButton.click();
          await modal.waitFor({ state: 'hidden', timeout: 5000 });
        }
      } catch {
        // Modal did not appear — continue
      }
    });
  }

  /** Handle Galicia "Derecho de admisión" legal modal if present */
  async handleGaliciaModal(): Promise<void> {
    await allure.step('Handle Galicia legal modal', async () => {
      try {
        const dialog = this.page.getByRole('dialog');
        const isDialogVisible = await dialog
          .isVisible()
          .catch(() => false);

        if (isDialogVisible) {
          const continueButton = dialog.getByRole('button', {
            name: 'Continuar',
          });
          if (await continueButton.isVisible().catch(() => false)) {
            await continueButton.click();
          }
        }
      } catch {
        // No Galicia modal — continue
      }
    });
  }

  /** Click the main bar skip/continue button (with fallback for bar error state) */
  async clickContinue(): Promise<void> {
    await allure.step('Click bar continue button', async () => {
      const mainButton = this.page.locator(this.selectors.barMainButton);
      const visible = await mainButton
        .waitFor({ state: 'visible', timeout: 10000 })
        .then(() => true)
        .catch(() => false);

      if (visible) {
        await mainButton.scrollIntoViewIfNeeded();
        await mainButton.click();
        return;
      }

      // Fallback: bar page may show error state — look for any primary continue button
      const fallback = this.page
        .locator('button.v-button--color-primary')
        .filter({ hasText: /continuar/i })
        .first();
      await fallback.scrollIntoViewIfNeeded();
      await fallback.click();
    });
  }

  /** Skip bar entirely — handle modal and click continue */
  async skipBar(): Promise<void> {
    await allure.step('Skip bar (modal + continue)', async () => {
      await this.handleBarModal();
      await this.handleGaliciaModal();
      await this.clickContinue();
    });
  }

  /** Navigate to the MENUS tab (second tab) */
  async selectMenusTab(): Promise<void> {
    await allure.step('Select MENUS tab', async () => {
      await this.webActions.click(this.selectors.menusTab, 'menusTab');
      // Wait for menu items to load after tab switch
      const firstItem = this.page.locator(this.selectors.menuItems).first();
      await firstItem.waitFor({ state: 'visible', timeout: 10000 });
    });
  }

  /** Select the CLASICO menu from menu items */
  async selectClassicMenu(): Promise<void> {
    await allure.step('Select CLASICO menu', async () => {
      const menuItems = this.page.locator(this.selectors.menuItems);
      const count = await menuItems.count();

      if (count === 0) {
        throw new Error('No menu items found');
      }

      let found = false;
      for (let i = 0; i < count; i++) {
        const item = menuItems.nth(i);
        const nameElement = item.locator(this.selectors.menuItemName);
        const text = await nameElement.textContent();

        if (text && text.toUpperCase().includes('CLASICO')) {
          await item.locator(this.selectors.menuItemButton).click();
          found = true;
          break;
        }
      }

      if (!found) {
        throw new Error(
          'CLASICO menu item not found in available menu items'
        );
      }
    });
  }

  /**
   * Select the last available option in each menu section and add to cart.
   * Iterates ALL sections (drink, popcorn, sauce, etc.) selecting only options
   * that have a radio button (not sold out).
   */
  async selectMenuOptionsAndAddToCart(): Promise<void> {
    await allure.step(
      'Select menu options and add to cart',
      async () => {
        const sections = this.page.locator(this.selectors.modalSections);
        const sectionCount = await sections.count();
        let selectedAny = false;

        for (let i = 0; i < sectionCount; i++) {
          const section = sections.nth(i);
          const options = section.locator(
            this.selectors.modalSectionOptions
          );
          const optionCount = await options.count();
          const availableIndexes: number[] = [];

          for (let j = 0; j < optionCount; j++) {
            const option = options.nth(j);
            if (
              (await option.locator('input[type="radio"]').count()) > 0
            ) {
              availableIndexes.push(j);
            }
          }

          if (availableIndexes.length > 0) {
            await options
              .nth(availableIndexes[availableIndexes.length - 1])
              .click();
            selectedAny = true;
          }
        }

        if (!selectedAny) {
          throw new Error(
            'No available menu options found in any section'
          );
        }

        // Add to cart
        const addButton = this.page
          .locator(this.selectors.addToCartButton)
          .first();
        await addButton.click();

        // Wait for transition
        await this.webActions.wait(2000);
      }
    );
  }

  /** Click the bar summary continue button (after adding items to cart) */
  async clickBarSummaryContinue(): Promise<void> {
    await allure.step('Click bar summary continue button', async () => {
      const button = this.page.locator(
        this.selectors.barSummaryContinueButton
      );
      await button.waitFor({ state: 'visible', timeout: 10000 });

      // Wait until button is enabled
      let attempts = 0;
      while (!(await button.isEnabled()) && attempts < 50) {
        await this.webActions.wait(100);
        attempts++;
      }

      await button.click();
    });
  }

  /**
   * Buy a classic menu (Oasiz flow) — handle modal, select menu, add, continue.
   * Full menu purchase flow for tests that need bar items.
   */
  async buyClassicMenu(): Promise<void> {
    await allure.step('Buy classic menu', async () => {
      await this.handleBarModal();
      await this.handleGaliciaModal();
      await this.selectMenusTab();
      await this.selectClassicMenu();
      await this.selectMenuOptionsAndAddToCart();
      await this.clickBarSummaryContinue();
    });
  }

  /** Get all menu item names from the current tab */
  async getMenuItemNames(): Promise<string[]> {
    return allure.step('Get menu item names', async () => {
      const items = this.page.locator(this.selectors.menuItems);
      const count = await items.count();
      const names: string[] = [];

      for (let i = 0; i < count; i++) {
        const nameEl = items.nth(i).locator(this.selectors.menuItemName);
        const text = (await nameEl.textContent().catch(() => '')) || '';
        names.push(text.trim());
      }

      return names;
    });
  }

  /** Check if the bar main skip button is visible */
  async isSkipButtonVisible(): Promise<boolean> {
    return this.page
      .locator(this.selectors.barMainButton)
      .isVisible()
      .catch(() => false);
  }
}
