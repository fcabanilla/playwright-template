import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertProgramsRedirection } from './programs.assertions';
import { UNLIMITED_PROGRAMS_URL } from './programs.data';

test.describe(
  'Programs Page',
  {
    tag: ['@programs', '@cinesa'],
  },
  () => {
    test.beforeEach(async ({ page, cookieBanner, promotionalModal, navbar }) => {
      await test.step('TC: https://se-ocg.atlassian.net/browse/COMS-16804', async () => {});
      await navbar.navigateToHome();
      await cookieBanner.acceptAllCookies();
      await promotionalModal.closeModalIfVisible();
    });

    test(
      'Programs unlimited display and layout from URL',
      {
        tag: ['@smoke', '@fast'],
      },
      async ({ page, unlimitedProgramsPage, cookieBanner, promotionalModal }) => {
        await test.step('Navigate to Programs Unlimited page', async () => {
          await page.goto(UNLIMITED_PROGRAMS_URL);
        });
        await cookieBanner.acceptAllCookies();
        await promotionalModal.closeModalIfVisible();
        await unlimitedProgramsPage.waitForProgramsUnlimitedPage();
        await takeScreenshot(page, test.info());
      }
    );

    test(
      'Programs unlimited display and layout from home page',
      {
        tag: ['@smoke', '@fast'],
      },
      async ({
        page,
        programsPage,
        unlimitedProgramsPage,
        navbar,
      }) => {
        await navbar.navigateToPrograms();

        await programsPage.waitForProgramsPage();
        await programsPage.clickUnlimitedButton();

        await unlimitedProgramsPage.waitForProgramsUnlimitedPage();
        await test.step('Take screenshot', async () => {
          await takeScreenshot(page, test.info());
        });
      }
    );

    test(
      'Programs page display and layout',
      {
        tag: ['@regression', '@medium'],
      },
      async ({ page, navbar }, testInfo) => {
        await navbar.navigateToPrograms();
        await takeScreenshot(
          page,
          testInfo,
          'Programs page display and layout'
        );
      }
    );

    test(
      'Cinesa Programs page redirection test',
      {
        tag: ['@regression', '@medium'],
      },
      async ({ page, navbar }) => {
        await navbar.navigateToPrograms();
        await assertProgramsRedirection(page);
      }
    );
  }
);
