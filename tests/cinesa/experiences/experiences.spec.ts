import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { assertExperiencesRedirection } from './experiences.assertions';
import { EXPERIENCES_URL } from './experiences.data';

test.describe('Cinesa Experiences Tests', () => {
  test.beforeEach(async ({ navbar, cookieBanner, promotionalModal }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test('should display experiences page layout correctly', 
    { tag: ['@experiences', '@cinesa', '@smoke', '@medium'] },
    async ({ webActions, navbar }) => {
    await navbar.navigateToExperiences();
    await webActions.waitForLoadState('domcontentloaded');
    // Verify we're on the correct experiences URL
    await webActions.expectUrl(EXPERIENCES_URL);
    // Take screenshot for visual verification
    await webActions.screenshot();
  });

  test('should redirect to experiences page correctly', 
    { tag: ['@experiences', '@cinesa', '@navigation', '@fast'] },
    async ({ webActions, navbar }) => {
    await navbar.navigateToExperiences();
    await webActions.waitForLoadState('domcontentloaded');
    await assertExperiencesRedirection(webActions.getPage());
  });
});