import { test } from '../../../fixtures/cinesa/playwright.fixtures';
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
  test.beforeEach(async ({ footer, cookieBanner, promotionalModal }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test('should display essential footer navigation elements', 
    { tag: ['@smoke', '@critical', '@footer', '@cinesa'] },
    async ({ webActions, footer }) => {
    await assertFooterCoreElementsVisible(webActions.getPage(), footer.selectors);
  });

  test('should display all footer elements comprehensively', 
    { tag: ['@regression', '@footer', '@cinesa'] },
    async ({ webActions, footer }) => {
    await assertFooterElementsVisible(webActions.getPage(), footer.selectors);
  });

  test('should navigate to blog and validate URL', 
    { tag: ['@smoke', '@footer', '@navigation', '@cinesa'] },
    async ({ webActions, footer }) => {
    await assertNavigateToBlog(webActions.getPage(), footer.selectors);
  });

  test('should navigate to company pages', 
    { tag: ['@smoke', '@footer', '@company', '@cinesa'] },
    async ({ webActions, footer }) => {
    await assertFooterCompanyNavigation(webActions.getPage(), footer.selectors);
  });

  test('should display all social media links', 
    { tag: ['@fast', '@footer', '@social', '@cinesa'] },
    async ({ webActions, footer }) => {
    await assertFooterSocialMediaLinks(webActions.getPage(), footer.selectors);
  });

  test('should display legal documentation links', 
    { tag: ['@medium', '@footer', '@legal', '@cinesa'] },
    async ({ webActions, footer }) => {
    await assertFooterLegalLinks(webActions.getPage(), footer.selectors);
  });

  test('should display mobile app download links', 
    { tag: ['@medium', '@footer', '@apps', '@cinesa'] },
    async ({ webActions, footer }) => {
    await assertFooterAppLinks(webActions.getPage(), footer.selectors);
  });
});
