import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { livingTicketSelectors } from '../../../pageObjectsManagers/cinesa/livingTicket/livingTicket.selectors';
import { LivingTicketPage } from '../../../pageObjectsManagers/cinesa/livingTicket/livingTicket.page';
import { LivingTicketSnapshot } from '../../../pageObjectsManagers/cinesa/livingTicket/livingTicket.types';
import { livingTicketValidationData } from './livingTicket.data';

export class LivingTicketAssertions {
  private readonly selectors = livingTicketSelectors;

  constructor(private readonly livingTicketPage: LivingTicketPage) {}

  private get page(): Page {
    return this.livingTicketPage.getCurrentPage();
  }

  private matchesAtLeastOnePattern(value: string, patterns: RegExp[]): boolean {
    return patterns.some((pattern) => pattern.test(value));
  }

  private async isAnyVisible(selector: string): Promise<boolean> {
    const locator = this.page.locator(selector);
    const count = await locator.count().catch(() => 0);

    for (let index = 0; index < count; index += 1) {
      const isVisible = await locator
        .nth(index)
        .isVisible()
        .catch(() => false);

      if (isVisible) {
        return true;
      }
    }

    return false;
  }

  async expectLivingTicketContract(): Promise<void> {
    await allure.step('Verify complete living ticket contract', async () => {
      await this.expectCoreBlocksVisible();
      await this.expectUrlMatchesLivingTicket();

      const snapshot = await this.livingTicketPage.getSnapshot();

      await this.expectHeroContract(snapshot);
      await this.expectCountdownContract(snapshot);
      await this.expectTransactionSummaryContract(snapshot);
    });
  }

  private async expectCoreBlocksVisible(): Promise<void> {
    await allure.step(
      'Verify living ticket core blocks are visible',
      async () => {
        await expect(
          this.page.locator(this.selectors.rootContainer).first()
        ).toBeVisible({
          timeout: 45000,
        });
        await expect(
          this.page.locator(this.selectors.changeSeatsButton).first()
        ).toBeVisible({
          timeout: 30000,
        });
        await expect(
          this.page.locator(this.selectors.transactionSummaryContainer).first()
        ).toBeVisible({ timeout: 30000 });
      }
    );
  }

  private async expectUrlMatchesLivingTicket(): Promise<void> {
    await allure.step('Verify living ticket URL', async () => {
      const currentUrl = this.page.url();
      const urlMatches = this.matchesAtLeastOnePattern(
        currentUrl,
        livingTicketValidationData.livingTicketUrlPatterns
      );

      await allure.parameter('Living ticket URL', currentUrl);
      expect(
        urlMatches,
        `Unexpected living ticket URL: ${currentUrl}`
      ).toBeTruthy();
    });
  }

  private async expectHeroContract(
    snapshot: LivingTicketSnapshot
  ): Promise<void> {
    await allure.step('Verify living ticket hero contract', async () => {
      const hasVisibleQrImage = await this.isAnyVisible(this.selectors.qrImage);
      const hero = snapshot.hero;

      await allure.parameter('QR reference', hero.qrReference || 'N/A');
      await allure.parameter('Cinema name', hero.cinemaName || 'N/A');
      await allure.parameter('Room', hero.room || 'N/A');
      await allure.parameter('Area', hero.area || 'N/A');
      await allure.parameter('Seat row', hero.seatRow || 'N/A');
      await allure.parameter('QR image visible', String(hasVisibleQrImage));

      const hasValidQrReference =
        livingTicketValidationData.qrReferencePattern.test(hero.qrReference);

      expect(
        hasVisibleQrImage || hasValidQrReference,
        'Expected visible QR image or valid QR reference text'
      ).toBeTruthy();

      expect(hero.room).toMatch(livingTicketValidationData.roomPattern);
      expect(hero.area).toMatch(livingTicketValidationData.areaPattern);
      expect(hero.seatRow).toMatch(livingTicketValidationData.seatRowPattern);
    });
  }

  private async expectCountdownContract(
    snapshot: LivingTicketSnapshot
  ): Promise<void> {
    await allure.step('Verify countdown contract', async () => {
      const countdown = snapshot.countdown;

      await allure.parameter('Countdown header', countdown.headerText || 'N/A');
      await allure.parameter('Countdown values', countdown.values.join(', '));
      await allure.parameter('Countdown labels', countdown.labels.join(', '));

      expect(
        this.matchesAtLeastOnePattern(
          countdown.headerText,
          livingTicketValidationData.countdownHeaderPatterns
        ),
        `Unexpected countdown header: ${countdown.headerText}`
      ).toBeTruthy();

      expect(countdown.values.length).toBeGreaterThanOrEqual(1);
      expect(countdown.labels.length).toBeGreaterThanOrEqual(1);

      for (const value of countdown.values) {
        expect(value).toMatch(/^\d{1,2}$/);
      }

      const matchedLabelPatterns =
        livingTicketValidationData.countdownLabelPatterns.filter((pattern) =>
          countdown.labels.some((label) => pattern.test(label))
        );

      expect(
        matchedLabelPatterns.length,
        `Expected at least one countdown unit label, got: ${countdown.labels.join(', ')}`
      ).toBeGreaterThanOrEqual(1);
    });
  }

  private async expectTransactionSummaryContract(
    snapshot: LivingTicketSnapshot
  ): Promise<void> {
    await allure.step('Verify transaction summary contract', async () => {
      const summary = snapshot.transaction;

      await allure.parameter('Transaction id', summary.transactionId || 'N/A');
      await allure.parameter('Movie title', summary.movieTitle || 'N/A');
      await allure.parameter('Session info', summary.sessionInfo || 'N/A');
      await allure.parameter('Line item price', summary.lineItemPrice || 'N/A');
      await allure.parameter('Total price', summary.totalPrice || 'N/A');
      await allure.parameter('Management fee', summary.managementFee || 'N/A');
      await allure.parameter('Savings', summary.savings || 'N/A');

      const requiredChecks: Record<string, boolean> = {
        transactionId:
          summary.transactionId.length > 0 &&
          livingTicketValidationData.transactionIdPattern.test(
            summary.transactionId
          ),
        movieTitle: summary.movieTitle.length > 2,
        sessionInfo:
          summary.sessionInfo.length > 4 &&
          this.matchesAtLeastOnePattern(
            summary.sessionInfo,
            livingTicketValidationData.sessionInfoPatterns
          ),
        totalPrice:
          summary.totalPrice.length > 0 &&
          livingTicketValidationData.currencyPattern.test(summary.totalPrice),
      };

      for (const field of livingTicketValidationData.requiredTransactionFields) {
        expect(
          requiredChecks[field],
          `Missing or invalid required field: ${field}`
        ).toBe(true);
      }

      const optionalValues: Record<string, string> = {
        lineItemPrice: summary.lineItemPrice,
        managementFee: summary.managementFee,
        savings: summary.savings,
      };

      for (const field of livingTicketValidationData.optionalTransactionFields) {
        const value = optionalValues[field];
        if (!value) {
          continue;
        }

        expect(
          livingTicketValidationData.currencyPattern.test(value),
          `Optional monetary field has invalid format: ${field}=${value}`
        ).toBe(true);
      }
    });
  }
}
