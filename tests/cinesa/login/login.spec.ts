import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';

import { enrichTestMetadata } from '../../../core/allure/allureMetadata';
test.describe('Login', () => {
  test.beforeEach(async ({ navbar, promotionalModal }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Authentication - User Access');
    await enrichTestMetadata(testInfo);

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  test(
    'Login · Auth · Login · Valid credentials',
    {
      tag: [
        '@lab-pass',
        '@preprod-pass',
        '@login',
        '@cinesa',
        '@smoke',
        '@fast',
      ],
    },
    async ({ loginPage, navbar }) => {
      await allure.story('User login with valid credentials');
      await navbar.navigateToSignIn();
      await loginPage.fillData();
      await loginPage.clickSubmit();
    }
  );

  test(
    'Login · Form · Display · Structure',
    {
      tag: [
        '@lab-pass',
        '@preprod-pass',
        '@login',
        '@cinesa',
        '@smoke',
        '@fast',
      ],
    },
    async ({ webActions, navbar }) => {
      await allure.story('Login form display validation');
      await navbar.navigateToSignIn();
      await webActions.waitForLoadState('domcontentloaded');
    }
  );
});
