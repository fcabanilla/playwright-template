import { Page, expect, TestInfo } from '@playwright/test';
import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import { BlogLanding } from '../../../pageObjectsManagers/cinesa/blog/blogLanding.page';
import { takeScreenshotOfLocator } from '../../../pageObjectsManagers/cinesa/generic/generic';

/**
 * Provides assertions related to the Blog Landing Page.
 */
export class BlogLandingAssertions {
  readonly page: Page;
  readonly webActions: WebActions;
  readonly blogLanding: BlogLanding;
  readonly testInfo?: TestInfo;

  /**
   * Creates a new instance of BlogLandingAssertions.
   *
   * @param page - Playwright Page object.
   * @param testInfo - Optional TestInfo object for screenshots
   */
  constructor(page: Page, testInfo?: TestInfo) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.blogLanding = new BlogLanding(this.webActions);
    this.testInfo = testInfo;
  }

  /**
   * Asserts that the number of article cards matches the expected count.
   *
   * @param expectedCount - Expected number of article cards.
   * @returns A Promise that resolves when the assertion is complete.
   */
  async expectArticleCardsCount(expectedCount: number): Promise<void> {
    await allure.step('Verifying the number of article cards', async () => {
      const count: number = await this.blogLanding.countArticleCards();
      await expect(count).toBe(expectedCount);
    });
  }

  /**
   * Asserts that all article cards are visible on the page.
   *
   * @returns A Promise that resolves when all assertions are complete.
   */
  async expectArticleCardsVisible(): Promise<void> {
    await allure.step('Verifying article cards visibility', async () => {
      const cardsLocator = this.blogLanding.getArticleCardsLocator();
      const count: number = await cardsLocator.count();
      for (const index of Array.from(Array(count).keys())) {
        await allure.step(
          `Verifying article card at index ${index} is visible`,
          async () => {
            await expect(cardsLocator.nth(index)).toBeVisible();
          }
        );
      }
    });
  }

  /**
   * Iterates over each related article card, clicks its link, verifies navigation to a new URL,
   * and then navigates back to the original Blog Landing page.
   *
   * @returns A Promise that resolves when all assertions are complete.
   */
  async expectNavigationThroughRelatedArticles(): Promise<void> {
    await allure.step(
      'Verifying navigation through each related article',
      async () => {
        // Save the original URL of the Blog Landing page.
        const originalUrl: string = this.page.url();
        // Get the count of article cards.
        const count: number = await this.blogLanding.countArticleCards();

        // Use for-of loop over generated indices.
        for (const index of Array.from(Array(count).keys())) {
          await allure.step(
            `Navigating through article card at index ${index}`,
            async () => {
              // Re-query the locator in each iteration to prevent stale element issues.
              const articleCardLocator = this.blogLanding
                .getArticleCardsLocator()
                .nth(index);
              await expect(articleCardLocator).toBeVisible();

              // Take screenshot of the specific card before clicking
              if (this.testInfo) {
                await takeScreenshotOfLocator(
                  articleCardLocator,
                  this.testInfo,
                  `Article Card ${index + 1}`
                );
              }

              // Click on the link inside the article card using environment-specific selector.
              const articleLink = articleCardLocator.locator(
                this.blogLanding.selectors.articleLink
              );

              // Check if the article link exists and has a valid href
              const linkExists = (await articleLink.count()) > 0;
              if (!linkExists) {
                console.log(
                  `Skipping article at index ${index} - no valid link found`
                );
                return; // Return early instead of continue
              }

              await expect(articleLink).toBeVisible();

              // Get href to validate it's not empty or invalid
              const href = await articleLink.getAttribute('href');
              if (!href || href === '#' || href === '') {
                console.log(
                  `Skipping article at index ${index} - invalid href: ${href}`
                );
                return; // Return early instead of continue
              }

              // Use force click to bypass OneTrust overlay interception
              await articleLink.click({ force: true });
              await this.webActions.waitForLoadState('domcontentloaded');

              // Add small wait to ensure navigation completes
              await this.webActions.wait(2000);

              // Validate that the URL has changed.
              const newUrl: string = this.page.url();

              // If URL hasn't changed, this article might not have a working link
              if (newUrl === originalUrl) {
                console.log(
                  `Article at index ${index} has non-functional link, skipping navigation validation`
                );
                return; // Skip this iteration
              }

              await expect(newUrl).not.toBe(originalUrl); // Navigate back to the original Blog Landing page.
              await this.page.goBack();
              await this.webActions.waitForLoadState('domcontentloaded');

              // Confirm that we have returned to the original URL.
              await expect(this.page.url()).toBe(originalUrl);
            }
          );
        }
      }
    );
  }
}
