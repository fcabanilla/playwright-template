import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { bookingConfirmationSelectors } from '../../../pageObjectsManagers/cinesa/bookingConfirmation/bookingConfirmation.selectors';
import { BookingConfirmationPage } from '../../../pageObjectsManagers/cinesa/bookingConfirmation/bookingConfirmation.page';
import { bookingConfirmationValidationData } from './bookingConfirmation.data';

export class BookingConfirmationAssertions {
  private readonly selectors = bookingConfirmationSelectors;

  constructor(
    private readonly bookingConfirmationPage: BookingConfirmationPage
  ) {}

  private get page(): Page {
    return this.bookingConfirmationPage.getCurrentPage();
  }

  private matchesAtLeastOnePattern(value: string, patterns: RegExp[]): boolean {
    return patterns.some((pattern) => pattern.test(value));
  }

  async expectBookingConfirmationUrl(): Promise<void> {
    await allure.step('Verify booking confirmation URL', async () => {
      const currentUrl = this.page.url();
      const hasExpectedKeyword =
        bookingConfirmationValidationData.confirmationUrlKeywords.some(
          (keyword) => currentUrl.toLowerCase().includes(keyword.toLowerCase())
        );

      await allure.parameter('Booking confirmation URL', currentUrl);
      expect(
        hasExpectedKeyword,
        `Expected booking confirmation URL. Current URL: ${currentUrl}`
      ).toBeTruthy();
    });
  }

  async expectBookingConfirmationBaseContent(): Promise<void> {
    await allure.step('Verify booking confirmation base content', async () => {
      const snapshot =
        await this.bookingConfirmationPage.getConfirmationSnapshot();

      await allure.parameter(
        'Booking confirmation heading',
        snapshot.headingText || 'N/A'
      );
      await allure.parameter(
        'Booking confirmation message',
        snapshot.messageText || 'N/A'
      );
      await allure.parameter(
        'Booking confirmation primary CTA',
        snapshot.primaryCtaText || 'N/A'
      );
      await allure.parameter(
        'Booking confirmation primary CTA href',
        snapshot.primaryCtaHref || 'N/A'
      );

      expect(
        this.matchesAtLeastOnePattern(
          snapshot.headingText,
          bookingConfirmationValidationData.headingPatterns
        ),
        `Unexpected booking confirmation heading: ${snapshot.headingText}`
      ).toBeTruthy();

      expect(
        this.matchesAtLeastOnePattern(
          snapshot.messageText,
          bookingConfirmationValidationData.messagePatterns
        ),
        `Unexpected booking confirmation message: ${snapshot.messageText}`
      ).toBeTruthy();

      expect(
        this.matchesAtLeastOnePattern(
          snapshot.primaryCtaText,
          bookingConfirmationValidationData.primaryCtaPatterns
        ),
        `Unexpected booking confirmation primary CTA text: ${snapshot.primaryCtaText}`
      ).toBeTruthy();

      expect(
        this.matchesAtLeastOnePattern(
          snapshot.primaryCtaHref,
          bookingConfirmationValidationData.primaryCtaHrefPatterns
        ),
        `Unexpected booking confirmation primary CTA href: ${snapshot.primaryCtaHref}`
      ).toBeTruthy();
    });
  }

  async expectCountdownContract(): Promise<void> {
    await allure.step(
      'Verify countdown contract on booking confirmation',
      async () => {
        const countdownContainer = this.page
          .locator(this.selectors.countdownContainer)
          .first();
        await expect(countdownContainer).toBeVisible({ timeout: 30000 });

        const snapshot =
          await this.bookingConfirmationPage.getCountdownSnapshot();

        await allure.parameter('Countdown values', snapshot.values.join(', '));
        await allure.parameter('Countdown labels', snapshot.labels.join(', '));

        expect(
          snapshot.values.length,
          'Countdown should expose 4 numeric blocks'
        ).toBe(4);
        expect(
          snapshot.labels.length,
          'Countdown should expose 4 label blocks'
        ).toBe(4);

        for (const value of snapshot.values) {
          expect(value, `Invalid countdown value: ${value}`).toMatch(
            /^[0-9]{1,2}$/
          );
        }

        for (const pattern of bookingConfirmationValidationData.countdownLabelPatterns) {
          const hasPattern = snapshot.labels.some((label) =>
            pattern.test(label)
          );
          expect(
            hasPattern,
            `Missing countdown label pattern: ${pattern}`
          ).toBeTruthy();
        }

        const hasCalendarPrompt =
          await this.bookingConfirmationPage.hasCalendarPrompt();
        await allure.parameter(
          'Has calendar prompt',
          hasCalendarPrompt ? 'Yes' : 'No'
        );
        expect(hasCalendarPrompt).toBeTruthy();
      }
    );
  }

  async expectWebloyaltyContractIfPresent(): Promise<void> {
    await allure.step('Verify Webloyalty contract if present', async () => {
      const variant =
        await this.bookingConfirmationPage.detectWebloyaltyVariant();
      await allure.parameter('Webloyalty variant', variant);

      if (variant === 'none') {
        return;
      }

      if (variant === 'overlay' || variant === 'both') {
        const overlayHeading = this.page
          .locator(this.selectors.webloyaltyOverlayHeading)
          .first();
        await expect(overlayHeading).toBeVisible({ timeout: 10000 });

        const overlayHeadingText =
          (await overlayHeading.textContent())?.trim().replace(/\s+/g, ' ') ||
          '';
        await allure.parameter(
          'Webloyalty overlay heading',
          overlayHeadingText || 'N/A'
        );
        expect(
          this.matchesAtLeastOnePattern(
            overlayHeadingText,
            bookingConfirmationValidationData.webloyaltyHeadingPatterns
          ),
          `Unexpected Webloyalty overlay heading: ${overlayHeadingText}`
        ).toBeTruthy();

        const overlayMessage = this.page
          .locator(this.selectors.webloyaltyOverlayMessage)
          .first();
        await expect(overlayMessage).toBeVisible({ timeout: 10000 });
        const overlayMessageText =
          (await overlayMessage.textContent())?.trim().replace(/\s+/g, ' ') ||
          '';
        await allure.parameter(
          'Webloyalty overlay message',
          overlayMessageText || 'N/A'
        );
        expect(
          this.matchesAtLeastOnePattern(
            overlayMessageText,
            bookingConfirmationValidationData.webloyaltyMessagePatterns
          ),
          `Unexpected Webloyalty overlay message: ${overlayMessageText}`
        ).toBeTruthy();

        const overlayTarget =
          await this.bookingConfirmationPage.getWebloyaltyOverlayPrimaryCtaTarget();
        await allure.parameter(
          'Webloyalty overlay target',
          overlayTarget || 'N/A'
        );
        expect(
          this.matchesAtLeastOnePattern(
            overlayTarget,
            bookingConfirmationValidationData.webloyaltyTargetPatterns
          ),
          `Unexpected Webloyalty overlay target: ${overlayTarget}`
        ).toBeTruthy();
      }

      if (variant === 'inline' || variant === 'both') {
        const inlineHeading = this.page
          .locator(this.selectors.webloyaltyInlineHeading)
          .first();
        await expect(inlineHeading).toBeVisible({ timeout: 10000 });

        const inlineHeadingText =
          (await inlineHeading.textContent())?.trim().replace(/\s+/g, ' ') ||
          '';
        await allure.parameter(
          'Webloyalty inline heading',
          inlineHeadingText || 'N/A'
        );
        expect(
          this.matchesAtLeastOnePattern(
            inlineHeadingText,
            bookingConfirmationValidationData.webloyaltyHeadingPatterns
          ),
          `Unexpected Webloyalty inline heading: ${inlineHeadingText}`
        ).toBeTruthy();

        const inlineMessage = this.page
          .locator(this.selectors.webloyaltyInlineMessage)
          .first();
        await expect(inlineMessage).toBeVisible({ timeout: 10000 });
        const inlineMessageText =
          (await inlineMessage.textContent())?.trim().replace(/\s+/g, ' ') ||
          '';
        await allure.parameter(
          'Webloyalty inline message',
          inlineMessageText || 'N/A'
        );
        expect(
          this.matchesAtLeastOnePattern(
            inlineMessageText,
            bookingConfirmationValidationData.webloyaltyMessagePatterns
          ),
          `Unexpected Webloyalty inline message: ${inlineMessageText}`
        ).toBeTruthy();

        const inlineTarget =
          await this.bookingConfirmationPage.getWebloyaltyInlinePrimaryCtaTarget();
        await allure.parameter(
          'Webloyalty inline target',
          inlineTarget || 'N/A'
        );
        expect(
          this.matchesAtLeastOnePattern(
            inlineTarget,
            bookingConfirmationValidationData.webloyaltyTargetPatterns
          ),
          `Unexpected Webloyalty inline target: ${inlineTarget}`
        ).toBeTruthy();
      }
    });
  }

  async closeWebloyaltyOverlayAndAssertNoNewTab(): Promise<void> {
    await allure.step(
      'Close Webloyalty overlay and assert no new tab opens',
      async () => {
        const pagesBefore = this.page.context().pages().length;
        const closed =
          await this.bookingConfirmationPage.closeWebloyaltyOverlayWithXIfVisible();

        await allure.parameter(
          'Webloyalty overlay closed',
          closed ? 'Yes' : 'No'
        );

        if (!closed) {
          return;
        }

        const pagesAfter = this.page.context().pages().length;
        expect(
          pagesAfter,
          'Closing Webloyalty overlay with X should not open a new tab'
        ).toBe(pagesBefore);
      }
    );
  }

  async handleWebloyaltyPopupIfPresentAndCloseWithX(): Promise<void> {
    await this.closeWebloyaltyOverlayAndAssertNoNewTab();
  }
}
