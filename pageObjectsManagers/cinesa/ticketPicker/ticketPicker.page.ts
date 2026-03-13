import { Locator, Page } from '@playwright/test';
import { WebActions } from '../../../core/webactions/webActions';
import { TICKET_PICKER_SELECTORS } from './ticketPicker.selectors';
import { allure } from 'allure-playwright';

/**
 * TicketPicker Page Object
 *
 * Manages ticket type selection and promotional code handling in the booking flow.
 * Follows framework architecture with pure asynchronous waiting philosophy.
 *
 * Architecture Compliance:
 * - Uses WebActions for: click(), fill(), isVisible(), getText(), getElementCount()
 * - Uses page.locator() for: force clicks and state checks when WebActions doesn't expose them
 * - Uses page.evaluate() for: JavaScript DOM manipulation (not currently needed)
 *
 * Async Waiting Philosophy:
 * ❌ NO fixed delays: wait(500), wait(1000), wait(2000)
 * ❌ NO explicit timeouts: waitFor({ timeout: 10000 })
 * ❌ NO timeout parameters: waitForVisible(selector, 7000)
 * ✅ YES: Pure async auto-waiting via Playwright's built-in mechanisms
 * ✅ YES: Assertions handle all timing (expect().toBeVisible())
 * ✅ YES: Actions auto-wait for actionability (click(), fill())
 *
 * Special Case: 3D Glasses Modal
 * - Appears unpredictably during ticket selection
 * - Blocks all interactions with overlay
 * - Must be handled opportunistically without blocking main flow
 *
 * @see docs/adrs/0009-page-object-architecture-rules.md
 * @see .github/copilot-instructions.md
 */
export class TicketPicker {
  private readonly page: Page; // Only for force clicks and state checks
  private readonly selectors = TICKET_PICKER_SELECTORS;
  private readonly preferredTicketDescriptionPatterns = [
    /adult/i,
    /normal/i,
    /general/i,
    /entrada/i,
  ];
  private readonly excludedTicketDescriptionPatterns = [
    /mycinesa/i,
    /pack/i,
    /menu/i,
    /bundle/i,
    /inicia sesi[oó]n/i,
  ];

  constructor(private readonly webActions: WebActions) {
    this.page = webActions.page;
  }

  private async getSelectableTicketRows(): Promise<Locator[]> {
    const ticketRows = this.page.locator(this.selectors.ticketRow);
    const rowCount = await ticketRows.count();
    const prioritizedRows: Array<{ row: Locator; priority: number }> = [];

    for (let index = 0; index < rowCount; index += 1) {
      const row = ticketRows.nth(index);
      const plusButton = row.locator(this.selectors.incrementButton).first();
      const quantityInput = row.locator(this.selectors.quantityInput).first();

      const hasPlusButton = await plusButton.isVisible().catch(() => false);
      if (!hasPlusButton) {
        continue;
      }

      const isDisabled = await plusButton.isDisabled().catch(() => true);
      if (isDisabled) {
        continue;
      }

      const descriptionText = (
        (await row
          .locator(this.selectors.ticketDescription)
          .first()
          .textContent()
          .catch(() => '')) || ''
      ).trim();

      if (
        this.excludedTicketDescriptionPatterns.some((pattern) =>
          pattern.test(descriptionText)
        )
      ) {
        continue;
      }

      const currentValue = Number(
        (await quantityInput.getAttribute('value').catch(() => '0')) || '0'
      );
      const maxValue = Number(
        (await quantityInput.getAttribute('max').catch(() => '1')) || '1'
      );

      if (Number.isFinite(maxValue) && currentValue >= maxValue) {
        continue;
      }

      const priority = this.preferredTicketDescriptionPatterns.some((pattern) =>
        pattern.test(descriptionText)
      )
        ? 0
        : 1;

      prioritizedRows.push({ row, priority });
    }

    return prioritizedRows
      .sort((left, right) => left.priority - right.priority)
      .map(({ row }) => row);
  }

  private async clickIncrementForRow(row: Locator): Promise<void> {
    const plusButton = row.locator(this.selectors.incrementButton).first();

    try {
      await plusButton.click();
    } catch {
      await plusButton.click({ force: true });
    }
  }

  private async getRemainingCapacityForRow(row: Locator): Promise<number> {
    const quantityInput = row.locator(this.selectors.quantityInput).first();
    const currentValue = Number(
      (await quantityInput.getAttribute('value').catch(() => '0')) || '0'
    );
    const maxValue = Number(
      (await quantityInput.getAttribute('max').catch(() => '1')) || '1'
    );

    if (!Number.isFinite(maxValue)) {
      return 1;
    }

    return Math.max(0, maxValue - currentValue);
  }

  /**
   * Adds tickets by clicking the increment button.
   *
   * Pure async approach:
   * - No fixed delays between clicks
   * - Relies on Playwright's auto-waiting for actionability
   * - Handles 3D glasses modal opportunistically
   *
   * @param seats - Number of tickets to add (default: 1)
   */
  private async addTicket(seats?: number): Promise<void> {
    await allure.step(
      `Add ${seats || 1} ticket(s) by clicking increment button`,
      async () => {
        // Handle glasses modal if present (non-blocking check)
        await this.handleGlassesModalImmediately();

        // Wait for ticket picker to be visible (pure async, no timeout param)
        // Note: Using .first() to avoid strict mode violation (multiple ticket rows exist)
        const firstTicketRow = this.page
          .locator(this.selectors.ticketRow)
          .first();
        await firstTicketRow.waitFor({ state: 'visible' });

        const clickCount = typeof seats === 'number' && seats > 0 ? seats : 1;

        let ticketsAdded = 0;
        const selectableRows = await this.getSelectableTicketRows();

        if (selectableRows.length === 0) {
          throw new Error(
            'No selectable ticket rows were found in ticket picker'
          );
        }

        for (const row of selectableRows) {
          if (ticketsAdded >= clickCount) {
            break;
          }

          const remainingCapacity = await this.getRemainingCapacityForRow(row);
          const clicksForRow = Math.min(
            remainingCapacity,
            clickCount - ticketsAdded
          );

          for (let index = 0; index < clicksForRow; index += 1) {
            await this.clickIncrementForRow(row);
            ticketsAdded += 1;

            // Check for modal after each click (may appear during selection)
            await this.handleGlassesModalImmediately();
          }
        }

        if (ticketsAdded < clickCount) {
          throw new Error(
            `Unable to add requested tickets. Requested=${clickCount}, Added=${ticketsAdded}`
          );
        }
      }
    );
  }

  /**
   * Confirms the selected tickets by clicking the confirm button.
   */
  private async confirmTickets(): Promise<void> {
    await allure.step('Confirm selected tickets', async () => {
      // Wait for confirm button to be visible before clicking
      await this.webActions.waitForVisible(this.selectors.confirmButton);
      await this.webActions.click(this.selectors.confirmButton);
    });
  }

  /**
   * Selects tickets and confirms the selection.
   *
   * Main entry point for ticket selection flow.
   * Pure async: relies on Playwright auto-waiting, no fixed delays.
   *
   * @param seats - Number of tickets to select (default: 1)
   */
  async selectTicket(seats?: number): Promise<void> {
    // Handle glasses modal before starting (opportunistic check)
    await this.handleGlassesModalImmediately();

    // Add tickets (clicks increment button)
    await this.addTicket(seats);

    // Final modal check before confirming
    await this.handleGlassesModalImmediately();

    // Confirm tickets (proceeds to next step)
    await this.confirmTickets();
  }

  /**
   * Handles the 3D glasses modal that may appear during ticket selection.
   *
   * Opportunistic approach:
   * - Checks if modal is visible (non-blocking)
   * - Tries multiple button selector strategies
   * - Returns immediately if modal not present
   * - Uses force click to bypass overlay blocking
   *
   * Note: Uses page.locator() for force clicks as WebActions doesn't expose this.
   * This is acceptable per architecture guidelines for specialized interactions.
   */
  private async handleGlassesModalImmediately(): Promise<void> {
    try {
      const glassesModal = 'aside.v-modal.glasses-modal[role="dialog"]';

      // Check if modal is visible (quick check, no retry loop needed)
      const isVisible = await this.webActions.isVisible(glassesModal);

      if (!isVisible) {
        return; // Modal not present, continue
      }

      // Modal is present - try multiple button selector strategies
      const strategies = [
        // Strategy 1: Exact button with text
        `${glassesModal} button:has-text("Seleccionar")`,
        // Strategy 2: Button by class hierarchy (from actual HTML)
        `${glassesModal} .v-modal-footer .v-button--color-primary`,
        // Strategy 3: Any button in the footer
        `${glassesModal} .v-modal-footer button`,
        // Strategy 4: Any v-button in the modal
        `${glassesModal} .v-button`,
        // Strategy 5: Generic button in modal
        `${glassesModal} button`,
      ];

      // Try each strategy until one succeeds
      for (const buttonSelector of strategies) {
        try {
          const button = this.page.locator(buttonSelector).first();

          // Check if button exists and is visible (pure async)
          const buttonExists = await button.isVisible();

          if (buttonExists) {
            // Force click to bypass overlay
            // Note: Using page.locator() as WebActions doesn't expose force click
            await button.click({ force: true });

            // Verify modal disappeared (pure async check)
            const stillPresent = await this.webActions.isVisible(glassesModal);
            if (!stillPresent) {
              return; // Successfully closed modal
            }
          }
        } catch {
          // Strategy failed, try next one
          continue;
        }
      }
    } catch {
      // Modal handling failed, continue with main flow
      // This is non-critical - ticket selection can proceed
    }
  }

  /**
   * Retrieves all available ticket type names.
   *
   * Pure async: No explicit timeouts, relies on auto-waiting.
   *
   * @returns Array of ticket type names (empty string if name not found)
   */
  async getTicketTypeNames(): Promise<string[]> {
    // Wait for at least one ticket title to be visible (using first() to avoid strict mode violation)
    const firstTicketTitle = `${this.selectors.ticketTitle} >> nth=0`;
    await this.webActions.waitForVisible(
      firstTicketTitle,
      30000,
      'Wait for ticket types to load'
    );

    // Get count of ticket rows
    const count = await this.webActions.getElementCount(
      this.selectors.ticketRow
    );

    // Extract names from each row
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const selector = `${this.selectors.ticketRow}:nth-child(${i + 1}) ${this.selectors.ticketTitle}`;
      try {
        const name = await this.webActions.getText(selector);
        names.push(name.trim());
      } catch {
        names.push(''); // Row exists but name not found
      }
    }
    return names;
  }

  /**
   * Opens the promotional code accordion if not already open.
   * Pure async: No timeouts, Playwright handles waiting.
   */
  private async openPromoAccordion(): Promise<void> {
    // Wait for accordion header to be visible
    await this.webActions.waitForVisible(this.selectors.promoAccordionHeader);

    // Check if content is already visible (idempotent)
    const isContentVisible = await this.webActions.isVisible(
      this.selectors.promoAccordionContent
    );

    if (!isContentVisible) {
      // Click to expand accordion
      await this.webActions.click(this.selectors.promoAccordionHeader);

      // Wait for content to become visible (pure async)
      await this.webActions.waitForVisible(
        this.selectors.promoAccordionContent
      );
    }
  }

  /**
   * Fills the promotional code input field.
   * Pure async: fill() auto-waits for element to be editable.
   *
   * @param promo - Promotional code to enter
   */
  private async fillPromoInput(promo: string): Promise<void> {
    // Wait for input to be visible, then fill
    // Playwright auto-waits for element to be editable
    await this.webActions.waitForVisible(this.selectors.promoInput);
    await this.webActions.fill(this.selectors.promoInput, promo);
  }

  /**
   * Selects an option from the promotional code combo/dropdown.
   * Pure async: No timeouts, actions auto-wait.
   *
   * @param optionText - Text of the option to select
   */
  private async selectPromoComboOption(optionText: string): Promise<void> {
    // Wait for combo button, then click to open dropdown
    await this.webActions.waitForVisible(this.selectors.promoComboButton);
    await this.webActions.click(this.selectors.promoComboButton);

    // Wait for option to appear, then click it
    const optionSelector = `${this.selectors.promoComboOptionText}:has-text("${optionText}")`;
    await this.webActions.waitForVisible(optionSelector);
    await this.webActions.click(optionSelector);
  }

  /**
   * Clicks the continue button in the promotional code form.
   * Pure async: click() auto-waits for actionability.
   */
  private async clickPromoContinue(): Promise<void> {
    await this.webActions.waitForVisible(this.selectors.promoContinueButton);
    await this.webActions.click(this.selectors.promoContinueButton);
  }

  /**
   * Complete flow to apply a promotional code.
   *
   * Steps:
   * 1. Open accordion (if closed)
   * 2. Fill promotional code
   * 3. Select from dropdown
   * 4. Click continue
   *
   * Pure async throughout - no fixed delays.
   *
   * @param promo - Promotional code to apply
   */
  async selectPromotionalCode(promo: string): Promise<void> {
    await this.openPromoAccordion();
    await this.fillPromoInput(promo);
    await this.selectPromoComboOption(promo);
    await this.clickPromoContinue();
  }
}
