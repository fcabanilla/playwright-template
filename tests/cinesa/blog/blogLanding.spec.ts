import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { BlogLandingAssertions } from './blogLanding.assertions';
import { blogLandingData } from './blogLanding.data';

test.describe('Blog Landing Page Tests', () => {
  let blogLandingAssertions: BlogLandingAssertions;

  test.beforeEach(
    async ({ page, blogLanding, promotionalModal }) => {
      await allure.epic('Cinesa Platform');
      await allure.feature('Blog - Content Platform');

      blogLandingAssertions = new BlogLandingAssertions(page);
      await promotionalModal.closeModalIfVisible();
      await blogLanding.navigateToPage();
    }
  );

  test(
    'should display the expected number of article cards',
    { tag: ['@blog', '@cinesa', '@display', '@fast', '@OCG-2009'] },
    async () => {
      await allure.story('OCG-2009 - Article cards count validation');
      await blogLandingAssertions.expectArticleCardsCount(
        blogLandingData.expectedArticleCardsCount
      );
    }
  );

  test(
    'should have all article cards visible',
    { tag: ['@blog', '@cinesa', '@display', '@fast', '@OCG-2009'] },
    async () => {
      await allure.story('OCG-2009 - Article cards visibility');
      await blogLandingAssertions.expectArticleCardsVisible();
    }
  );

  test(
    'should navigate through each related article and return to the Blog Landing page',
    {
      tag: [
        '@blog',
        '@cinesa',
        '@navigation',
        '@medium',
        '@OCG-2030',
        '@fix-test',
      ],
    },
    async () => {
      await allure.story('OCG-2030 - Related articles navigation flow');
      await blogLandingAssertions.expectNavigationThroughRelatedArticles();
    }
  );
});
