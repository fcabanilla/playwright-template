import { allure } from 'allure-playwright';
import { Page } from '@playwright/test';
import { WebActions } from '../../../core/webactions/webActions';
import { bookingConfirmationSelectors } from './bookingConfirmation.selectors';
import {
  BookingConfirmationSnapshot,
  CountdownSnapshot,
  WebloyaltyVariant,
} from './bookingConfirmation.types';

export class BookingConfirmationPage {
  private readonly selectors = bookingConfirmationSelectors;
  private readonly confirmationUrlPattern =
    /(confirmacion|confirmation|booking-confirmed|success)/i;

  constructor(private readonly webActions: WebActions) {}

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

  private async syncToActivePageIfNeeded(): Promise<void> {
    await this.webActions.syncToLatestActivePage();
  }

  async waitForLoaded(timeout = 90000): Promise<void> {
    await allure.step(
      'Wait for booking confirmation page to load',
      async () => {
        await this.syncToActivePageIfNeeded();
        const startTime = Date.now();

        await this.webActions.waitForLoadState('domcontentloaded');
        const urlMatched = await this.webActions.waitForUrlMatching(
          this.confirmationUrlPattern,
          Math.min(30000, timeout)
        );
        if (!urlMatched) {
          // URL didn't match within initial wait — polling loop will retry
        }

        const pollIntervalMs = 1000;

        while (Date.now() - startTime < timeout) {
          await this.syncToActivePageIfNeeded();

          const currentUrl = this.webActions.getCurrentUrl();
          const hasConfirmationUrl =
            this.confirmationUrlPattern.test(currentUrl);

          const headingVisible = await this.webActions
            .getLocator(this.selectors.confirmationHeading)
            .first()
            .isVisible()
            .catch(() => false);
          const containerVisible = await this.webActions
            .getLocator(this.selectors.confirmationContainer)
            .first()
            .isVisible()
            .catch(() => false);

          if ((headingVisible || containerVisible) && hasConfirmationUrl) {
            return;
          }

          await this.webActions.wait(pollIntervalMs);
        }

        throw new Error(
          `Booking confirmation did not become visible within ${timeout}ms`
        );
      }
    );
  }

  async waitForBookingConfirmationLoaded(timeout = 90000): Promise<void> {
    await this.waitForLoaded(timeout);
  }

  async isLoaded(): Promise<boolean> {
    await this.syncToActivePageIfNeeded();

    const hasHeading = await this.webActions
      .getLocator(this.selectors.confirmationHeading)
      .first()
      .isVisible()
      .catch(() => false);

    const hasPrimaryCta = await this.webActions
      .getLocator(this.selectors.confirmationPrimaryCta)
      .first()
      .isVisible()
      .catch(() => false);

    return hasHeading && hasPrimaryCta;
  }

  async getConfirmationSnapshot(): Promise<BookingConfirmationSnapshot> {
    await this.syncToActivePageIfNeeded();

    const headingText = (
      await this.webActions
        .getLocator(this.selectors.confirmationHeading)
        .first()
        .textContent()
    )
      ?.trim()
      .replace(/\s+/g, ' ');

    const messageText = (
      await this.webActions
        .getLocator(this.selectors.confirmationMessage)
        .first()
        .textContent()
    )
      ?.trim()
      .replace(/\s+/g, ' ');

    const primaryCta = this.webActions
      .getLocator(this.selectors.confirmationPrimaryCta)
      .first();
    const primaryCtaText = ((await primaryCta.textContent()) || '')
      .trim()
      .replace(/\s+/g, ' ');
    const primaryCtaHref =
      (await primaryCta.getAttribute('href')) || 'javascript:void(0);';

    return {
      headingText: headingText || '',
      messageText: messageText || '',
      primaryCtaText,
      primaryCtaHref,
    };
  }

  async getViewTicketsAndBarProductsHref(): Promise<string> {
    await this.syncToActivePageIfNeeded();

    return (
      (await this.webActions
        .getLocator(this.selectors.confirmationPrimaryCta)
        .first()
        .getAttribute('href')) || ''
    );
  }

  async clickViewTicketsAndBarProductsButton(): Promise<void> {
    await this.syncToActivePageIfNeeded();

    await this.webActions.waitForVisible(
      this.selectors.confirmationPrimaryCta,
      15000,
      'bookingConfirmationViewTicketsAndBarProductsButton'
    );
    await this.webActions.click(
      this.selectors.confirmationPrimaryCta,
      'bookingConfirmationViewTicketsAndBarProductsButton'
    );
  }

  async closeWebloyaltyOverlayWithStabilization(
    maxWaitMs = 7000
  ): Promise<boolean> {
    return await allure.step(
      'Stabilize and close Webloyalty overlay if it appears',
      async () => {
        await this.syncToActivePageIfNeeded();

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
    );
  }

  async navigateToReviewTicketSafely(): Promise<void> {
    await allure.step(
      'Navigate to review ticket after mandatory Webloyalty popup closure',
      async () => {
        await this.syncToActivePageIfNeeded();
        await this.closeMandatoryWebloyaltyPopup(12000);
        await this.clickViewTicketsAndBarProductsButton();
      }
    );
  }

  async getCountdownSnapshot(): Promise<CountdownSnapshot> {
    await this.syncToActivePageIfNeeded();

    const valueLocators = await this.webActions
      .getLocator(this.selectors.countdownValues)
      .all();
    const labelLocators = await this.webActions
      .getLocator(this.selectors.countdownLabels)
      .all();

    const values = await Promise.all(
      valueLocators.map(async (locator) => (await locator.textContent()) || '')
    );
    const labels = await Promise.all(
      labelLocators.map(async (locator) => (await locator.textContent()) || '')
    );

    return {
      values: values.map((value) => value.trim()),
      labels: labels.map((label) => label.trim()),
    };
  }

  async hasCalendarPrompt(): Promise<boolean> {
    await this.syncToActivePageIfNeeded();
    return await this.webActions
      .getLocator(this.selectors.calendarPrompt)
      .first()
      .isVisible()
      .catch(() => false);
  }

  async hasWalletButton(): Promise<boolean> {
    await this.syncToActivePageIfNeeded();
    return await this.webActions
      .getLocator(this.selectors.googleWalletButton)
      .first()
      .isVisible()
      .catch(() => false);
  }

  async isWebloyaltyOverlayVisible(): Promise<boolean> {
    await this.syncToActivePageIfNeeded();
    return await this.isAnyVisible(this.selectors.webloyaltyOverlayContainer);
  }

  async isWebloyaltyInlineVisible(): Promise<boolean> {
    await this.syncToActivePageIfNeeded();
    return await this.webActions
      .getLocator(this.selectors.webloyaltyInlineContainer)
      .first()
      .isVisible()
      .catch(() => false);
  }

  async detectWebloyaltyVariant(): Promise<WebloyaltyVariant> {
    const [overlayVisible, inlineVisible] = await Promise.all([
      this.isWebloyaltyOverlayVisible(),
      this.isWebloyaltyInlineVisible(),
    ]);

    if (overlayVisible && inlineVisible) {
      return 'both';
    }

    if (overlayVisible) {
      return 'overlay';
    }

    if (inlineVisible) {
      return 'inline';
    }

    return 'none';
  }

  async closeWebloyaltyOverlayWithXIfVisible(): Promise<boolean> {
    return await allure.step(
      'Close Webloyalty overlay with X if visible',
      async () => {
        await this.syncToActivePageIfNeeded();

        const isOverlayVisible = await this.isWebloyaltyOverlayVisible();
        if (!isOverlayVisible) {
          return false;
        }

        await this.webActions.waitForVisible(
          this.selectors.webloyaltyOverlayCloseButton,
          5000,
          'webloyaltyOverlayCloseButton'
        );
        await this.webActions.click(
          this.selectors.webloyaltyOverlayCloseButton,
          'webloyaltyOverlayCloseButton'
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
    );
  }

  async closeMandatoryWebloyaltyPopup(maxWaitMs = 12000): Promise<void> {
    await allure.step(
      'Close mandatory Webloyalty popup before continuing',
      async () => {
        await this.syncToActivePageIfNeeded();

        const deadline = Date.now() + maxWaitMs;
        let popupDetected = false;

        while (Date.now() < deadline) {
          const visible = await this.isWebloyaltyOverlayVisible();

          if (visible) {
            popupDetected = true;
            await this.closeWebloyaltyOverlayWithXIfVisible();

            const stillVisible = await this.isWebloyaltyOverlayVisible();
            if (!stillVisible) {
              return;
            }

            await this.webActions.wait(250);
            continue;
          }

          await this.webActions.wait(250);
        }

        if (!popupDetected) {
          console.log(
            `[BookingConfirmation] Webloyalty popup did not appear within ${maxWaitMs}ms — this is expected in some environments/timings`
          );
          return;
        }

        throw new Error(
          'Mandatory Webloyalty popup remained visible after close attempts'
        );
      }
    );
  }

  async getWebloyaltyOverlayPrimaryCtaTarget(): Promise<string> {
    await this.syncToActivePageIfNeeded();

    const locator = this.webActions
      .getLocator(this.selectors.webloyaltyOverlayPrimaryCta)
      .first();
    const href = await locator.getAttribute('href');
    const rel = await locator.getAttribute('rel');

    return href || rel || '';
  }

  async getWebloyaltyInlinePrimaryCtaTarget(): Promise<string> {
    await this.syncToActivePageIfNeeded();

    const locator = this.webActions
      .getLocator(this.selectors.webloyaltyInlinePrimaryCta)
      .first();
    const href = await locator.getAttribute('href');
    const rel = await locator.getAttribute('rel');

    return href || rel || '';
  }

  async isWebloyaltyPopupVisible(): Promise<boolean> {
    await this.syncToActivePageIfNeeded();
    const variant = await this.detectWebloyaltyVariant();
    return variant === 'overlay' || variant === 'both';
  }

  async closeWebloyaltyPopupWithXIfVisible(): Promise<boolean> {
    return await this.closeWebloyaltyOverlayWithXIfVisible();
  }
}
