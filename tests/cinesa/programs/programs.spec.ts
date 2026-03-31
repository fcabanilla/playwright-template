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
    test.beforeEach(async ({ page, promotionalModal, navbar }) => {
      await allure.epic('Cinesa Platform');
      await allure.feature('Loyalty Programs - Rewards');

      await test.step('TC: https://se-ocg.atlassian.net/browse/COMS-16804', async () => {});
      await navbar.navigateToHome();
      await promotionalModal.closeModalIfVisible();
    });

    test(
      'Programs · Unlimited · Display & Layout · From URL',
      {
        tag: [
          '@lab-pass',
          '@preprod-fail',
          '@smoke',
          '@fast',
          '@COMS-11226',
          '@broken-prod',
        ],
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
        await promotionalModal.closeModalIfVisible();
        await unlimitedProgramsPage.waitForProgramsUnlimitedPage();
        await takeScreenshot(page, test.info());
      }
    );

    test(
      'Programs · Unlimited · Display & Layout · From Home',
      {
        tag: ['@lab-pass', '@preprod-pass', '@smoke', '@fast', '@COMS-11226'],
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
      'Programs · Page · Display & Layout',
      {
        tag: ['@lab-pass', '@preprod-pass', '@regression', '@medium'],
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
      'Programs · Page · Navigate · Redirect',
      {
        tag: ['@lab-pass', '@preprod-pass', '@regression', '@medium'],
      },
      async ({ page, navbar }) => {
        await allure.story('Programs page URL redirection validation');
        await navbar.navigateToPrograms();
        await assertProgramsRedirection(page);
      }
    );
  }
);
