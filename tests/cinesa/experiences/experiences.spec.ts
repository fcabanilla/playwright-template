import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { assertExperiencesRedirection } from './experiences.assertions';
import { EXPERIENCES_URL } from './experiences.data';

test.describe('Cinesa Experiences Tests', () => {
  test.beforeEach(async ({ navbar, promotionalModal }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Experiences - Premium Formats');

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  test(
    'Experiences · Page · Display & Layout',
    {
      tag: [
        '@lab-pass',
        '@preprod-pass',
        '@experiences',
        '@cinesa',
        '@smoke',
        '@medium',
      ],
    },
    async ({ webActions, navbar }) => {
      await allure.story('Experiences page display and layout');
      await navbar.navigateToExperiences();
      await webActions.waitForLoadState('domcontentloaded');
      // Verify we're on the correct experiences URL
      await webActions.expectUrl(EXPERIENCES_URL);
      // Take screenshot for visual verification
      await webActions.screenshot();
    }
  );

  test(
    'Experiences · Navigation · Redirect',
    {
      tag: [
        '@lab-pass',
        '@preprod-pass',
        '@experiences',
        '@cinesa',
        '@navigation',
        '@fast',
      ],
    },
    async ({ webActions, navbar }) => {
      await allure.story('Experiences page URL redirection validation');
      await navbar.navigateToExperiences();
      await webActions.waitForLoadState('domcontentloaded');
      await assertExperiencesRedirection(webActions.getPage());
    }
  );
});
