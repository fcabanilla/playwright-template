import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import { livingTicketSelectors } from './livingTicket.selectors';
import {
  LivingTicketCountdownSnapshot,
  LivingTicketHeroSnapshot,
  LivingTicketSnapshot,
  LivingTicketTransactionSnapshot,
} from './livingTicket.types';

export class LivingTicketPage {
  private readonly selectors = livingTicketSelectors;
  private readonly reviewTicketUrlPattern =
    /(revision-de-tu-compra|review-ticket|living-ticket)/i;

  constructor(private readonly webActions: WebActions) {}

  private normalizeText(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  private extractFirstMatch(text: string, patterns: RegExp[]): string {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return this.normalizeText(match[1]);
      }
    }

    return '';
  }

  private async getFirstVisibleLocatorText(selector: string): Promise<string> {
    const locator = this.webActions.getLocator(selector);
    const count = await locator.count().catch(() => 0);

    for (let index = 0; index < count; index += 1) {
      const candidate = locator.nth(index);
      const isVisible = await candidate.isVisible().catch(() => false);
      if (!isVisible) {
        continue;
      }

      const text = (await candidate.textContent().catch(() => '')) || '';
      const normalized = this.normalizeText(text);
      if (normalized.length > 0) {
        return normalized;
      }
    }

    return '';
  }

  private async getFirstVisibleTextFromSelectors(
    selectors: string[]
  ): Promise<string> {
    for (const selector of selectors) {
      const text = await this.getFirstVisibleLocatorText(selector);
      if (text) {
        return text;
      }
    }

    return '';
  }

  private async getHeroFieldValue(
    selector: string,
    fallbackSourceText: string,
    patterns: RegExp[]
  ): Promise<string> {
    const selectorValue = await this.getFirstVisibleLocatorText(selector);
    if (selectorValue) {
      return selectorValue;
    }

    return this.extractFirstMatch(fallbackSourceText, patterns);
  }

  private async getHeroFieldValueFromListItem(
    labelPatterns: RegExp[]
  ): Promise<string> {
    const items = this.webActions.getLocator(this.selectors.heroDetailItems);
    const count = await items.count().catch(() => 0);

    for (let index = 0; index < count; index += 1) {
      const item = items.nth(index);
      const itemText = this.normalizeText(
        (await item.textContent().catch(() => '')) || ''
      );

      const matchingPattern = labelPatterns.find((pattern) =>
        pattern.test(itemText)
      );

      if (!matchingPattern) {
        continue;
      }

      const normalizedValue = itemText.replace(matchingPattern, '').trim();
      if (normalizedValue) {
        return normalizedValue;
      }
    }

    return '';
  }

  private async isAnyVisible(selector: string): Promise<boolean> {
    const locator = this.webActions.getLocator(selector);
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

  getCurrentPage(): Page {
    return this.webActions.getPage();
  }

  async waitForLoaded(timeout = 45000): Promise<void> {
    await allure.step('Wait for living ticket page to load', async () => {
      await this.webActions.syncToLatestActivePage();
      await this.webActions.waitForLoadState('domcontentloaded');
      const urlMatched = await this.webActions.waitForUrlMatching(
        this.reviewTicketUrlPattern,
        Math.min(timeout, 25000)
      );

      if (!urlMatched) {
        throw new Error(
          'Living ticket URL did not match expected review-ticket pattern'
        );
      }

      await this.closeWebloyaltyOverlayWithStabilization(7000);

      await this.webActions.waitForVisible(
        this.selectors.changeSeatsButton,
        timeout,
        'livingTicketChangeSeatsButton'
      );

      const summaryDeadline = Date.now() + timeout;
      while (Date.now() < summaryDeadline) {
        const summaryVisible = await this.isAnyVisible(
          this.selectors.transactionSummaryContainer
        );
        if (summaryVisible) {
          break;
        }
        await this.webActions.wait(250);
      }

      const hasSummary = await this.isAnyVisible(
        this.selectors.transactionSummaryContainer
      );
      if (!hasSummary) {
        throw new Error(
          'Living ticket transaction summary container was not visible'
        );
      }

      await this.closeWebloyaltyOverlayWithStabilization(7000);
    });
  }

  async isWebloyaltyOverlayVisible(): Promise<boolean> {
    await this.webActions.syncToLatestActivePage();
    return await this.isAnyVisible(this.selectors.webloyaltyOverlayContainer);
  }

  async closeWebloyaltyOverlayWithXIfVisible(): Promise<boolean> {
    await this.webActions.syncToLatestActivePage();

    const overlayVisible = await this.isWebloyaltyOverlayVisible();
    if (!overlayVisible) {
      return false;
    }

    await this.webActions.waitForVisible(
      this.selectors.webloyaltyOverlayCloseButton,
      5000,
      'livingTicketWebloyaltyOverlayCloseButton'
    );
    await this.webActions.click(
      this.selectors.webloyaltyOverlayCloseButton,
      'livingTicketWebloyaltyOverlayCloseButton'
    );

    const hideDeadline = Date.now() + 7000;
    while (Date.now() < hideDeadline) {
      const stillVisible = await this.isWebloyaltyOverlayVisible();
      if (!stillVisible) {
        break;
      }
      await this.webActions.wait(200);
    }

    return true;
  }

  async closeWebloyaltyOverlayWithStabilization(
    maxWaitMs = 7000
  ): Promise<boolean> {
    const deadline = Date.now() + maxWaitMs;
    let hiddenSince = Date.now();
    let closedAtLeastOnce = false;

    while (Date.now() < deadline) {
      const overlayVisible = await this.isWebloyaltyOverlayVisible();

      if (overlayVisible) {
        hiddenSince = 0;
        const closed = await this.closeWebloyaltyOverlayWithXIfVisible();
        closedAtLeastOnce = closedAtLeastOnce || closed;
        await this.webActions.wait(250);
        continue;
      }

      if (hiddenSince === 0) {
        hiddenSince = Date.now();
      }

      if (Date.now() - hiddenSince >= 1200) {
        return closedAtLeastOnce;
      }

      await this.webActions.wait(250);
    }

    return closedAtLeastOnce;
  }

  async isLoaded(): Promise<boolean> {
    await this.webActions.syncToLatestActivePage();

    const hasCountdown = await this.webActions
      .getLocator(this.selectors.countdownHeader)
      .first()
      .isVisible()
      .catch(() => false);
    const hasTransactionSummary = await this.webActions
      .getLocator(this.selectors.transactionSummaryContainer)
      .first()
      .isVisible()
      .catch(() => false);

    return hasCountdown && hasTransactionSummary;
  }

  async clickChangeSeats(): Promise<void> {
    await this.webActions.click(
      this.selectors.changeSeatsButton,
      'livingTicketChangeSeatsButton'
    );
  }

  async clickReturnTickets(): Promise<void> {
    await this.webActions.click(
      this.selectors.returnTicketsButton,
      'livingTicketReturnTicketsButton'
    );
  }

  async clickAddToGoogleWallet(): Promise<void> {
    await this.webActions.click(
      this.selectors.googleWalletButton,
      'livingTicketGoogleWalletButton'
    );
  }

  async clickShareTickets(): Promise<void> {
    await this.webActions.click(
      this.selectors.shareTicketsLink,
      'livingTicketShareTicketsLink'
    );
  }

  async clickAddToCalendar(): Promise<void> {
    await this.webActions.click(
      this.selectors.addToCalendarLink,
      'livingTicketAddToCalendarLink'
    );
  }

  async getHeroSnapshot(): Promise<LivingTicketHeroSnapshot> {
    let qrReference = await this.getFirstVisibleLocatorText(
      this.selectors.qrReference
    );

    let heroText = await this.getFirstVisibleLocatorText(
      this.selectors.heroContainer
    );
    if (!heroText) {
      heroText = await this.getFirstVisibleLocatorText(
        this.selectors.rootContainer
      );
    }

    if (!qrReference) {
      const contextualQrMatch = heroText.match(
        /\b([A-Za-z0-9-]{5,12})\b\s+[\p{L}_]{3,20}\s+(?:sala|room)/iu
      );
      if (contextualQrMatch?.[1]) {
        qrReference = this.normalizeText(contextualQrMatch[1]);
      }
    }

    if (!qrReference) {
      const pageText =
        ((await this.webActions
          .getLocator(this.selectors.pageBody)
          .first()
          .textContent()
          .catch(() => '')) || '') + ` ${heroText}`;

      const tokenCandidates = pageText.match(/\b[A-Za-z0-9-]{5,}\b/g) || [];
      const excludedTokens = new Set([
        'OASIZ',
        'CINESA',
        'SALA',
        'AREA',
        'ÁREA',
        'LUXE',
        'FILA',
        'BUTACAS',
        'CAMBIAR',
        'DEVOLVER',
      ]);
      const bestCandidate = tokenCandidates.find(
        (token) => !excludedTokens.has(token.toUpperCase())
      );
      qrReference = bestCandidate || '';
    }

    qrReference = qrReference.toUpperCase().replace(/[^A-Z0-9-]/g, '');

    let cinemaName = await this.getFirstVisibleLocatorText(
      this.selectors.cinemaName
    );
    if (!cinemaName) {
      const cinemaMatch = heroText.match(
        /\b([\p{L}]{3,20}_?)\b\s+(?:sala|room)/iu
      );
      cinemaName = this.normalizeText(cinemaMatch?.[1] || '');
    }

    const pageText = this.normalizeText(
      (await this.webActions
        .getLocator(this.selectors.pageBody)
        .first()
        .textContent()
        .catch(() => '')) || ''
    );
    const fallbackSourceText = `${heroText} ${pageText}`;

    const roomValue =
      (await this.getHeroFieldValueFromListItem([
        /^(?:sala|room)\b\s*[:\-]?\s*/i,
      ])) ||
      (await this.getHeroFieldValue(
        this.selectors.roomValue,
        fallbackSourceText,
        [
          /(?:sala|room)\s*[:\-]?\s*([a-z]?\d{1,3})\b/i,
          /\b([a-z]?\d{1,3})\b(?=\s*(?:[áa]rea|area|fila|row|butacas|seats))/iu,
        ]
      ));

    const areaValue =
      (await this.getHeroFieldValueFromListItem([
        /^(?:[áa]rea|area|zone)\b\s*[:\-]?\s*/iu,
      ])) ||
      (await this.getHeroFieldValue(
        this.selectors.areaValue,
        fallbackSourceText,
        [
          /(?:[áa]rea|area|zone)\s*[:\-]?\s*([\p{L}\d\- ]{2,30}?)(?=\s+(?:fila|row|cambiar|devolver)|$)/iu,
        ]
      ));

    const seatRowValue =
      (await this.getHeroFieldValueFromListItem([
        /^(?:fila[-\s]*butacas|row[-\s]*seats|seats?)\b\s*[:\-]?\s*/i,
      ])) ||
      (await this.getHeroFieldValue(
        this.selectors.seatRowValue,
        fallbackSourceText,
        [
          /(?:fila[-\s]*butacas|row[-\s]*seats|seats?)\s*[:\-]?\s*([a-z]?\d+\s*[-,]\s*[a-z]?\d+)/i,
        ]
      ));

    return {
      qrReference,
      cinemaName,
      room: roomValue,
      area: areaValue,
      seatRow: seatRowValue,
    };
  }

  async getCountdownSnapshot(): Promise<LivingTicketCountdownSnapshot> {
    const headerTextRaw = await this.getFirstVisibleLocatorText(
      this.selectors.countdownHeader
    );

    const countdownValueLocators = await this.webActions
      .getLocator(this.selectors.countdownValues)
      .all();
    const countdownLabelLocators = await this.webActions
      .getLocator(this.selectors.countdownLabels)
      .all();

    let values = await Promise.all(
      countdownValueLocators.map(async (locator) =>
        ((await locator.textContent()) || '').trim()
      )
    );
    let labels = await Promise.all(
      countdownLabelLocators.map(async (locator) =>
        ((await locator.textContent()) || '').trim()
      )
    );

    if (values.length === 0 || labels.length === 0) {
      const textualMatches = Array.from(
        headerTextRaw.matchAll(/(\d+)\s*(d[ií]as?|horas?|minutos?|segundos?)/gi)
      );

      if (textualMatches.length > 0) {
        values = textualMatches.map((match) => match[1]);
        labels = textualMatches.map((match) => match[2]);
      }
    }

    return {
      headerText: headerTextRaw,
      values,
      labels,
    };
  }

  async getTransactionSnapshot(): Promise<LivingTicketTransactionSnapshot> {
    const summaryTextRaw = await this.getFirstVisibleLocatorText(
      this.selectors.transactionSummaryContainer
    );
    const summaryText = this.normalizeText(summaryTextRaw);
    const heroText = this.normalizeText(
      await this.getFirstVisibleLocatorText(this.selectors.heroContainer)
    );
    const pageText = this.normalizeText(
      (await this.webActions
        .getLocator(this.selectors.pageBody)
        .first()
        .textContent()
        .catch(() => '')) || ''
    );
    const combinedTransactionText = `${summaryText} ${heroText} ${pageText}`;

    const transactionId =
      (await this.getFirstVisibleTextFromSelectors([
        this.selectors.transactionId,
        '.movie-detailed-resume :text("Identificador")',
        '.transaction-summary :text("Identificador")',
        '.v-journey-details-section :text("Identificador")',
        '.movie-detailed-resume :text("Transaction")',
      ])) ||
      this.extractFirstMatch(summaryText, [
        /(identificador\s+de\s+la\s+transacci[oó]n\s*:\s*\d+)/i,
        /(transaction\s+id\s*:\s*\d+)/i,
      ]);

    const movieTitle =
      (await this.getFirstVisibleTextFromSelectors([
        this.selectors.movieTitle,
        '.movie-detailed-resume .movie-title',
        '.transaction-summary .movie-title',
        '.movie-detailed-resume h3',
        '.movie-detailed-resume strong',
      ])) ||
      this.extractFirstMatch(summaryText, [
        /(?:resumen\s+de\s+la\s+compra|purchase\s+summary)\s*([\p{L}\d\s:'’\-.,]{3,80})/iu,
      ]);

    const sessionInfo =
      (await this.getFirstVisibleTextFromSelectors([
        this.selectors.sessionInfo,
        '.movie-detailed-resume .session-info',
        '.transaction-summary .session-info',
        '.movie-detailed-resume [class*="session"]',
        '.transaction-summary [class*="session"]',
      ])) ||
      this.extractFirstMatch(combinedTransactionText, [
        /((?:lunes|martes|mi[eé]rcoles|jueves|viernes|s[áa]bado|domingo)[^\n]{5,120})/i,
        /((?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)[^\n]{5,120})/i,
      ]);

    const ticketLineLabel =
      (await this.getFirstVisibleTextFromSelectors([
        this.selectors.ticketLineLabel,
        '.v-journey-summary :text("Tus entradas")',
        '.v-journey-summary :text("1x")',
        '.movie-detailed-resume :text("Adult")',
        '.movie-detailed-resume :text("Tus entradas")',
        '.movie-detailed-resume :text("Tickets")',
        '.transaction-summary :text("Tickets")',
      ])) ||
      this.extractFirstMatch(summaryText, [
        /(\d+x\s*[\p{L}\s]{2,30})/iu,
        /(tus\s+entradas|your\s+tickets)/i,
      ]);

    const selectorTicketLinePrice = await this.getFirstVisibleTextFromSelectors(
      [this.selectors.ticketLinePrice]
    );
    const selectorTotalPrice = await this.getFirstVisibleTextFromSelectors([
      this.selectors.totalPrice,
      '.v-journey-summary :text("Total")',
      '.movie-detailed-resume :text("Total")',
      '.transaction-summary :text("Total")',
      '.v-journey-details-section :text("Total")',
    ]);
    const selectorManagementFee = await this.getFirstVisibleTextFromSelectors([
      this.selectors.managementFee,
      '.v-journey-summary :text("Gastos de gestión")',
      '.movie-detailed-resume :text("Gastos de gestión")',
      '.transaction-summary :text("Gastos de gestión")',
      '.movie-detailed-resume :text("Management fee")',
      '.transaction-summary :text("Management fee")',
    ]);

    const monetaryMatches =
      summaryText.match(/\d+[.,]\d{2}\s*€|€\s*\d+[.,]\d{2}/g) || [];
    const ticketLinePrice = this.normalizeText(
      selectorTicketLinePrice || monetaryMatches[0] || ''
    );
    const totalPrice = this.normalizeText(
      selectorTotalPrice || monetaryMatches[1] || monetaryMatches[0] || ''
    );
    const managementFee = this.normalizeText(
      selectorManagementFee || monetaryMatches[2] || ''
    );
    const savings = this.normalizeText(monetaryMatches[3] || '');

    return {
      transactionId,
      movieTitle,
      sessionInfo,
      lineItemLabel: ticketLineLabel,
      lineItemPrice: ticketLinePrice,
      totalPrice,
      managementFee,
      savings,
    };
  }

  async getSnapshot(): Promise<LivingTicketSnapshot> {
    return {
      hero: await this.getHeroSnapshot(),
      countdown: await this.getCountdownSnapshot(),
      transaction: await this.getTransactionSnapshot(),
    };
  }
}
