import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshotForModal } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { SIGNUP_SELECTORS } from '../../../pageObjectsManagers/cinesa/signup/signup.selectors';
import { defaultUser } from './signup.data';

test.describe('Signup', () => {
  test.beforeEach(async ({ page, navbar, cookieBanner, promotionalModal }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test('Signup display and layout', 
    { tag: ['@signup', '@cinesa', '@smoke', '@fast'] },
    async ({ page, navbar }, testInfo) => {
    await navbar.navigateToSignup();
    await takeScreenshotForModal(
      page,
      testInfo,
      SIGNUP_SELECTORS.modalContainer
    );
  });

  test('Validate mandatory fields DEMO test', 
    { tag: ['@signup', '@cinesa', '@regression', '@medium'] },
    async ({
    page,
    navbar,
    signupPage,
  }, testInfo) => {
    await test.step('TC: https://se-ocg.atlassian.net/browse/COMS-7217', async () => {});
    await navbar.navigateToSignup();
    await signupPage.validateMandatoryFields();
    await takeScreenshotForModal(
      page,
      testInfo,
      SIGNUP_SELECTORS.modalContainer
    );
  });

  test('Validate email', 
    { tag: ['@signup', '@cinesa', '@regression', '@medium'] },
    async ({ page, navbar, signupPage }, testInfo) => {
    await navbar.navigateToSignup();
    await signupPage.validateEmailFields();
    await takeScreenshotForModal(
      page,
      testInfo,
      SIGNUP_SELECTORS.modalContainer
    );
  });

  test('Validate password', 
    { tag: ['@signup', '@cinesa', '@regression', '@medium'] },
    async ({ page, navbar, signupPage }, testInfo) => {
    await navbar.navigateToSignup();
    await signupPage.validatePasswordFields();
    await takeScreenshotForModal(
      page,
      testInfo,
      SIGNUP_SELECTORS.modalContainer
    );
  });

  test('Signup with valid data and unique email', 
    { tag: ['@signup', '@cinesa', '@regression', '@high'] },
    async ({
    page,
    navbar,
    signupPage,
  }, testInfo) => {
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
  });
});
