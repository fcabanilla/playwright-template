import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertProgramsRedirection } from './programs.assertions';

test.describe(
  'Programs Page',
  {
    tag: ['@programs', '@cinesa'],
  },
  () => {
    test.beforeEach(
      async ({ page, cookieBanner, promotionalModal, navbar }) => {
        await allure.epic('Cinesa Platform');
        await allure.feature('Loyalty Programs - Rewards');

        await test.step('TC: https://se-ocg.atlassian.net/browse/COMS-16804', async () => {});
        await navbar.navigateToHome();
        await cookieBanner.acceptAllCookies();
        await promotionalModal.closeModalIfVisible();
      }
    );

    test(
      'Programs unlimited display and layout from URL',
      {
        tag: ['@smoke', '@fast', '@COMS-11226', '@broken-prod'],
      },
      async ({
        page,
        unlimitedProgramsPage,
        cookieBanner,
        promotionalModal,
      }) => {
        await allure.story('COMS-11226 - Unlimited programs page from URL');
        await test.step('Navigate to Programs Unlimited page', async () => {
          await unlimitedProgramsPage.navigateToUnlimitedPrograms();
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
        tag: ['@smoke', '@fast', '@COMS-11226'],
      },
      async ({ page, programsPage, unlimitedProgramsPage, navbar }) => {
        await allure.story('COMS-11226 - Unlimited programs page from home');
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
        await allure.story('Programs page display and layout');
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
        await allure.story('Programs page URL redirection validation');
        await navbar.navigateToPrograms();
        await assertProgramsRedirection(page);
      }
    );
  }
);
