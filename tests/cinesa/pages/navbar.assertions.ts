import { Page, expect } from '@playwright/test';
import * as allure from 'allure-playwright';
import { BlogLanding } from '../../../pageObjectsManagers/cinesa/blog/blogLanding.page';

/**
 * Provides assertions related to the Blog Landing Page.
 */
export class BlogLandingAssertions {
  readonly page: Page;
  readonly blogLanding: BlogLanding;

  /**
   * Creates a new instance of BlogLandingAssertions.
   *
   * @param page - Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.blogLanding = new BlogLanding(page);
  }

  /**
   * Asserts that the number of article cards matches the expected count.
   *
   * @param expectedCount - Expected number of article cards.
   * @returns A Promise that resolves when the assertion is complete.
   */
  async expectArticleCardsCount(expectedCount: number): Promise<void> {
    await allure.test.step(
      'Verifying the number of article cards',
      async () => {
        const count: number = await this.blogLanding.countArticleCards();
        await expect(count).toBe(expectedCount);
      }
    );
  }

  /**
   * Asserts that all article cards are visible on the page.
   *
   * @returns A Promise that resolves when all assertions are complete.
   */
  async expectArticleCardsVisible(): Promise<void> {
    await allure.test.step('Verifying article cards visibility', async () => {
      const cardsLocator = this.blogLanding.getArticleCardsLocator();
      const count: number = await cardsLocator.count();
      for (let i = 0; i < count; i++) {
        await allure.test.step(
          `Verifying article card at index ${i} is visible`,
          async () => {
            await expect(cardsLocator.nth(i)).toBeVisible();
          }
        );
      }
    });
  }

  /**
   * Iterates over each related article card, clicks it, verifies navigation to a new URL,
   * and then navigates back to the original Blog Landing page.
   *
   * @returns A Promise that resolves when all assertions are complete.
   */
  async expectNavigationThroughRelatedArticles(): Promise<void> {
    await allure.test.step(
      'Verifying navigation through each related article',
      async () => {
        // Save the original URL of the Blog Landing page.
        const originalUrl: string = this.page.url();
        // Get the count of article cards.
        const count: number = await this.blogLanding.countArticleCards();

        // Use for-of loop over generated indices.
        for (const index of Array.from(Array(count).keys())) {
          await allure.test.step(
            `Navigating through article card at index ${index}`,
            async () => {
              // Re-query the locator in each iteration to prevent stale element issues.
              const articleLocator = this.blogLanding
                .getArticleCardsLocator()
                .nth(index);
              await expect(articleLocator).toBeVisible();

              // Click on the article card.
              await articleLocator.click();
              await this.page.waitForLoadState('networkidle');

              // Validate that the URL has changed.
              const newUrl: string = this.page.url();
              await expect(newUrl).not.toBe(originalUrl);

              // Navigate back to the original Blog Landing page.
              await this.page.goBack();
              await this.page.waitForLoadState('networkidle');

              // Confirm that we have returned to the original URL.
              await expect(this.page.url()).toBe(originalUrl);
            }
          );
        }
      }
    );
  }
}
