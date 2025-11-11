import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import {
  assertFooterCoreElementsVisible,
  assertFooterElementsVisible,
  assertNavigateToBlog,
  assertFooterCompanyNavigation,
  assertFooterSocialMediaLinks,
  assertFooterLegalLinks,
  assertFooterAppLinks,
} from './footer.assertions';

test.describe('Cinesa Footer Tests', () => {
  test.beforeEach(async ({ footer, promotionalModal }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  test(
    'should display essential footer navigation elements',
    { tag: ['@smoke', '@critical', '@footer', '@cinesa'] },
    async ({ webActions, footer }) => {
      await allure.story('Essential footer elements visibility');
      await assertFooterCoreElementsVisible(
        webActions.getPage(),
        footer.selectors
      );
    }
  );

  test(
    'should display all footer elements comprehensively',
    { tag: ['@regression', '@footer', '@cinesa'] },
    async ({ webActions, footer }) => {
      await allure.story('Comprehensive footer elements display');
      await assertFooterElementsVisible(webActions.getPage(), footer.selectors);
    }
  );

  test(
    'should navigate to blog and validate URL',
    { tag: ['@smoke', '@footer', '@navigation', '@cinesa'] },
    async ({ webActions, footer }) => {
      await allure.story('Blog navigation from footer');
      
      // Page Object determines the correct selector for the environment
      const blogSelector = footer.getBlogSelector();
      
      // Import baseUrl from data file
      const { baseUrl } = await import('./footer.data');
      
      // Assertions receive the selector determined by Page Object
      await assertNavigateToBlog(webActions.getPage(), blogSelector, baseUrl);
    }
  );

  test(
    'should navigate to company pages',
    { tag: ['@smoke', '@footer', '@company', '@cinesa'] },
    async ({ webActions, footer }) => {
      await allure.story('Company pages navigation');
      await assertFooterCompanyNavigation(
        webActions.getPage(),
        footer.selectors
      );
    }
  );

  test(
    'should display all social media links',
    { tag: ['@fast', '@footer', '@social', '@cinesa'] },
    async ({ webActions, footer }) => {
      await allure.story('Social media links display');
      await assertFooterSocialMediaLinks(
        webActions.getPage(),
        footer.selectors
      );
    }
  );

  test(
    'should display legal documentation links',
    { tag: ['@medium', '@footer', '@legal', '@cinesa'] },
    async ({ webActions, footer }) => {
      await allure.story('Legal documentation links');
      await assertFooterLegalLinks(webActions.getPage(), footer.selectors);
    }
  );

  test(
    'should display mobile app download links',
    { tag: ['@medium', '@footer', '@apps', '@cinesa'] },
    async ({ webActions, footer }) => {
      await allure.story('Mobile app download links');
      await assertFooterAppLinks(webActions.getPage(), footer.selectors);
    }
  );
});
