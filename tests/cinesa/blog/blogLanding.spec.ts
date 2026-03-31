import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { BlogLandingAssertions } from './blogLanding.assertions';
import { blogLandingData } from './blogLanding.data';

test.describe('Blog Landing Page Tests', () => {
  let blogLandingAssertions: BlogLandingAssertions;

  test.beforeEach(async ({ page, blogLanding, promotionalModal }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Blog - Content Platform');

    blogLandingAssertions = new BlogLandingAssertions(page, testInfo);
    await promotionalModal.closeModalIfVisible();
    await blogLanding.navigateToPage();
  });

  test(
    'Blog · Landing · Display · Article cards',
    {
      tag: [
        '@lab-pass',
        '@preprod-fail',
        '@blog',
        '@cinesa',
        '@display',
        '@fast',
        '@OCG-2009',
      ],
    },
    async () => {
      await allure.story('OCG-2009 - Article cards count validation');
      await blogLandingAssertions.expectArticleCardsCount(
        blogLandingData.expectedArticleCardsCount
      );
    }
  );

  test(
    'Blog · Landing · Display · All article cards visible',
    {
      tag: [
        '@lab-pass',
        '@preprod-pass',
        '@blog',
        '@cinesa',
        '@display',
        '@fast',
        '@OCG-2009',
      ],
    },
    async () => {
      await allure.story('OCG-2009 - Article cards visibility');
      await blogLandingAssertions.expectArticleCardsVisible();
    }
  );

  test(
    'Blog · Landing · Navigate · Related articles roundtrip',
    {
      tag: [
        '@lab-fail',
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
