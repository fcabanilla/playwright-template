import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { takeScreenshotForModal } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { SIGNUP_SELECTORS } from '../../../pageObjectsManagers/cinesa/signup/signup.selectors';
import { defaultUser } from './signup.data';

test.describe('Signup', () => {
  test.beforeEach(async ({ page, navbar, promotionalModal }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Registration - New Users');

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  test(
    'Signup display and layout',
    { tag: ['@signup', '@cinesa', '@smoke', '@fast', '@COMS-7212'] },
    async ({ page, navbar }, testInfo) => {
      await allure.story('COMS-7212 - Signup form display and layout');
      await navbar.navigateToSignup();
      await takeScreenshotForModal(
        page,
        testInfo,
        SIGNUP_SELECTORS.modalContainer
      );
    }
  );

  test(
    'Validate mandatory fields DEMO test',
    { tag: ['@signup', '@cinesa', '@regression', '@medium', '@COMS-7217'] },
    async ({ page, navbar, signupPage }, testInfo) => {
      await allure.story('COMS-7217 - Mandatory fields validation');
      await test.step('TC: https://se-ocg.atlassian.net/browse/COMS-7217', async () => {});
      await navbar.navigateToSignup();
      await signupPage.validateMandatoryFields();
      await takeScreenshotForModal(
        page,
        testInfo,
        SIGNUP_SELECTORS.modalContainer
      );
    }
  );

  test(
    'Validate email',
    { tag: ['@signup', '@cinesa', '@regression', '@medium'] },
    async ({ page, navbar, signupPage }, testInfo) => {
      await allure.story('Email field validation');
      await navbar.navigateToSignup();
      await signupPage.validateEmailFields();
      await takeScreenshotForModal(
        page,
        testInfo,
        SIGNUP_SELECTORS.modalContainer
      );
    }
  );

  test(
    'Validate password',
    { tag: ['@signup', '@cinesa', '@regression', '@medium', '@COMS-7219'] },
    async ({ page, navbar, signupPage }, testInfo) => {
      await allure.story('COMS-7219 - Password field validation');
      await navbar.navigateToSignup();
      await signupPage.validatePasswordFields();
      await takeScreenshotForModal(
        page,
        testInfo,
        SIGNUP_SELECTORS.modalContainer
      );
    }
  );

  test(
    'Signup with valid data and unique email',
    {
      tag: [
        '@signup',
        '@cinesa',
        '@regression',
        '@high',
        '@OCG-3438',
        '@COMS-7211',
      ],
    },
    async ({ page, navbar, signupPage }, testInfo) => {
      await allure.story(
        'OCG-3438 / COMS-7211 - Complete signup with valid data'
      );
      await navbar.navigateToSignup();
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
      const email = `${defaultUser.user}+${timestamp}@${defaultUser.domain}`;
      const id = '35' + (Date.now() % 1000000).toString().padStart(6, '0');
      await signupPage.fillData({
        name: defaultUser.name,
        lastName: defaultUser.lastName,
        email,
        birthDate: defaultUser.birthDate,
        phone: defaultUser.phone,
        favoriteCinema: defaultUser.favoriteCinema,
        id,
        password: defaultUser.password,
      });
      await signupPage.checkTermsAndConditionsCheckbox();
      await signupPage.clickRegister();
      //TODO: problema de captcha
    }
  );
});
