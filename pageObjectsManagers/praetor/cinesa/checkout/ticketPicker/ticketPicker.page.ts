import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import {
  ticketPickerSelectors,
  TicketPickerSelectors,
  TicketTypeInfo,
} from '../../../../../core/selectors/checkout';
import { WebActions } from '../../../../../core/webactions/webActions';

/**
 * PRAETOR TicketPicker Page Object — Cinesa checkout step 3 (Entradas).
 *
 * Based on legacy TicketPicker POM patterns with strict-mode-safe methods.
 * Handles 3D glasses modal, ticket row selection, and promo codes.
 */
export class PraetorTicketPicker {
  private readonly webActions: WebActions;
  private readonly page: Page;
  private readonly selectors: TicketPickerSelectors;
  private readonly preferredPatterns = [
    /adult/i,
    /normal/i,
    /general/i,
    /entrada/i,
  ];
  private readonly excludedPatterns = [
    /mycinesa/i,
    /pack/i,
    /menu/i,
    /bundle/i,
    /inicia sesi[oó]n/i,
  ];

  constructor(page: Page) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.selectors = ticketPickerSelectors;
  }

  /** Wait for ticket picker to be ready (at least one ticket row visible) */
  async waitForTicketPickerReady(): Promise<void> {
    await allure.step('Wait for ticket picker ready', async () => {
      // Dismiss any blocking modal first (e.g. "AVISO IMPORTANTE" 3D session warning)
      await this.dismissBlockingModal();
      await this.webActions.waitForSelector(this.selectors.ticketRow, {
        timeout: 30000,
        state: 'visible',
      });
    });
  }

  /**
   * Dismiss a generic blocking modal (e.g. "AVISO IMPORTANTE" for 3D sessions).
   * This is separate from `handleGlassesModal()` which targets the specific glasses modal.
   */
  private async dismissBlockingModal(): Promise<void> {
    try {
      const modal = this.page.locator('aside.v-modal[role="dialog"]').first();
      if (!(await modal.isVisible())) return;

      const acceptButton = modal
        .locator(
          'button:has-text("Continuar"), button:has-text("Continue"), button:has-text("Aceptar"), .v-button--color-primary'
        )
        .first();

      if (await acceptButton.isVisible()) {
        await acceptButton.click();
        await modal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      }
    } catch {
      // Non-critical — continue with main flow
    }
  }

  /** Handle 3D glasses modal if visible (non-blocking) */
  async handleGlassesModal(): Promise<void> {
    try {
      const isVisible = await this.webActions.isVisible(
        this.selectors.glassesModal
      );
      if (!isVisible) return;

      const strategies = [
        this.selectors.glassesModalSelectButton,
        this.selectors.glassesModalPrimaryButton,
        this.selectors.glassesModalFooterButton,
        this.selectors.glassesModalAnyButton,
      ];

      for (const buttonSelector of strategies) {
        try {
          const button = this.page.locator(buttonSelector).first();
          if (await button.isVisible()) {
            await button.click({ force: true });
            const stillPresent = await this.webActions.isVisible(
              this.selectors.glassesModal
            );
            if (!stillPresent) return;
          }
        } catch {
          continue;
        }
      }
    } catch {
      // Non-critical — continue with main flow
    }
  }

  /**
   * Select ticket(s) by clicking the increment button on the best matching row.
   * Prioritizes adult/normal/general tickets, excludes MyCinesa/pack rows.
   *
   * @param count Number of tickets to add (default: 1)
   */
  async selectTicket(count = 1): Promise<void> {
    await allure.step(`Select ${count} ticket(s)`, async () => {
      await this.handleGlassesModal();
      await this.waitForTicketPickerReady();

      const ticketRows = this.page.locator(this.selectors.ticketRow);
      const rowCount = await ticketRows.count();

      // Build prioritized list of selectable rows
      const candidates: Array<{
        index: number;
        priority: number;
        remaining: number;
      }> = [];

      for (let i = 0; i < rowCount; i++) {
        const row = ticketRows.nth(i);
        const plusButton = row.locator(this.selectors.incrementButton).first();

        const hasPlusButton = await plusButton.isVisible().catch(() => false);
        if (!hasPlusButton) continue;

        const isDisabled = await plusButton.isDisabled().catch(() => true);
        if (isDisabled) continue;

        const description = (
          (await row
            .locator(this.selectors.ticketDescription)
            .first()
            .textContent()
            .catch(() => '')) || ''
        ).trim();

        if (this.excludedPatterns.some((p) => p.test(description))) continue;

        const quantityInput = row.locator(this.selectors.quantityInput).first();
        const currentValue = Number(
          (await quantityInput.getAttribute('value').catch(() => '0')) || '0'
        );
        const maxValue = Number(
          (await quantityInput.getAttribute('max').catch(() => '99')) || '99'
        );
        const remaining = Math.max(0, maxValue - currentValue);

        if (remaining === 0) continue;

        const priority = this.preferredPatterns.some((p) => p.test(description))
          ? 0
          : 1;

        candidates.push({ index: i, priority, remaining });
      }

      candidates.sort((a, b) => a.priority - b.priority);

      if (candidates.length === 0) {
        throw new Error('No selectable ticket rows found in ticket picker');
      }

      let ticketsAdded = 0;
      for (const candidate of candidates) {
        if (ticketsAdded >= count) break;

        const row = ticketRows.nth(candidate.index);
        const clicksNeeded = Math.min(
          candidate.remaining,
          count - ticketsAdded
        );

        for (let c = 0; c < clicksNeeded; c++) {
          const plusButton = row
            .locator(this.selectors.incrementButton)
            .first();
          try {
            await plusButton.click();
          } catch {
            await plusButton.click({ force: true });
          }
          ticketsAdded++;
          await this.handleGlassesModal();
        }
      }

      if (ticketsAdded < count) {
        throw new Error(
          `Unable to add requested tickets. Requested=${count}, Added=${ticketsAdded}`
        );
      }
    });
  }

  /** Confirm selected tickets by clicking the continue button */
  async confirmTickets(): Promise<void> {
    await allure.step('Confirm selected tickets', async () => {
      await this.handleGlassesModal();
      await this.webActions.waitForVisible(this.selectors.confirmButton);
      await this.webActions.click(
        this.selectors.confirmButton,
        'confirmButton'
      );
    });
  }

  /** Select ticket(s) and confirm — main entry point */
  async selectTicketAndConfirm(count = 1): Promise<void> {
    await this.selectTicket(count);
    await this.confirmTickets();
  }

  /** Get all ticket type names displayed */
  async getTicketTypeNames(): Promise<string[]> {
    return allure.step('Get ticket type names', async () => {
      await this.waitForTicketPickerReady();

      const rows = this.page.locator(this.selectors.ticketRow);
      const rowCount = await rows.count();
      const names: string[] = [];

      for (let i = 0; i < rowCount; i++) {
        const description = rows
          .nth(i)
          .locator(this.selectors.ticketDescription)
          .first();
        const text = (await description.textContent().catch(() => '')) || '';
        names.push(text.trim());
      }

      return names;
    });
  }

  /** Get full ticket type info for all rows */
  async getTicketTypes(): Promise<TicketTypeInfo[]> {
    return allure.step('Get ticket type information', async () => {
      await this.waitForTicketPickerReady();

      const rows = this.page.locator(this.selectors.ticketRow);
      const rowCount = await rows.count();
      const types: TicketTypeInfo[] = [];

      for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const name = (
          (await row
            .locator(this.selectors.ticketDescription)
            .first()
            .textContent()
            .catch(() => '')) || ''
        ).trim();
        const price = (
          (await row
            .locator(this.selectors.ticketPrice)
            .first()
            .textContent()
            .catch(() => '')) || ''
        ).trim();
        const quantityInput = row.locator(this.selectors.quantityInput).first();
        const currentQuantity = Number(
          (await quantityInput.getAttribute('value').catch(() => '0')) || '0'
        );
        const maxQuantity = Number(
          (await quantityInput.getAttribute('max').catch(() => '0')) || '0'
        );
        const plusButton = row.locator(this.selectors.incrementButton).first();
        const isAvailable = await plusButton
          .isVisible()
          .then(async (v) => v && !(await plusButton.isDisabled()))
          .catch(() => false);

        types.push({
          name,
          price,
          currentQuantity,
          maxQuantity,
          isAvailable,
        });
      }

      return types;
    });
  }

  /** Check if confirm button is enabled */
  async isConfirmButtonEnabled(): Promise<boolean> {
    const button = this.page.locator(this.selectors.confirmButton).first();
    return button.isEnabled().catch(() => false);
  }

  /** Apply a promotional code */
  async applyPromoCode(code: string, comboOptionText?: string): Promise<void> {
    await allure.step(`Apply promo code: ${code}`, async () => {
      // Open accordion
      await this.webActions.waitForVisible(this.selectors.promoAccordionHeader);
      const isOpen = await this.webActions.isVisible(
        this.selectors.promoAccordionContent
      );
      if (!isOpen) {
        await this.webActions.click(
          this.selectors.promoAccordionHeader,
          'promoAccordionHeader'
        );
        await this.webActions.waitForVisible(
          this.selectors.promoAccordionContent
        );
      }

      // Fill code
      await this.webActions.fill(this.selectors.promoInput, code, 'promoInput');

      // Select combo option if provided
      if (comboOptionText) {
        await this.webActions.click(
          this.selectors.promoComboButton,
          'promoComboButton'
        );
        const optionSelector = `${this.selectors.promoComboOptionText}:has-text("${comboOptionText}")`;
        await this.webActions.waitForVisible(optionSelector);
        await this.webActions.click(optionSelector, 'promoOption');
      }

      // Submit
      await this.webActions.click(
        this.selectors.promoContinueButton,
        'promoContinueButton'
      );
    });
  }
}
