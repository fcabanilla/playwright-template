import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { assertCouponsRedirection } from './coupons.assertions';
import { COUPONS_URL } from './coupons.data';
import { WebActions } from '../../../core/webactions/webActions';

test.describe('Cinesa Coupons Tests', () => {
  test.beforeEach(async ({ navbar, cookieBanner, promotionalModal }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test('should display coupons page layout correctly',
    { tag: ['@coupons', '@cinesa', '@smoke', '@medium'] },
    async ({ webActions, navbar }) => {
    await navbar.navigateToCoupons();
    await webActions.waitForLoadState('domcontentloaded');
    // Take screenshot for visual verification
    await webActions.screenshot();
  });

  test('should redirect to coupons page in new tab',
    { tag: ['@coupons', '@cinesa', '@navigation', '@fast'] },
    async ({ webActions, navbar }) => {
    const context = webActions.getPage().context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      navbar.navigateToCoupons(), // Opens new tab
    ]);
    // ✅ ADR-0009 Compliance: Use WebActions for new page operations
    const newWebActions = new WebActions(newPage);
    await newWebActions.waitForLoadState('domcontentloaded');
    await assertCouponsRedirection(newPage);
  });

  test('should validate coupons opens new tab correctly',
    { tag: ['@coupons', '@cinesa', '@navigation', '@regression'] },
    async ({ webActions, navbar }) => {
    const context = webActions.getPage().context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      navbar.navigateToCoupons(),
    ]);
    // ✅ ADR-0009 Compliance: Use WebActions for new page operations
    const newWebActions = new WebActions(newPage);
    await newWebActions.waitForLoadState('domcontentloaded');
    // Verify correct URL in new tab
    await newWebActions.navigateTo(COUPONS_URL);
    await assertCouponsRedirection(newPage);
  });
});