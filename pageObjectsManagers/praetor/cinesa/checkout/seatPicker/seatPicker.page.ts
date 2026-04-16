import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import {
  seatPickerSelectors,
  SeatPickerSelectors,
  SeatInfo,
  SeatType,
  SeatState,
} from '../../../../../core/selectors/checkout';
import { WebActions } from '../../../../../core/webactions/webActions';

/**
 * PRAETOR SeatPicker Page Object — Cinesa checkout step 1.
 *
 * MCP-verified selectors from lab Oasiz_ (2026-03-31).
 * All Playwright API calls go through WebActions.
 */
export class PraetorSeatPicker {
  private readonly webActions: WebActions;
  private readonly selectors: SeatPickerSelectors;

  constructor(page: Page) {
    this.webActions = new WebActions(page);
    this.selectors = seatPickerSelectors;
  }

  /** Navigate directly to seat picker for a specific showtime */
  async navigateToShowtime(baseUrl: string, showtimeId: string): Promise<void> {
    await allure.step(
      `Navigate to seat picker for showtime ${showtimeId}`,
      async () => {
        await this.webActions.navigateTo(
          `${baseUrl}/compra/butacas/?showtimeId=${showtimeId}`
        );

        // Fail-fast: check for expired/unavailable session message before waiting for seats
        const page = this.webActions.page;
        const expiredMessage = page.locator(
          'text=/esta sesión no está disponible|sesión.*expirad/i'
        );
        const seatLocator = page.locator(this.selectors.seat);

        // Race: either seats appear or expired message shows
        const result = await Promise.race([
          seatLocator
            .first()
            .waitFor({ state: 'visible', timeout: 25000 })
            .then(() => 'seats' as const),
          expiredMessage
            .first()
            .waitFor({ state: 'visible', timeout: 25000 })
            .then(() => 'expired' as const),
        ]);

        if (result === 'expired') {
          throw new Error(
            `Showtime ${showtimeId} is expired or unavailable. ` +
              `Run 'TEST_ENV=${process.env.TEST_ENV || 'production'} npx playwright test --project=showtimes-setup' to refresh.`
          );
        }
      }
    );
  }

  /** Wait for seats to be loaded and interactive */
  async waitForSeatsReady(): Promise<void> {
    await allure.step('Wait for seats to be ready', async () => {
      await this.webActions.waitForSelector(this.selectors.seat, {
        timeout: 25000,
        state: 'visible',
      });
    });
  }

  /** Dismiss any blocking modal (promotional popup, attribute modal, global-popup) */
  async dismissBlockingModals(): Promise<void> {
    await allure.step('Dismiss blocking modals if present', async () => {
      const page = this.webActions.getPage();

      // Close preprod "Hey! Ho!" build version banner if present
      const heyHoBanner = page.locator('text="Hey! Ho!"');
      if (await heyHoBanner.isVisible({ timeout: 1000 }).catch(() => false)) {
        // The X close button is a sibling or nearby element
        const closeBtn = heyHoBanner.locator('xpath=ancestor::div[1]').locator('button, [role="button"], svg').first();
        if (await closeBtn.count().catch(() => 0) > 0) {
          await closeBtn.click().catch(() => {});
          await this.webActions.wait(300);
        } else {
          // Fallback: click the X icon that appears near the banner
          const xButton = page.locator('.close, [aria-label="close"], [aria-label="Close"]').first();
          if (await xButton.count().catch(() => 0) > 0) {
            await xButton.click().catch(() => {});
            await this.webActions.wait(300);
          }
        }
      }

      const maxAttempts = 3;
      for (let i = 0; i < maxAttempts; i++) {
        const modalLocator = this.webActions.getLocator(
          this.selectors.genericModal
        );
        const modalCount = await modalLocator.count();
        if (modalCount === 0) break;

        const isModalVisible = await modalLocator.first().isVisible();
        if (!isModalVisible) break;

        // Try accept button first, then close button — use locator.first() to avoid strict mode
        const acceptLocator = this.webActions.getLocator(
          this.selectors.genericModalAccept
        );
        if (
          (await acceptLocator.count()) > 0 &&
          (await acceptLocator.first().isVisible())
        ) {
          await acceptLocator.first().click();
        } else {
          const closeLocator = this.webActions.getLocator(
            this.selectors.genericModalClose
          );
          if (
            (await closeLocator.count()) > 0 &&
            (await closeLocator.first().isVisible())
          ) {
            await closeLocator.first().click();
          } else {
            // Force-dismiss video modals (D-BOX/ScreenX) that have no accessible close button.
            // These modals auto-close after ~60s; removing them via JS saves that wait.
            await page.evaluate(() => {
              document.querySelectorAll('aside.v-modal[role="dialog"]').forEach(el => el.remove());
              document.querySelectorAll('.v-modal-overlay, .v-modal__backdrop, .v-modal__mask').forEach(el => el.remove());
            });
          }
        }
        await this.webActions.wait(500);
      }
    });
  }

  /** Get all seats with their parsed info */
  async getAllSeats(): Promise<SeatInfo[]> {
    return await allure.step('Get all seat information', async () => {
      const seats = await this.webActions.evaluate<string>(() => {
        const seatElements = document.querySelectorAll('.v-seat-picker-seat');
        return JSON.stringify(
          Array.from(seatElements).map((seat) => ({
            ariaLabel: seat.getAttribute('aria-label') || '',
            classes: seat.getAttribute('class') || '',
            ariaPressed: seat.getAttribute('aria-pressed'),
          }))
        );
      });
      const rawSeats: {
        ariaLabel: string;
        classes: string;
        ariaPressed: string | null;
      }[] = JSON.parse(seats as string);
      return rawSeats.map((s) => this.parseSeatInfo(s));
    });
  }

  /** Get count of available seats */
  async getAvailableSeatCount(): Promise<number> {
    return await allure.step('Count available seats', async () => {
      return await this.webActions.getElementCount(
        this.selectors.seatAvailable
      );
    });
  }

  /** Get count of selected seats */
  async getSelectedSeatCount(): Promise<number> {
    return await allure.step('Count selected seats', async () => {
      return await this.webActions.getElementCount(this.selectors.seatSelected);
    });
  }

  /** Select the first available normal seat (with retry on failure) */
  async selectFirstAvailableSeat(): Promise<SeatInfo | null> {
    return await allure.step('Select first available seat', async () => {
      const maxRetries = 5;
      const page = this.webActions.getPage();

      // Selector for available seats excluding wheelchair and companion
      const availableSel =
        '.v-seat-picker-seat--available:not(.v-seat-picker-seat--wheelchair):not(.v-seat-picker-seat--companion)';
      const count = await this.webActions.getElementCount(availableSel);
      if (count === 0) return null;

      for (let attempt = 0; attempt < Math.min(maxRetries, count); attempt++) {
        const seat = this.webActions.getLocator(availableSel).nth(attempt);

        // Scroll into view and click via Playwright (real mouse events)
        await seat.scrollIntoViewIfNeeded();
        await seat.click();

        // Get info about what we clicked
        const label = (await seat.getAttribute('aria-label')) || '';
        const classAttr = (await seat.getAttribute('class')) || '';
        const isSofa =
          classAttr.includes('sofa-left') || classAttr.includes('sofa-right');

        // If sofa, also click the pair
        if (isSofa) {
          let pairLabel = '';
          const rightMatch = label.match(/Right sofa (\d+)-(\d+)/);
          const leftMatch = label.match(/Left sofa (\d+)-(\d+)/);
          if (rightMatch) {
            pairLabel = `Left sofa ${rightMatch[1]}-${parseInt(rightMatch[2]) + 1}`;
          } else if (leftMatch) {
            pairLabel = `Right sofa ${leftMatch[1]}-${parseInt(leftMatch[2]) - 1}`;
          }
          if (pairLabel) {
            const pair = page.locator(`[aria-label="${pairLabel}"]`);
            if ((await pair.count()) > 0) {
              await pair.scrollIntoViewIfNeeded();
              await pair.click();
            }
          }
        }

        await this.webActions.wait(500);
        await this.dismissBlockingModals();

        // Verify seat is actually selected (button never has disabled attr)
        const selectedCount = await this.webActions.getElementCount(
          this.selectors.seatSelected
        );
        if (selectedCount > 0) {
          const selected = await this.getSelectedSeats();
          return selected.length > 0 ? selected[0] : null;
        }

        // Seat click didn't register — deselect and try next
        await seat.click().catch(() => {});
        if (isSofa) {
          // Also deselect the pair if we clicked one
          const selectedPairs = page.locator('.v-seat-picker-seat--selected');
          const selectedCount = await selectedPairs.count();
          for (let i = 0; i < selectedCount; i++) {
            await selectedPairs
              .nth(i)
              .click()
              .catch(() => {});
          }
        }
        await this.webActions.wait(500);
      }

      return null;
    });
  }

  /** Select a random available seat (any type except wheelchair/companion) */
  async selectRandomAvailableSeat(): Promise<SeatInfo | null> {
    return await allure.step('Select random available seat', async () => {
      const allSeats = await this.getAllSeats();
      const candidates = allSeats.filter(
        (s) =>
          s.seatState === 'available' &&
          s.seatType !== 'wheelchair' &&
          s.seatType !== 'companion'
      );
      if (candidates.length === 0) return null;

      const randomSeat =
        candidates[Math.floor(Math.random() * candidates.length)];

      const seatLocator = this.webActions.getLocator(
        `[aria-label="${randomSeat.ariaLabel}"]`
      );
      await seatLocator.scrollIntoViewIfNeeded();
      await seatLocator.click();
      await this.webActions.wait(500);
      await this.dismissBlockingModals();

      const selected = await this.getSelectedSeats();
      return selected.length > 0 ? selected[0] : randomSeat;
    });
  }

  /** Select a wheelchair space (triggers wheelchair confirmation modal) */
  async selectWheelchairSeat(): Promise<SeatInfo | null> {
    return await allure.step('Select wheelchair seat', async () => {
      const selector = `${this.selectors.seatWheelchair}${this.selectors.seatAvailable}`;
      const count = await this.webActions.getElementCount(selector);
      if (count === 0) return null;

      await this.webActions.getLocator(selector).first().click({ force: true });
      await this.webActions.wait(500);

      // Handle wheelchair confirmation modal
      const modalVisible = await this.webActions.isVisible(
        this.selectors.wheelchairModal
      );
      if (modalVisible) {
        await this.webActions.click(
          this.selectors.wheelchairModalAccept,
          'wheelchairModalAccept'
        );
        await this.webActions.wait(500);
      }

      const selected = await this.getSelectedSeats();
      return selected.length > 0 ? selected[0] : null;
    });
  }

  /** Get currently selected seats */
  async getSelectedSeats(): Promise<SeatInfo[]> {
    return await allure.step('Get selected seats', async () => {
      const allSeats = await this.getAllSeats();
      return allSeats.filter((s) => s.isSelected);
    });
  }

  /** Click Continuar to proceed to next step (Login) */
  async confirmSeats(): Promise<void> {
    await allure.step('Confirm seat selection and proceed', async () => {
      // Dismiss any blocking modals (e.g., D-BOX attribute warning) before confirming
      await this.dismissBlockingModals();

      // Verify at least one seat is selected before confirming
      const selectedCount = await this.webActions.getElementCount(
        this.selectors.seatSelected
      );
      if (selectedCount === 0) {
        throw new Error('Cannot confirm seats: no seats are selected');
      }

      // Check for gap/aisle warnings that block navigation
      const page = this.webActions.getPage();
      const gapWarning = page.locator(
        'text=/no se puede dejar|butaca sin seleccionar|selecciona también|butaca del pasillo/i'
      );
      if (await gapWarning.isVisible({ timeout: 1500 }).catch(() => false)) {
        // Gap detected — deselect all, then re-select adjacent seats
        await allure.step('Gap detected — re-selecting adjacent seats', async () => {
          const currentSelected = await this.webActions.getElementCount(
            this.selectors.seatSelected
          );
          // Deselect all
          for (let i = 0; i < currentSelected; i++) {
            const sel = page.locator(this.selectors.seatSelected).first();
            await sel.click();
            await this.webActions.wait(300);
          }
          // Re-select using adjacent seat logic
          await this.selectAdjacentSeats(currentSelected);
          await this.webActions.wait(1000);
        });
      }

      const button = this.webActions.getLocator(this.selectors.confirmButton);
      await button.waitFor({ state: 'visible', timeout: 5000 });

      // Click and wait for navigation away from seat picker
      await Promise.all([
        page.waitForURL(/compra\/(inicio-de-sesion|tus-entradas)/, {
          timeout: 20000,
          waitUntil: 'domcontentloaded',
        }),
        button.click(),
      ]);
    });
  }

  /**
   * Select N adjacent seats in the same row to avoid gap validation.
   * Evaluates the DOM to find a row with N+ consecutive available seats.
   */
  private async selectAdjacentSeats(count: number): Promise<void> {
    await allure.step(`Select ${count} adjacent seats`, async () => {
      const page = this.webActions.getPage();

      // Seats live inside SVG <g> groups (not .v-seat-picker-row which doesn't exist)
      const adjacentGroup = await page.evaluate((needed: number) => {
        const allGs = Array.from(document.querySelectorAll('g'));
        for (const g of allGs) {
          const directSeats = Array.from(g.children).filter((c) =>
            (c as HTMLElement).classList.contains('v-seat-picker-seat')
          );
          // Skip groups that aren't seat rows (the parent <g> contains all seats)
          if (directSeats.length === 0 || directSeats.length > 30) continue;
          let consecutive: Element[] = [];
          for (const seat of directSeats) {
            const cl = (seat as HTMLElement).classList;
            if (
              cl.contains('v-seat-picker-seat--available') &&
              !cl.contains('v-seat-picker-seat--wheelchair') &&
              !cl.contains('v-seat-picker-seat--companion')
            ) {
              consecutive.push(seat);
              if (consecutive.length >= needed) {
                return consecutive.map((s) => s.getAttribute('aria-label') || '');
              }
            } else {
              consecutive = [];
            }
          }
        }
        return null;
      }, count);

      if (!adjacentGroup) {
        throw new Error(
          `Could not find ${count} adjacent available seats in any row`
        );
      }

      for (const label of adjacentGroup) {
        const seat = page.locator(`[aria-label="${label}"]`);
        await seat.scrollIntoViewIfNeeded();
        await seat.click();
        await this.webActions.wait(500);
      }
    });
  }

  /** Check if Continuar button is enabled */
  async isConfirmButtonEnabled(): Promise<boolean> {
    return await allure.step('Check if confirm button is enabled', async () => {
      const locator = this.webActions.getLocator(this.selectors.confirmButton);
      return await locator.isEnabled();
    });
  }

  /** Get total seat count */
  async getTotalSeatCount(): Promise<number> {
    return await allure.step('Count total seats', async () => {
      return await this.webActions.getElementCount(this.selectors.seat);
    });
  }

  /** Get pricing cards displayed */
  async getPricingCards(): Promise<{ label: string; price: string }[]> {
    return await allure.step('Get pricing card information', async () => {
      const data = await this.webActions.evaluate<string>(() => {
        const cards = document.querySelectorAll('.pricing-card');
        return JSON.stringify(
          Array.from(cards).map((c) => ({
            label:
              c.querySelector('.pricing-card__label')?.textContent?.trim() ||
              '',
            price:
              c.querySelector('.pricing-card__price')?.textContent?.trim() ||
              '',
          }))
        );
      });
      return JSON.parse(data as string);
    });
  }

  /** Parse raw seat data into structured SeatInfo */
  private parseSeatInfo(raw: {
    ariaLabel: string;
    classes: string;
    ariaPressed: string | null;
  }): SeatInfo {
    const label = raw.ariaLabel;
    const classes = raw.classes;

    // Parse type from CSS classes
    let seatType: SeatType = 'normal';
    if (classes.includes('--sofa-left')) seatType = 'sofa-left';
    else if (classes.includes('--sofa-right')) seatType = 'sofa-right';
    else if (classes.includes('--companion')) seatType = 'companion';
    else if (classes.includes('--wheelchair')) seatType = 'wheelchair';

    // Parse state from CSS classes
    let seatState: SeatState = 'available';
    if (classes.includes('--selected')) seatState = 'selected';
    else if (classes.includes('--unavailable')) seatState = 'unavailable';

    // Parse row-seat from aria-label: "Normal seat 4-11" → row=4, seat=11
    const match = label.match(/(\d+)-(\d+)$/);
    const row = match ? parseInt(match[1], 10) : 0;
    const seatNumber = match ? parseInt(match[2], 10) : 0;

    return {
      ariaLabel: label,
      seatType,
      seatState,
      row,
      seatNumber,
      isSelected: raw.ariaPressed === 'true' || classes.includes('--selected'),
    };
  }
}
