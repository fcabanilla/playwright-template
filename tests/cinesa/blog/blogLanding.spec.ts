import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { BlogLandingAssertions } from './blogLanding.assertions';
import { blogLandingData } from './blogLanding.data';

test.describe('Blog Landing Page Tests', () => {
  let blogLandingAssertions: BlogLandingAssertions;

  test.beforeEach(async ({ page, blogLanding }) => {
    blogLandingAssertions = new BlogLandingAssertions(page);
    await blogLanding.navigateToPage();
  });

  test('should display the expected number of article cards', async () => {
    await blogLandingAssertions.expectArticleCardsCount(blogLandingData.expectedArticleCardsCount);
  });

  test('should have all article cards visible', async () => {
    await blogLandingAssertions.expectArticleCardsVisible();
  });

  test('should navigate through each related article and return to the Blog Landing page', async () => {
    await blogLandingAssertions.expectNavigationThroughRelatedArticles();
  });
});