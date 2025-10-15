/**
 * Script to generate authenticated state files for Cinesa users
 *
 * Usage:
 * TEST_ENV=lab npx playwright test tests/cinesa/auth/generateAuthState.spec.ts --headed --project="Cinesa"
 *
 * This will create: userAuthState.lab.json
 */

import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { cinesaTestAccounts } from '../../../config/testAccounts';

const stateFiles = {
  prod: 'userAuthState.json',
  preprod: 'userAuthState.preprod.json',
  lab: 'userAuthState.lab.json',
};

test.describe.configure({ mode: 'serial' });

test('Generate authenticated user state', async ({
  page,
  navbar,
  loginPage,
  promoModal,
}) => {
  const environment = (process.env.TEST_ENV ||
    'prod') as keyof typeof stateFiles;
  const testAccount = cinesaTestAccounts.valid.noMembership;

  console.log(`\n🌍 Environment: ${environment}`);
  console.log(`📧 Account: ${testAccount.email}`);
  console.log(`💾 State file: ${stateFiles[environment]}\n`);

  // FIX CORS: Remove problematic headers only for LAB API requests
  const apiPattern = '**/WSVistaWebClient/**';
  await page.route(apiPattern, async (route) => {
    const headers = { ...route.request().headers() };
    // Remove headers that cause CORS issues with LAB API
    delete headers['cache-control'];
    delete headers['pragma'];

    await route.continue({ headers });
  });

  // Capture console errors
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error') {
      console.log(`🔴 ${msg.text()}`);
    }
  });

  // Navigate to home
  console.log('🏠 Navigating to home...');
  await navbar.navigateToHome();

  // Close promotional modal if present
  console.log('📢 Checking for promotional modal...');
  await promoModal.dismissIfVisible(3000);

  // Open login form
  console.log('🔐 Opening login form...');
  await navbar.clickSignin();

  // Fill login form
  console.log('✍️  Filling login form...');
  await loginPage.fillData(testAccount.email, testAccount.password);

  // Click submit
  console.log('✅ Submitting login...');
  await loginPage.clickSubmit();

  // Wait for authentication to complete
  console.log('⏳ Waiting for authentication...');
  await page.waitForTimeout(5000);

  // Verify authentication by checking for account button
  const accountButton = page.locator('button.v-header-primary__item--account');
  const isAuthenticated = await accountButton
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  if (isAuthenticated) {
    console.log('✅ User authenticated successfully!');

    // Save authentication state
    await page.context().storageState({ path: stateFiles[environment] });
    console.log(`💾 Authentication state saved to: ${stateFiles[environment]}`);
    console.log('\n✨ You can now use this state file in your tests!\n');
  } else {
    console.log('❌ Authentication failed - account button not visible');
    throw new Error('Login failed');
  }
});
