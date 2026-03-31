import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { assertCouponsRedirection } from './coupons.assertions';
import { COUPONS_URL } from './coupons.data';
import { WebActions } from '../../../core/webactions/webActions';

const env = process.env.TEST_ENV || 'production';

test.describe('Cinesa Coupons Tests', () => {
  test.skip(
    env === 'lab' || env === 'preprod',
    'Coupons (Bonos) link not available in lab/preprod environments'
  );

  test.beforeEach(async ({ navbar, promotionalModal }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Coupons - Discount System');

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  test(
    'Coupons · Page · Display & Layout',
    { tag: ['@coupons', '@cinesa', '@smoke', '@medium'] },
    async ({ webActions, navbar }) => {
      await allure.story('Coupons page display and layout');
      await navbar.navigateToCoupons();
      await webActions.waitForLoadState('domcontentloaded');
      // Take screenshot for visual verification
      await webActions.screenshot();
    }
  );

  test(
    'Coupons · Navigation · Redirect · New tab',
    { tag: ['@coupons', '@cinesa', '@navigation', '@fast'] },
    async ({ webActions, navbar }) => {
      await allure.story('Coupons navigation in new tab');
      const context = webActions.getPage().context();

      // Set up the page listener before clicking
      const pagePromise = context.waitForEvent('page', { timeout: 10000 });

      // Click the coupons link
      await navbar.navigateToCoupons();

      // Wait for the new page
      const newPage = await pagePromise;

      // ✅ ADR-0009 Compliance: Use WebActions for new page operations
      const newWebActions = new WebActions(newPage);
      await newWebActions.waitForLoadState('domcontentloaded');
      await assertCouponsRedirection(newPage);
    }
  );

  test(
    'Coupons · Navigation · Validate · Open in new tab',
    { tag: ['@coupons', '@cinesa', '@navigation', '@regression'] },
    async ({ webActions, navbar }) => {
      await allure.story('Coupons new tab URL validation');
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
    }
  );
});
